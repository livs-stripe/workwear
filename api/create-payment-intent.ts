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
    const { amount, currency } = (req.body ?? {}) as {
      amount?: number;
      currency?: string;
    };

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'A positive integer "amount" (in cents) is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency ?? 'aud',
      payment_method_types: ['card_present'],
      capture_method: 'automatic',
      metadata: {
        channel: 'tap_to_pay',
        brand: 'workwear_demo',
        location: 'field_sales',
      },
    });

    return res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create payment intent';
    return res.status(500).json({ error: message });
  }
}
