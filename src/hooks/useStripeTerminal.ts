import {useCallback, useEffect, useRef, useState} from 'react';
import {
  useStripeTerminal as useSdkStripeTerminal,
  Reader,
} from '@stripe/stripe-terminal-react-native';
import {SIMULATOR_MODE} from '../constants/config';
import {createPaymentIntent} from '../lib/api';

// Discovery method:
// - Live demo (SIMULATOR_MODE = false): real "tapToPay" (needs the Apple
//   Tap to Pay entitlement + a paid Apple Developer account).
// - Free/no-entitlement demo (SIMULATOR_MODE = true): "bluetoothScan" against
//   the SDK's built-in simulated reader. This requires NO entitlement, so it
//   builds and runs on a device signed with a free Apple ID, and still creates
//   real PaymentIntents on your Stripe account. Only the physical tap is faked.
const DISCOVERY_METHOD: 'tapToPay' | 'bluetoothScan' = SIMULATOR_MODE
  ? 'bluetoothScan'
  : 'tapToPay';

// Test card presented by the simulated reader (always approves).
const SIMULATED_CARD = '4242424242424242';

export interface ChargeResult {
  amountCents: number;
  last4?: string;
  cardBrand?: string;
  timestamp: number;
  // The confirmed PaymentIntent id (pi_...) — search this in the Stripe
  // Dashboard to find the exact transaction/account/mode.
  paymentIntentId?: string;
  // Final PaymentIntent status (should be 'succeeded' for an automatic-capture
  // card_present charge).
  status?: string;
  // Live vs test mode as reported by the server that created the PI.
  livemode?: boolean;
}

/**
 * Wraps the Stripe Terminal SDK to expose a simple field-payment flow:
 * discover -> auto-connect a Tap to Pay (local mobile) reader -> charge.
 */
