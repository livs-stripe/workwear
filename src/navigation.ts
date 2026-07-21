import type {ChargeResult} from './hooks/useStripeTerminal';
import type {CartLine} from './context/CartContext';

export type RootStackParamList = {
  Products: undefined;
  ProductDetail: {
    productId: string;
  };
  Cart: undefined;
  Payment: {
    // The lines being charged and their summed total (in cents). Lines are a
    // snapshot passed from the cart (or a synthetic custom-amount line).
    lines: CartLine[];
    totalCents: number;
    // When true, the cart is cleared on a successful charge.
    fromCart?: boolean;
  };
  Success: {
    result: ChargeResult;
    itemCount?: number;
  };
  Error: {
    message: string;
    lines?: CartLine[];
    totalCents?: number;
    fromCart?: boolean;
  };
};
