// Realistic Workwear Group product inventory used by the B2B portal checkout
// storefront. Prices are in AUD cents (GST-inclusive retail).
//
// IMAGES: product imagery is hotlinked from the official Hard Yakka / KingGee /
// NNT Salesforce Commerce (Demandware) CDNs. The URLs below mirror the data
// shipped in the mobile app (src/constants/products.ts) and were each verified
// with `curl -sI` to return HTTP 200 with an image/jpeg content-type. If any
// URL ever fails, components/ProductImage.tsx renders a branded tile fallback.

export type Brand = "Hard Yakka" | "KingGee" | "NNT";

export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  sku: string;
  priceCents: number;
  description: string;
  category: ProductCategory;
  /** Verified image URL. When absent a branded tile is rendered. */
  image?: string;
}

/** Brand accent colours used by the branded product tile fallback. */
export const BRAND_ACCENT: Record<Brand, { bg: string; fg: string }> = {
  "Hard Yakka": { bg: "#2F3540", fg: "#F4B23E" },
  KingGee: { bg: "#1F3A5F", fg: "#FFFFFF" },
  NNT: { bg: "#4C515A", fg: "#DC3D46" },
};

// Demandware hi-res image CDNs for each brand storefront.
const HY_IMG =
  "https://www.hardyakka.com/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-hardyakka-catalog/default/images/hi-res";
const KG_IMG =
  "https://www.kinggee.com/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-kinggee-catalog/default/images/hi-res";
const NNT_IMG =
  "https://www.nnt.com.au/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-nnt-catalog/default/images/hi-res";
const IMG = "?sw=800&sh=800";

