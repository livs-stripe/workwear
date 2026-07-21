import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// A single line in the order. `key` uniquely identifies the line so the same
// product in two different colour/size combinations can coexist in the cart.
export interface CartLine {
  key: string;
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  imageUrl?: string;
  color?: string;
  size?: string;
  quantity: number;
}

// Fields required to add a product to the cart (quantity optional, defaults 1).
export interface AddItemInput {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  imageUrl?: string;
  color?: string;
  size?: string;
  quantity?: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  totalCents: number;
  addItem: (input: AddItemInput) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Two identical products (same id + colour + size) share a line so quantities
// merge instead of creating duplicate rows.
function lineKey(input: AddItemInput): string {
  return [input.id, input.color ?? '', input.size ?? ''].join('|');
}

export const CartProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((input: AddItemInput) => {
    const key = lineKey(input);
    const qty = Math.max(1, input.quantity ?? 1);
    setLines(prev => {
      const existing = prev.find(l => l.key === key);
      if (existing) {
        return prev.map(l =>
          l.key === key ? {...l, quantity: l.quantity + qty} : l,
        );
      }
      return [
        ...prev,
        {
          key,
          id: input.id,
          name: input.name,
          sku: input.sku,
          priceCents: input.priceCents,
          imageUrl: input.imageUrl,
          color: input.color,
          size: input.size,
          quantity: qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines(prev => prev.filter(l => l.key !== key));
  }, []);

  const updateQty = useCallback((key: string, quantity: number) => {
    setLines(prev => {
      if (quantity <= 0) {
        return prev.filter(l => l.key !== key);
      }
      return prev.map(l => (l.key === key ? {...l, quantity} : l));
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const {itemCount, subtotalCents} = useMemo(() => {
    return lines.reduce(
      (acc, l) => {
        acc.itemCount += l.quantity;
        acc.subtotalCents += l.priceCents * l.quantity;
        return acc;
      },
      {itemCount: 0, subtotalCents: 0},
    );
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotalCents,
      // No shipping/tax in this demo, so total == subtotal.
      totalCents: subtotalCents,
      addItem,
      removeItem,
      updateQty,
      clear,
    }),
    [lines, itemCount, subtotalCents, addItem, removeItem, updateQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
