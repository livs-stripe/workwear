import Stripe from "stripe";
import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { recordEvent } from "@/lib/events";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

/**
 * True when a Stripe error is about the card/moto payment_method_options path
 * being unsupported on the target call — i.e. the invoice's PaymentIntent was
 * created with dynamic/automatic payment methods (no explicit `card` type), or
 * MOTO isn't available. This is recoverable via the standalone-PI fallback,
 * unlike a genuine decline which must surface to the operator.
 */
function isCardConfigOrMotoError(err: unknown): boolean {
  if (err instanceof Stripe.errors.StripeError) {
    const msg = (err.message || "").toLowerCase();
    const param = (err.param || "").toLowerCase();
    return (
      msg.includes("payment_method_options") ||
      msg.includes("moto") ||
      param.includes("payment_method_options") ||
      param.includes("moto")
    );
  }
  return false;
}

/**
 * Charge a standalone card PaymentIntent for the invoice amount. Used only as a
 * fallback for invoices whose own PaymentIntent can't accept card.moto (e.g.
 * seeded before payment_settings pinned the PI to card). Retries without the
 * MOTO flag if the account can't claim the MOTO exemption, so the charge still
 * completes and the invoice can be reconciled.
 */
async function chargeStandalone(
  stripe: Stripe,
  args: {
    amount: number;
    currency: string;
    customer: string | null;
    paymentMethod: string;
    invoiceId: string;
    note?: string;
  }
): Promise<Stripe.PaymentIntent> {
  const base: Stripe.PaymentIntentCreateParams = {
    amount: args.amount,
    currency: args.currency,
    payment_method: args.paymentMethod,
    payment_method_types: ["card"],
    confirm: true,
    off_session: true,
    ...(args.customer ? { customer: args.customer } : {}),
    metadata: {
      channel: "moto",
      invoice: args.invoiceId,
      ...(args.note ? { note: args.note } : {}),
    },
  };
  try {
    return await stripe.paymentIntents.create({
      ...base,
      payment_method_options: { card: { moto: true } },
    });
  } catch (err) {
    if (isCardConfigOrMotoError(err)) {
      // MOTO exemption unavailable on this account — charge without the flag.
      return await stripe.paymentIntents.create({
        ...base,
        metadata: { ...base.metadata, moto_unavailable: "true" },
      });
    }
    throw err;
  }
}

/**
 * Pays a specific Stripe invoice as a MOTO (mail order / telephone order)
 * transaction.
 *
 * Primary path: confirm the invoice's own PaymentIntent with
 * payment_method_options.card.moto = true — `moto` IS accepted by
 * paymentIntents.confirm (never by invoices.pay). On success the invoice's PI
 * succeeds and Stripe transitions the invoice to "paid" automatically.
 *
 * Fallback: for legacy invoices whose PI was created with dynamic payment
 * methods (and therefore rejects card.moto), charge a standalone card MOTO PI
 * and mark the invoice paid out of band so it reconciles and drops off.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      invoice?: string;
      payment_method?: string;
      note?: string;
    };
    if (!body.invoice) {
      return errorResponse('An invoice "id" is required', 400);
    }
    if (!body.payment_method) {
      return errorResponse('A "payment_method" id is required', 400);
    }

    const stripe = getStripe();

    const invoice = await stripe.invoices.retrieve(body.invoice, {
      expand: ["payment_intent"],
    });

    if (invoice.status === "paid") {
      return jsonResponse({
        invoice_id: invoice.id,
        invoice_status: "paid",
        already_paid: true,
      });
    }
    if (invoice.status !== "open") {
      return errorResponse(
        `Invoice is ${invoice.status ?? "not payable"} and cannot be charged`,
        400
      );
    }

    const customerId =
      typeof invoice.customer === "string"
        ? invoice.customer
        : (invoice.customer?.id ?? null);
    const invoicePi = invoice.payment_intent as Stripe.PaymentIntent | null;

    // The PaymentMethod was tokenized client-side via Stripe.js (raw PAN never
    // reaches our server). Attach it to the customer so it's usable for
    // confirmation and reusable for future auto-charges.
    const paymentMethodId = body.payment_method;
    if (customerId) {
      try {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
      } catch {
        // Non-fatal: already attached, or confirmation can proceed with the PM.
      }
    }

    let confirmed: Stripe.PaymentIntent;

    if (invoicePi) {
      if (body.note) {
        try {
          await stripe.paymentIntents.update(invoicePi.id, {
            metadata: {
              channel: "moto",
              note: body.note,
              invoice: invoice.id,
            },
          });
        } catch {
          // metadata is best-effort
        }
      }
      try {
        // Primary: confirm the invoice's OWN PaymentIntent with card.moto.
        confirmed = await stripe.paymentIntents.confirm(invoicePi.id, {
          payment_method: paymentMethodId,
          payment_method_options: { card: { moto: true } },
        });
      } catch (primaryErr) {
        // Genuine declines / other errors must surface to the operator.
        if (!isCardConfigOrMotoError(primaryErr)) throw primaryErr;
        // Legacy PI can't accept card.moto → charge standalone + reconcile.
        confirmed = await chargeStandalone(stripe, {
          amount: invoice.amount_due,
          currency: invoice.currency,
          customer: customerId,
          paymentMethod: paymentMethodId,
          invoiceId: invoice.id,
          note: body.note,
        });
        if (confirmed.status === "succeeded") {
          await stripe.invoices.pay(invoice.id, { paid_out_of_band: true });
        }
      }
    } else {
      // Open invoice without a PaymentIntent (unusual) → standalone + reconcile.
      confirmed = await chargeStandalone(stripe, {
        amount: invoice.amount_due,
        currency: invoice.currency,
        customer: customerId,
        paymentMethod: paymentMethodId,
        invoiceId: invoice.id,
        note: body.note,
      });
      if (confirmed.status === "succeeded") {
        await stripe.invoices.pay(invoice.id, { paid_out_of_band: true });
      }
    }

    const updated = await stripe.invoices.retrieve(body.invoice);
    const customerName =
      (typeof updated.customer_name === "string" && updated.customer_name) ||
      "customer";
    const label = updated.number ? ` (${updated.number})` : "";

    if (confirmed.status === "succeeded") {
      recordEvent({
        type: "payment_intent.succeeded",
        objectId: confirmed.id,
        summary: `Phone payment — ${customerName}${label}`,
        amount: confirmed.amount,
        currency: confirmed.currency,
      });
      if (updated.status === "paid") {
        recordEvent({
          type: "invoice.paid",
          objectId: updated.id,
          summary: `Invoice ${updated.number ?? updated.id} paid (MOTO)`,
          amount: updated.amount_paid,
          currency: updated.currency,
        });
      }
    } else {
      recordEvent({
        type: "payment_intent.failed",
        objectId: confirmed.id,
        summary: `Phone payment failed — ${customerName}${label}`,
        amount: confirmed.amount,
        currency: confirmed.currency,
      });
    }

    return jsonResponse({
      invoice_id: updated.id,
      invoice_status: updated.status,
      payment_status: confirmed.status,
      payment_intent: confirmed.id,
    });
  } catch (err) {
    if (err instanceof MissingStripeKeyError) {
      return errorResponse(err.message, 500);
    }
    const message =
      err instanceof Error ? err.message : "Failed to pay invoice";
    return errorResponse(message, 500);
  }
}