export const PRODUCTS: Product[] = [
  // ─── Hard Yakka ────────────────────────────────────────────────────────
  {
    id: "hy-y02500-foundations-cargo",
    name: "Foundations Drill Cargo Pant",
    brand: "Hard Yakka",
    sku: "Y02500",
    priceCents: 5995,
    category: "Work Pants",
    description:
      "Hard-wearing 290gsm pre-shrunk cotton drill cargo pant with bellowed cargo pocket and signature red waistband binding. Black.",
    image: `${HY_IMG}/y02500_bla_1.jpg${IMG}`,
  },
  {
    id: "hy-y07984-hivis-shirt",
    name: "Hi-Vis 2 Tone Closed Front Long Sleeve Shirt",
    brand: "Hard Yakka",
    sku: "Y07984",
    priceCents: 7495,
    category: "Hi-Vis",
    description:
      "Foundations hi-vis long sleeve cotton drill shirt with gusset sleeves and a fade-shade indicator for day/night visibility. Orange/Navy.",
    image: `${HY_IMG}/y07984_ona_1.jpg${IMG}`,
  },
  {
    id: "hy-y19038-heritage-hoodie",
    name: "Heritage Hoodie",
    brand: "Hard Yakka",
    sku: "Y19038",
    priceCents: 5995,
    category: "Hoodies",
    description:
      "Classic Hard Yakka heritage pullover hoodie in soft brushed fleece — off-duty comfort with authentic workwear roots. Navy.",
    image: `${HY_IMG}/y19038_nav_1.jpg${IMG}`,
  },
  {
    id: "hy-y06056-camper-jacket",
    name: "Heritage Camper Jacket",
    brand: "Hard Yakka",
    sku: "Y06056",
    priceCents: 8995,
    category: "Jackets",
    description:
      "Heritage-styled camper jacket built tough for cooler days — rugged good looks with Hard Yakka durability. Maroon.",
    image: `${HY_IMG}/y06056_mar_1.jpg${IMG}`,
  },
  {
    id: "hy-y06124-canvas-bomber",
    name: "Heritage Canvas Bomber Jacket",
    brand: "Hard Yakka",
    sku: "Y06124",
    priceCents: 11995,
    category: "Jackets",
    description:
      "Rugged canvas bomber jacket with heritage detailing — durable, warm and ready for anything the day throws at it. Forest.",
    image: `${HY_IMG}/y06124_for_1.jpg${IMG}`,
  },
  {
    id: "hy-y11244-hooded-tee",
    name: "Heritage Long Sleeve Tee With Hood",
    brand: "Hard Yakka",
    sku: "Y11244",
    priceCents: 3995,
    category: "Tees",
    description:
      "Lightweight hooded long sleeve tee for easy layered comfort with a heritage look — great for milder days on site. Charcoal.",
    image: `${HY_IMG}/y11244_cha_1.jpg${IMG}`,
  },

  // ─── KingGee ───────────────────────────────────────────────────────────
  {
    id: "kg-k14820-workcool2-shirt",
    name: "Workcool 2 Lightweight Ripstop Long Sleeve Shirt",
    brand: "KingGee",
    sku: "K14820",
    priceCents: 5995,
    category: "Work Shirts",
    description:
      "Lightweight 145gsm cotton ripstop with underarm and upper-back cooling vents, a 3-piece collar and two secure chest pockets. Khaki.",
    image: `${KG_IMG}/k14820_kha_1.jpg${IMG}`,
  },
  {
    id: "kg-k13023-workcool-cargo",
    name: "Workcool Cargo Pant",
    brand: "KingGee",
    sku: "K13023",
    priceCents: 6995,
    category: "Work Pants",
    description:
      "Breathable cargo pant with behind-the-knee venting and multifunctional pocketing — a staple for any work site. Navy.",
    image: `${KG_IMG}/k13023_nav_1.jpg${IMG}`,
  },
  {
    id: "kg-k13026-workcool-pro-cargo",
    name: "Workcool Pro Stretch Cargo Work Pants",
    brand: "KingGee",
    sku: "K13026",
    priceCents: 8995,
    category: "Work Pants",
    description:
      "Durable stretch ripstop cargo with a comfort gel-grip waistband and 9 multifunction pockets to keep you hands-free. Navy.",
    image: `${KG_IMG}/k13026_nav_1.jpg${IMG}`,
  },
  {
    id: "kg-k54936-reflective-drill-shirt",
    name: "Originals Reflective Spliced Drill Shirt",
    brand: "KingGee",
    sku: "K54936",
    priceCents: 6495,
    category: "Hi-Vis",
    description:
      "Hi-vis reflective spliced drill shirt engineered for durability, comfort and all-day visibility. Performance built for value. Orange/Navy.",
    image: `${KG_IMG}/k54936_ona_1.jpg${IMG}`,
  },
  {
    id: "kg-k55018-hivis-hoodie",
    name: "Originals Hi-Vis Spliced Full Zip Hoodie",
    brand: "KingGee",
    sku: "K55018",
    priceCents: 8995,
    category: "Hi-Vis",
    description:
      "Stay seen and warm with the Originals hi-vis spliced full-zip hoodie — comfort and visibility for early starts and cold sites. Orange/Navy.",
    image: `${KG_IMG}/k55018_ona_1.jpg${IMG}`,
  },
  {
    id: "kg-k44249-womens-vented-drill-shirt",
    name: "Women's Originals Vented Drill Shirt",
    brand: "KingGee",
    sku: "K44249",
    priceCents: 6495,
    category: "Women's",
    description:
      "Rugged drill fabric with performance venting for comfort and durability right through the working day. Orange.",
    image: `${KG_IMG}/k44249_ora_1.jpg${IMG}`,
  },

  // ─── NNT ───────────────────────────────────────────────────────────────
  {
    id: "nnt-catuga-endonend-tunic",
    name: "Poly Cotton End On End Short Sleeve Tunic",
    brand: "NNT",
    sku: "CATUGA",
    priceCents: 4995,
    category: "Tunics",
    description:
      "Smart, functional tunic with a neat standing collar, notch-detail cuffed sleeves, handy pockets and an inverted action back pleat. Navy.",
    image: `${NNT_IMG}/catuga_nav_1.jpg${IMG}`,
  },
  {
    id: "nnt-cat9r9-pixel-tunic",
    name: "Pixel Print Short Sleeve Tunic",
    brand: "NNT",
    sku: "CAT9R9",
    priceCents: 5495,
    category: "Healthcare",
    description:
      "Designed for demanding healthcare environments with ultra-breathable, anti-microbial AeroCool and AeroSilver fabric. Navy.",
    image: `${NNT_IMG}/cat9r9_nvl_1.jpg${IMG}`,
  },
  {
    id: "nnt-cat9xp-silvi-tunic",
    name: "Silvi Spot Print Short Sleeve Tunic",
    brand: "NNT",
    sku: "CAT9XP",
    priceCents: 5495,
    category: "Healthcare",
    description:
      "Fresh spot-print tunic pairing a polished healthcare look with breathable, easy-care performance fabric for all-day comfort. Navy.",
    image: `${NNT_IMG}/cat9xp_nvy_1.jpg${IMG}`,
  },
  {
    id: "nnt-catudj-endonend-shirt",
    name: "Poly Cotton End On End Short Sleeve Shirt",
    brand: "NNT",
    sku: "CATUDJ",
    priceCents: 4995,
    category: "Corporate",
    description:
      "Classic cotton-blend shirt with a modern slimline collar, shaping darts, short sleeves and a left chest pocket. Red.",
    image: `${NNT_IMG}/catudj_red_1.jpg${IMG}`,
  },
  {
    id: "nnt-catq4f-scrub-pant",
    name: "Next-Gen Antibacterial Active Rontgen Scrub Pant",
    brand: "NNT",
    sku: "CATQ4F",
    priceCents: 6995,
    category: "Scrubs",
    description:
      "Bestselling unisex scrub pant in cotton-rich stretch fabric with a Polygiene antibacterial finish and smart cargo pocketing. Black.",
    image: `${NNT_IMG}/catq4f_bla_1.jpg${IMG}`,
  },
  {
    id: "nnt-catu8h-poplin-shirt",
    name: "Poplin Short Sleeve Shirt",
    brand: "NNT",
    sku: "CATU8H",
    priceCents: 4495,
    category: "Corporate",
    description:
      "Crisp, easy-care poplin short sleeve shirt — a corporate wardrobe staple that stays sharp all day. Black.",
    image: `${NNT_IMG}/catu8h_blk_1.jpg${IMG}`,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
