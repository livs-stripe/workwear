// Realistic Workwear Group product inventory used by the B2B portal checkout
// storefront. Prices are in AUD cents (GST-inclusive retail).
//
// NOTE ON IMAGES: the Hard Yakka / KingGee / NNT storefronts serve product
// imagery from hotlink-protected, JS-rendered CDNs whose URLs could not be
// verified to return a stable image content-type. Rather than ship broken
// <img> tags into a client demo, each product renders a tasteful branded tile
// (see components/ProductImage.tsx). If a verified hotlinkable URL is known it
// can be dropped into the optional `image` field and it will be used instead.

export type Brand = "Hard Yakka" | "KingGee" | "NNT";

export type ProductCategory =
  | "Work Shirts"
  | "Cargo Pants"
  | "Hi-Vis"
  | "Polos"
  | "Uniforms";

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  sku: string;
  priceCents: number;
  description: string;
  category: ProductCategory;
  /** Optional verified image URL. When absent a branded tile is rendered. */
  image?: string;
}

/** Brand accent colours used by the branded product tile fallback. */
export const BRAND_ACCENT: Record<Brand, { bg: string; fg: string }> = {
  "Hard Yakka": { bg: "#2F3540", fg: "#F4B23E" },
  KingGee: { bg: "#1F3A5F", fg: "#FFFFFF" },
  NNT: { bg: "#4C515A", fg: "#DC3D46" },
};

export const PRODUCTS: Product[] = [
  {
    id: "hy-flc-shirt-navy",
    name: "Foundations Long Sleeve Work Shirt",
    brand: "Hard Yakka",
    sku: "HY-Y07600-NVY",
    priceCents: 5995,
    category: "Work Shirts",
    description:
      "Heavy-duty cotton drill long sleeve shirt with twin chest pockets. Navy.",
  },
  {
    id: "hy-cargo-3056",
    name: "Legends Cargo Pant",
    brand: "Hard Yakka",
    sku: "HY-Y02202-KHK",
    priceCents: 8995,
    category: "Cargo Pants",
    description:
      "Durable cotton cargo pant with multi-utility pockets and triple stitching. Khaki.",
  },
  {
    id: "hy-hivis-taped-shirt",
    name: "Koolgear Hi-Vis Taped Vented Shirt",
    brand: "Hard Yakka",
    sku: "HY-Y04300-ORG",
    priceCents: 7495,
    category: "Hi-Vis",
    description:
      "Lightweight vented hi-vis shirt with reflective tape for day/night compliance. Orange.",
  },
  {
    id: "hy-polo-koolgear",
    name: "Koolgear Short Sleeve Polo",
    brand: "Hard Yakka",
    sku: "HY-Y11305-NVY",
    priceCents: 4295,
    category: "Polos",
    description:
      "Moisture-wicking polyester polo for warm-weather site work. Navy.",
  },
  {
    id: "kg-workcool-shirt",
    name: "Workcool 2 Short Sleeve Shirt",
    brand: "KingGee",
    sku: "KG-K14825-WHT",
    priceCents: 5495,
    category: "Work Shirts",
    description:
      "Breathable ripstop shirt engineered for extreme heat. Mesh ventilation. White.",
  },
  {
    id: "kg-stretch-cargo",
    name: "Workcool Pro Stretch Cargo Pant",
    brand: "KingGee",
    sku: "KG-K13024-KHK",
    priceCents: 10995,
    category: "Cargo Pants",
    description:
      "4-way stretch cargo with articulated knees and cordura reinforcement. Khaki.",
  },
  {
    id: "kg-hivis-fleece",
    name: "Hi-Vis Reflective Zip Fleece",
    brand: "KingGee",
    sku: "KG-K55020-YEL",
    priceCents: 8995,
    category: "Hi-Vis",
    description:
      "Warm brushed-back fleece with 3M reflective tape for cold, low-light sites. Yellow.",
  },
  {
    id: "kg-workcool-polo",
    name: "Workcool Hyperfreeze Polo",
    brand: "KingGee",
    sku: "KG-K69660-BLK",
    priceCents: 4995,
    category: "Polos",
    description:
      "Cooling-tech polo with UPF 50+ sun protection for all-day site wear. Black.",
  },
  {
    id: "nnt-corporate-shirt",
    name: "Avignon Long Sleeve Corporate Shirt",
    brand: "NNT",
    sku: "NNT-CATJ2M-WHT",
    priceCents: 6995,
    category: "Uniforms",
    description:
      "Wrinkle-resistant poplin corporate shirt for front-of-house and clinical staff. White.",
  },
  {
    id: "nnt-scrub-top",
    name: "Next-Gen Antibacterial Scrub Top",
    brand: "NNT",
    sku: "NNT-CATBGE-TEA",
    priceCents: 5595,
    category: "Uniforms",
    description:
      "Antibacterial-treated healthcare scrub top with action back. Teal.",
  },
  {
    id: "nnt-chino-pant",
    name: "Modern Stretch Chino Pant",
    brand: "NNT",
    sku: "NNT-CATCH2-NVY",
    priceCents: 7495,
    category: "Uniforms",
    description:
      "Tailored stretch chino for corporate and hospitality uniforms. Navy.",
  },
  {
    id: "nnt-polo-uniform",
    name: "Antibacterial Action Polo",
    brand: "NNT",
    sku: "NNT-CATBBE-WHT",
    priceCents: 4795,
    category: "Polos",
    description:
      "Easy-care corporate polo with antibacterial finish for uniform programs. White.",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
