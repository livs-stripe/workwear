import Stripe from "stripe";
import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { recordEvent } from "@/lib/events";
import {
  ENTERPRISE_CLIENTS,
  ENTERPRISE_SOURCE,
  ENTERPRISE_TYPE,
  clientEmail,
} from "@/lib/enterprise";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

async function findExisting(
  stripe: Stripe
): Promise<Map<string, Stripe.Customer>> {
  const byName = new Map<string, Stripe.Customer>();
  // Prefer Search (metadata-indexed); fall back to a list scan if Search is
  // unavailable on the account.
  try {
    const res = await stripe.customers.search({
      query: `metadata["source"]:"${ENTERPRISE_SOURCE}"`,
      limit: 100,
    });
    for (const c of res.data) {
      if (c.name) byName.set(c.name, c);
    }
    if (byName.size > 0) return byName;
  } catch {
    // ignore and fall through to list()
  }

  for await (const c of stripe.customers.list({ limit: 100 })) {
    if (c.metadata?.source === ENTERPRISE_SOURCE && c.name) {
      byName.set(c.name, c);
    }
  }
  return byName;
}

export async function POST() {
  try {
    const stripe = getStripe();
    const existing = await findExisting(stripe);

    const results: { id: string; name: string; email: string }[] = [];

    for (const client of ENTERPRISE_CLIENTS) {
      const email = clientEmail(client);
      const found = existing.get(client.name);
      if (found) {
        results.push({
          id: found.id,
          name: found.name ?? client.name,
          email: found.email ?? email,
        });
        continue;
      }

      const created = await stripe.customers.create({
        name: client.name,
        email,
        address: client.address,
        description: `${client.name} — Workwear Group enterprise account`,
        metadata: { type: ENTERPRISE_TYPE, source: ENTERPRISE_SOURCE },
      });
      recordEvent({
        type: "customer.created",
        objectId: created.id,
        summary: `${client.name} enterprise account onboarded`,
      });
      results.push({
        id: created.id,
        name: created.name ?? client.name,
        email: created.email ?? email,
      });
    }

    return jsonResponse({ customers: results });
  } catch (err) {
    if (err instanceof MissingStripeKeyError) {
      return errorResponse(err.message, 500);
    }
    const message =
      err instanceof Error ? err.message : "Failed to seed customers";
    return errorResponse(message, 500);
  }
}
