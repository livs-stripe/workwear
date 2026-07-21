import Stripe from "stripe";
import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { ENTERPRISE_SOURCE } from "@/lib/enterprise";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

/**
 * Lists the seeded Workwear Group enterprise customers (real Stripe Customer
 * objects tagged with metadata.source = "workwear_portal").
 */
export async function GET() {
  try {
    const stripe = getStripe();
    const byId = new Map<string, Stripe.Customer>();

    try {
      const res = await stripe.customers.search({
        query: `metadata["source"]:"${ENTERPRISE_SOURCE}"`,
        limit: 100,
      });
      for (const c of res.data) byId.set(c.id, c);
    } catch {
      // Search unavailable — fall back to a list scan.
    }

    if (byId.size === 0) {
      for await (const c of stripe.customers.list({ limit: 100 })) {
        if (c.metadata?.source === ENTERPRISE_SOURCE) byId.set(c.id, c);
      }
    }

    const customers = Array.from(byId.values())
      .map((c) => ({
        id: c.id,
        name: c.name ?? "Unnamed account",
        email: c.email ?? "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return jsonResponse({ customers });
  } catch (err) {
    if (err instanceof MissingStripeKeyError) {
      return errorResponse(err.message, 500);
    }
    const message =
      err instanceof Error ? err.message : "Failed to list customers";
    return errorResponse(message, 500);
  }
}
