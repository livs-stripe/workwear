import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";

export const runtime = "nodejs";

interface CartLine {
  name: string;
  sku: string;
  amountCents: number;
  quantity: number;
}

export function OPTIONS() {
  return optionsResponse();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      amountCents?: number;
      buyer?: string;
      cart?: CartLine[];
    };

    if (typeof body.amountCents !== "number" || body.amountCents <= 0) {
      return errorResponse('A positive "amountCents" is required', 400);
    }

    const stripe = getStripe();

    const itemsSummary = Array.isArray(body.cart)
      ? body.cart
          .map((l) => `${l.quantity}x ${l.sku}`)
          .join(", ")
          .slice(0, 480)
      : "";

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.amountCents),
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      description: "Workwear Group B2B Portal order (SAP Commerce Cloud)",
      metadata: {
        channel: "b2b_portal_checkout",
        connector: "stripe_opf",
        buyer: body.buyer ?? "",
        items: itemsSummary,
      },
    });

    return jsonResponse({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    if (err instanceof MissingStripeKeyError) {
      return errorResponse(err.message, 500);
    }
    const message =
      err instanceof Error ? err.message : "Failed to create payment intent";
    return errorResponse(message, 500);
  }
}
