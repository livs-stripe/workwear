import axios from 'axios';
import {
  API_BASE_URL,
  CURRENCY,
  VERCEL_PROTECTION_BYPASS,
} from '../constants/config';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Bypasses Vercel Deployment Protection (SSO) for programmatic requests.
    // No-op when the secret is empty / protection is disabled.
    ...(VERCEL_PROTECTION_BYPASS
      ? {
          'x-vercel-protection-bypass': VERCEL_PROTECTION_BYPASS,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : {}),
  },
});

/**
 * Fetches a Terminal connection token from the Vercel API.
 * Used by StripeTerminalProvider's tokenProvider.
 */
export async function fetchConnectionToken(): Promise<string> {
  const {data} = await client.post<{secret: string}>('/api/connection-token');
  if (!data?.secret) {
    throw new Error('No connection token returned from server');
  }
  return data.secret;
}

/**
 * Creates a card_present PaymentIntent on the server and returns its
 * client_secret for use with the Terminal SDK.
 */
export interface CreatePaymentIntentResult {
  clientSecret: string;
  // The server-side PaymentIntent id (pi_...). Useful for dashboard lookup.
  id?: string;
  // Whether the PaymentIntent was created in Stripe live mode. If this is true
  // while you're viewing the Test-mode dashboard (or vice versa) that explains
  // a "missing" transaction — the account/key is in the other mode.
  livemode?: boolean;
}

export async function createPaymentIntent(
  amountCents: number,
  currency: string = CURRENCY,
  metadata?: Record<string, string>,
): Promise<CreatePaymentIntentResult> {
  const {data} = await client.post<{
    client_secret?: string;
    id?: string;
    livemode?: boolean;
  }>('/api/create-payment-intent', {amount: amountCents, currency, metadata});
  if (!data?.client_secret) {
    throw new Error('No client_secret returned from server');
  }
  return {clientSecret: data.client_secret, id: data.id, livemode: data.livemode};
}
