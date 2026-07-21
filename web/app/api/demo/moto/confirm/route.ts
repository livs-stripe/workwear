import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { recordEvent } from "@/lib/events";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

// Test PaymentMethods finance staff can key in over the phone (test mode).
const TEST_PAYMENT_METHODS: Record<string, string> = {
  visa: "pm_card_visa",
  mastercard: "pm_card_mastercard",
  amex: "pm_card_amex",
  declined: "pm_card_chargeDeclined",
};

/**
 * Confirms a MOTO PaymentIntent server-side. This is where the MOTO exemption
 * flag lives: payment_method_options.card.moto = true. Applying it at
 * confirmation (rather than creation) is the correct Stripe pattern — passing
 * it at creation with confirm:false is rejected as an unknown parameter.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      id?: string;
      card?: string;
    };
    if (!body.id) {
      return errorResponse('A PaymentIntent "id" is required', 400);
    }

    const stripe = getStripe();
    const paymentMethod =
      TEST_PAYMENT_METHODS[body.card ?? "visa"] ?? "pm_card_visa";

    let pi = await stripe.paymentIntents.confirm(body.id, {
      payment_method: paymentMethod,
      payment_method_options: { card: { moto: true } },
    });

    const customerName = pi.metadata?.customer_name || "customer";
    const invoiceRef = pi.metadata?.invoice_ref;
    const label = invoiceRef ? ` (${invoiceRef})` : "";

    if (pi.status === "succeeded") {
      recordEvent({
        type: "payment_intent.succeeded",
        objectId: pi.id,
        summary: `Phone payment — ${customerName}${label}`,
        amount: pi.amount,
        currency: pi.currency,
      });
    } else {
      recordEvent({
        type: "payment_intent.failed",
        objectId: pi.id,
        summary: `Phone payment failed — ${customerName}${label}`,
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
