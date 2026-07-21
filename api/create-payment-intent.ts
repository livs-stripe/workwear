import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

function applyCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' });
  }

  try {
    const { amount, currency, metadata, company, site, contact, po_number } =
      (req.body ?? {}) as {
        amount?: number;
        currency?: string;
        metadata?: Record<string, unknown>;
        company?: unknown;
        site?: unknown;
        contact?: unknown;
        po_number?: unknown;
      };

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'A positive integer "amount" (in cents) is required' });
    }

    // Whitelist caller-supplied metadata to non-empty strings, capped to
    // Stripe's per-value length limit. Accepts both a `metadata` object and
    // explicit company/site/contact/po_number fields.
    const extraMetadata: Record<string, string> = {};
    const addMeta = (key: string, value: unknown) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        extraMetadata[key] = value.trim().slice(0, 500);
      }
    };
    if (metadata && typeof metadata === 'object') {
      for (const [key, value] of Object.entries(metadata)) {
        addMeta(key, value);
      }
    }
    addMeta('company', company);
    addMeta('site', site);
    addMeta('contact', contact);
    addMeta('po_number', po_number);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency ?? 'aud',
      payment_method_types: ['card_present'],
      capture_method: 'automatic',
      metadata: {
        channel: 'tap_to_pay',
        brand: 'workwear_demo',
        location: 'field_sales',
        ...extraMetadata,
      },
    });

    return res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment intent';
    return res.status(500).json({ error: message });
  }
}
