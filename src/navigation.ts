import type {ChargeResult} from './hooks/useStripeTerminal';

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
}

export type RootStackParamList = {
  Products: undefined;
  Payment: {
    item: CartItem;
  };
  Success: {
    result: ChargeResult;
  };
  Error: {
    message: string;
    item?: CartItem;
  };
};
