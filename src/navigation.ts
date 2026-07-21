import type {ChargeResult} from './hooks/useStripeTerminal';

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
  color?: string;
  size?: string;
}

export type RootStackParamList = {
  Products: undefined;
  ProductDetail: {
    productId: string;
  };
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