export function useTerminalPayments() {
  const [connected, setConnected] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [reader, setReader] = useState<Reader.Type | null>(null);

  // Refs guard against re-running discovery/connect on hot-reload, effect
  // re-runs or duplicate onUpdateDiscoveredReaders callbacks. Reading live
  // values from refs (instead of state) avoids the "Already connected to a
  // reader" rejection the SDK throws when startDiscovery runs while connected.
  const discoveryInProgress = useRef(false);
  const connectInProgress = useRef(false);
  const hasReader = useRef(false);

  const {
    discoverReaders,
    connectReader,
    retrievePaymentIntent,
    collectPaymentMethod,
    // Newer SDKs expose confirmPaymentIntent; older betas call this processPayment.
    confirmPaymentIntent,
    setSimulatedCard,
    connectedReader,
    discoveredReaders,
    initialize,
  } = useSdkStripeTerminal({
    onUpdateDiscoveredReaders: readers => {
      // Only connect if we don't already have (or aren't already connecting to)
      // a reader, to avoid stacking connect calls on repeated callbacks.
      if (
        readers.length > 0 &&
        !connectedReader &&
        !hasReader.current &&
        !connectInProgress.current
      ) {
        void autoConnect(readers[0]);
      }
    },
    onDidChangeConnectionStatus: status => {
      const isConnected = status === 'connected';
      setConnected(isConnected);
      hasReader.current = isConnected;
    },
  });

  const autoConnect = useCallback(
    async (candidate: Reader.Type) => {
      if (connectInProgress.current || hasReader.current) {
        return;
      }
      connectInProgress.current = true;
      try {
        const {reader: connectedRdr, error} = await connectReader({
          discoveryMethod: DISCOVERY_METHOD,
          reader: candidate,
          // locationId is required for both methods; simulated readers carry a
          // mock location, otherwise fall back to the reader's own location.
          locationId: candidate.locationId ?? '',
        });
        if (error) {
          setConnected(false);
          return;
        }
        if (connectedRdr) {
          setReader(connectedRdr);
          setConnected(true);
          hasReader.current = true;
          // In simulator mode, tell the virtual reader which card to present.
          if (SIMULATOR_MODE) {
            await setSimulatedCard(SIMULATED_CARD);
          }
        }
      } finally {
        connectInProgress.current = false;
      }
    },
    [connectReader, setSimulatedCard],
  );

  const startDiscovery = useCallback(async () => {
    // Don't (re)start discovery if a reader is already connected or a
    // discovery/connect is already running. Re-running startDiscovery while
    // connected makes the SDK reject with "Already connected to a reader".
    if (
      hasReader.current ||
      connectInProgress.current ||
      discoveryInProgress.current
    ) {
      return;
    }
    discoveryInProgress.current = true;
    setDiscovering(true);
    try {
      const {error} = await discoverReaders({
        discoveryMethod: DISCOVERY_METHOD,
        simulated: SIMULATOR_MODE,
      });
      if (error) {
        // Treat an already-connected reader as a benign no-op rather than an
        // unhandled rejection.
        if (/already connected/i.test(error.message)) {
          return;
        }
        throw new Error(error.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/already connected/i.test(msg)) {
        // Benign: reader is already connected. Swallow to avoid the
        // "Possible unhandled promise rejection" warning.
        return;
      }
      // Log at most; discovery failures shouldn't crash the payment flow.
      console.warn('[Terminal] discovery failed:', msg);
    } finally {
      discoveryInProgress.current = false;
      setDiscovering(false);
    }
  }, [discoverReaders]);

  // Initialize the SDK exactly once. Every Terminal action (discover, connect,
  // charge) throws "First initialize the Stripe Terminal SDK before performing
  // any action" until initialize() has resolved successfully, so we must await
  // it and confirm there's no error before touching discovery.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {error} = await initialize();
        if (cancelled) {
          return;
        }
        if (error) {
          setInitError(error.message);
          return;
        }
        setInitError(null);
        setInitialized(true);
      } catch (err) {
        if (!cancelled) {
          setInitError(
            err instanceof Error ? err.message : 'Failed to initialize reader',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialize]);

  // Only start discovery after the SDK is confirmed initialized.
  useEffect(() => {
    if (initialized) {
      void startDiscovery();
    }
  }, [initialized, startDiscovery]);

  // Keep local connection state in sync with the SDK's connectedReader.
  useEffect(() => {
    if (connectedReader) {
      setReader(connectedReader);
      setConnected(true);
      hasReader.current = true;
    }
  }, [connectedReader]);

  /**
   * Runs the full charge flow for a given amount (in cents).
   * 1. Create PaymentIntent on the server -> client_secret
   * 2. Retrieve it in the SDK
   * 3. collectPaymentMethod (Tap to Pay prompt)
   * 4. confirm/process the payment
   */
  const charge = useCallback(
    async (
      amountCents: number,
      metadata?: Record<string, string>,
    ): Promise<ChargeResult> => {
      // 1. Create the PaymentIntent on the server. If this throws (404/401/
      //    Vercel protection/misconfigured key) the error propagates up and the
      //    caller shows the ErrorScreen — never a false success.
      const {clientSecret, id: serverPiId, livemode} =
        await createPaymentIntent(amountCents, undefined, metadata);
      console.log(
        `[Terminal] created PaymentIntent ${serverPiId ?? '(no id)'} ` +
          `livemode=${String(livemode)} amount=${amountCents}`,
      );

      const {paymentIntent, error: retrieveError} =
        await retrievePaymentIntent(clientSecret);
      if (retrieveError || !paymentIntent) {
        throw new Error(retrieveError?.message ?? 'Could not retrieve payment');
      }

      const {paymentIntent: collectedPi, error: collectError} =
        await collectPaymentMethod({paymentIntent});
      if (collectError || !collectedPi) {
        throw new Error(collectError?.message ?? 'Card was not read');
      }

      const {paymentIntent: confirmedPi, error: confirmError} =
        await confirmPaymentIntent({paymentIntent: collectedPi});
      if (confirmError || !confirmedPi) {
        throw new Error(confirmError?.message ?? 'Payment failed');
      }

      const paymentIntentId = confirmedPi.id ?? serverPiId;
      const status = confirmedPi.status;
      console.log(
        `[Terminal] confirmed PaymentIntent ${paymentIntentId ?? '(no id)'} ` +
          `status=${status ?? '(unknown)'}`,
      );

      // 2. Only treat the charge as approved when Stripe reports a terminal
      //    success status. `succeeded` (automatic capture) or `requires_capture`
      //    (if manual capture is ever configured) both mean the card was
      //    charged/authorised. Anything else is a failure — surface it so we
      //    never show "Payment approved" for a PI that didn't actually go
      //    through.
      const APPROVED = ['succeeded', 'requires_capture'];
      if (status && !APPROVED.includes(status)) {
        throw new Error(
          `Payment not completed (status: ${status}` +
            `${paymentIntentId ? `, ${paymentIntentId}` : ''})`,
        );
      }

      const charge = confirmedPi.charges?.[0];
      const cardPresent = charge?.paymentMethodDetails?.cardPresentDetails;

      return {
        amountCents,
        last4: cardPresent?.last4 ?? undefined,
        cardBrand: cardPresent?.brand ?? undefined,
        timestamp: Date.now(),
        paymentIntentId: paymentIntentId ?? undefined,
        status: status ?? undefined,
        livemode,
      };
    },
    [retrievePaymentIntent, collectPaymentMethod, confirmPaymentIntent],
  );

  return {
    connected,
    discovering,
    initialized,
    initError,
    reader,
    discoveredReaders,
    startDiscovery,
    charge,
  };
}
