import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { recordEvent } from "@/lib/events";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

/**
 * Called by the B2B portal checkout client after it confirms the PaymentIntent
 * in the browser. Retrieves the PI to confirm its real status and records the
 * appropriate event on the live stream.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { id?: string };
    if (!body.id) {
      return errorResponse('A PaymentIntent "id" is required', 400);
    }

    const stripe = getStripe();
    const pi = await stripe.paymentIntents.retrieve(body.id);
    const buyer = pi.metadata?.buyer || "B2B portal buyer";

    if (pi.status === "succeeded") {
      recordEvent({
        type: "payment_intent.succeeded",
        objectId: pi.id,
        summary: `Portal checkout — ${buyer}`,
        amount: pi.amount,
        currency: pi.currency,
      });
    } else {
      recordEvent({
        type: "payment_intent.failed",
        objectId: pi.id,
        summary: `Portal checkout failed — ${buyer}`,
        amount: pi.amount,
        currency: pi.currency,
      });
    }

    return jsonResponse({ id: pi.id, status: pi.status });
  } catch (err) {
    if (err instanceof MissingStripeKeyError) {
      return errorResponse(err.message, 500);
    }
    const message =
      err instanceof Error ? err.message : "Failed to confirm payment intent";
    return errorResponse(message, 500);
  }
}
