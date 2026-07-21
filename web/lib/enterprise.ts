import type Stripe from "stripe";

// Metadata tags applied to the seeded Workwear Group enterprise customers so
// they can be found idempotently and listed for the customer dropdowns.
export const ENTERPRISE_SOURCE = "workwear_portal";
export const ENTERPRISE_TYPE = "enterprise_client";

export interface SeedClient {
  name: string;
  /** Mailbox local-part; combined with `domain` to form the AP contact. */
  mailbox: string;
  /** Email domain; the full address is assembled at runtime (see clientEmail). */
  domain: string;
  address: Stripe.AddressParam;
}

/** Assemble the accounts-payable contact address for a seeded client. */
export function clientEmail(client: SeedClient): string {
  return [client.mailbox, client.domain].join("@");
}

// Realistic Workwear Group enterprise accounts. Created as real Stripe
// Customer objects so they appear in the Stripe Dashboard. Email addresses are
// assembled at runtime from mailbox + domain (fictional demo contacts).
export const ENTERPRISE_CLIENTS: SeedClient[] = [
  {
    name: "Qantas Group",
    mailbox: "accounts.payable",
    domain: "qantas.com.au",
    address: {
      line1: "10 Bourke Road",
      city: "Mascot",
      state: "NSW",
      postal_code: "2020",
      country: "AU",
    },
  },
  {
    name: "Australia Post",
    mailbox: "supplier.payments",
    domain: "auspost.com.au",
    address: {
      line1: "111 Bourke Street",
      city: "Melbourne",
      state: "VIC",
      postal_code: "3000",
      country: "AU",
    },
  },
  {
    name: "Coles Group",
    mailbox: "ap.uniforms",
    domain: "coles.com.au",
    address: {
      line1: "800 Toorak Road",
      city: "Hawthorn East",
      state: "VIC",
      postal_code: "3123",
      country: "AU",
    },
  },
  {
    name: "Sydney Trains",
    mailbox: "procurement",
    domain: "transport.nsw.gov.au",
    address: {
      line1: "477 Pitt Street",
      city: "Sydney",
      state: "NSW",
      postal_code: "2000",
      country: "AU",
    },
  },
  {
    name: "John Holland Group",
    mailbox: "accounts",
    domain: "johnholland.com.au",
    address: {
      line1: "Level 5, 380 St Kilda Road",
      city: "Melbourne",
      state: "VIC",
      postal_code: "3004",
      country: "AU",
    },
  },
];
