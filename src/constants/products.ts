export interface Product {
  id: string;
  name: string;
  sku: string;
  // Price in cents to avoid floating point rounding issues.
  priceCents: number;
}

export const products: Product[] = [
  {
    id: 'hy-flc-shirt',
    name: 'Hard Yakka FLC Shirt',
    sku: 'HY-FLC-001',
    priceCents: 5995,
  },
  {
    id: 'hy-cargo-pants',
    name: 'Hard Yakka Cargo Pants',
    sku: 'HY-CARGO-002',
    priceCents: 8995,
  },
  {
    id: 'kg-stretch-cargo',
    name: 'KingGee Stretch Cargo',
    sku: 'KG-STR-003',
    priceCents: 10995,
  },
  {
    id: 'nnt-uniform-shirt',
    name: 'NNT Uniform Shirt',
    sku: 'NNT-UNI-004',
    priceCents: 7995,
  },
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
