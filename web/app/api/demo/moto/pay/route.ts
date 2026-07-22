import Stripe from "stripe";
import { getStripe, MissingStripeKeyError } from "@/lib/stripe";
import { errorResponse, jsonResponse, optionsResponse } from "@/lib/cors";
import { recordEvent } from "@/lib/events";
import { ENTERPRISE_SOURCE } from "@/lib/enterprise";

export const runtime = "nodejs";

export function OPTIONS() {
  return optionsResponse();
}

const MOTO_SEED_CHANNEL = "moto_seed";

/**
 * A PaymentIntent can be confirmed with payment_method_options.card.moto only
 * when it was created with an explicit `card` payment method type and NOT with
 * automatic/dynamic payment methods. We check this PROACTIVELY rather than
 * confirming and catching the "unknown parameter" error, which is fragile.
 */
function isCardConfirmable(pi: Stripe.PaymentIntent): boolean {
  if (pi.automatic_payment_methods?.enabled) return false;
  return pi.payment_method_types?.includes("card") ?? false;
}

/**
 * True when a Stripe error is specifically the MOTO / payment_method_options
 * rejection (e.g. the account can't claim the MOTO exemption). Used to fall
 * back to a plain card confirmation so this error is NEVER surfaced to the user.
 */
function isMotoParamError(err: unknown): boolean {
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
 * Confirm a card PaymentIntent as MOTO. If the account can't claim the MOTO
 * exemption (Stripe rejects the moto parameter), retry the SAME PI as a normal
 * card (card-not-present) payment — still a single record. The parameter error
 * is a 400 that changes no state, so the PI remains confirmable on retry.
 * Genuine declines (and other real errors) propagate to the caller.
 */
async function confirmCardMoto(
  stripe: Stripe,
  piId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.confirm(piId, {
      payment_method: paymentMethodId,
      payment_method_options: { card: { moto: true } },
    });
  } catch (err) {
    if (isMotoParamError(err)) {
      return await stripe.paymentIntents.confirm(piId, {
        payment_method: paymentMethodId,
      });
    }
    throw err;
  }
}

/**
 * Re-issue a legacy (non-card) invoice as a fresh card-enabled invoice for the
 * same customer/line items, confirm ITS PaymentIntent, then void the legacy
 * invoice. Exactly one succeeded PI; the legacy invoice is removed. If the
 * confirmation fails (real decline / exemption unavailable), the freshly
 * created invoice is voided and the original is left intact.
 */
async function reissueAndPay(
  stripe: Stripe,
  oldInvoice: Stripe.Invoice,
  paymentMethodId: string,
  note?: string
): Promise<{ confirmed: Stripe.PaymentIntent; invoice: Stripe.Invoice }> {
  const customerId =
    typeof oldInvoice.customer === "string"
      ? oldInvoice.customer
      : (oldInvoice.customer?.id ?? null);
  if (!customerId) {
    throw new Error("Invoice has no customer to re-issue against");
  }

  const lines = oldInvoice.lines?.data ?? [];
  if (lines.length === 0) {
    await stripe.invoiceItems.create({
      customer: customerId,
      currency: oldInvoice.currency,
      amount: oldInvoice.amount_due,
      description: `Outstanding balance (was ${oldInvoice.number ?? oldInvoice.id})`,
    });
  } else {
    for (const line of lines) {
      await stripe.invoiceItems.create({
        customer: customerId,
        currency: oldInvoice.currency,
        amount: line.amount,
        description: line.description ?? "Workwear order",
      });
    }
  }

  const draft = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: 21,
    auto_advance: false,
    pending_invoice_items_behavior: "include",
    payment_settings: { payment_method_types: ["card"] },
    metadata: {
      channel: MOTO_SEED_CHANNEL,
      source: ENTERPRISE_SOURCE,
      reissued_from: oldInvoice.id,
    },
  });
  const finalized = await stripe.invoices.finalizeInvoice(draft.id, {
    expand: ["payment_intent"],
  });
  const newPi = finalized.payment_intent as Stripe.PaymentIntent | null;
  if (!newPi) {
    throw new Error("Re-issued invoice has no payment intent to confirm");
  }
  if (note) {
    try {
      await stripe.paymentIntents.update(newPi.id, {
        metadata: { channel: "moto", note, invoice: finalized.id },
      });
    } catch {
      // metadata is best-effort
    }
  }

  let confirmed: Stripe.PaymentIntent;
  try {
    confirmed = await confirmCardMoto(stripe, newPi.id, paymentMethodId);
  } catch (err) {
    try {
      await stripe.invoices.voidInvoice(finalized.id);
    } catch {
      // best-effort cleanup
    }
    throw err;
  }

  try {
    await stripe.invoices.voidInvoice(oldInvoice.id);
  } catch {
    // best-effort
  }

  return { confirmed, invoice: finalized };
}

/**
 * Pays a specific Stripe invoice as a MOTO transaction, producing exactly ONE
 * payment record. The card/moto path is chosen PROACTIVELY:
 *  - invoice PI already accepts card  → confirm it directly with card.moto.
 *  - invoice PI is dynamic/automatic  → re-issue as a card invoice and pay that,
 *    then void the legacy invoice (the failing confirm is never attempted).
 * A plain-card fallback guarantees the "unknown parameter card.moto" error is
 * never surfaced even if the MOTO exemption is unavailable on the account.
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
    const paymentMethodId = body.payment_method;

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
    let resultInvoiceId = invoice.id;

    // PROACTIVE branch: only confirm the invoice's own PI when it can accept
    // card.moto; otherwise re-issue as a card invoice (never attempt the failing
    // confirm on a dynamic/automatic PI).
    if (invoicePi && isCardConfirmable(invoicePi)) {
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
      confirmed = await confirmCardMoto(stripe, invoicePi.id, paymentMethodId);
    } else {
      const reissued = await reissueAndPay(
        stripe,
        invoice,
        paymentMethodId,
        body.note
      );
      confirmed = reissued.confirmed;
      resultInvoiceId = reissued.invoice.id;
    }

    const updated = await stripe.invoices.retrieve(resultInvoiceId);
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
