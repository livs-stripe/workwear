import type Stripe from "stripe";

// Cache the resolved GST TaxRate id for the lifetime of the server process so
// we don't re-list/re-create on every invoice.
let cachedGstRateId: string | null = null;

/**
 * Returns the id of an active AU GST (10%, exclusive) TaxRate, creating it once
 * if it doesn't already exist. Idempotent: an existing matching rate is reused
 * so invoices don't accumulate duplicate tax rates.
 */
export async function getGstTaxRateId(stripe: Stripe): Promise<string> {
  if (cachedGstRateId) return cachedGstRateId;

  for await (const rate of stripe.taxRates.list({ active: true, limit: 100 })) {
    if (
      rate.display_name === "GST" &&
      rate.percentage === 10 &&
      rate.inclusive === false
    ) {
      cachedGstRateId = rate.id;
      return rate.id;
    }
  }

  const created = await stripe.taxRates.create({
    display_name: "GST",
    description: "GST (Australia)",
    percentage: 10,
    inclusive: false,
    country: "AU",
    jurisdiction: "AU",
  });
  cachedGstRateId = created.id;
  return created.id;
}
