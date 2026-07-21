export type Brand = 'Hard Yakka' | 'KingGee' | 'NNT';

export interface Product {
  id: string;
  brand: Brand;
  name: string;
  sku: string;
  description: string;
  // Price in cents to avoid floating point rounding issues.
  priceCents: number;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  category: string;
}

// Display order for brand sections in the catalog.
export const BRANDS: Brand[] = ['Hard Yakka', 'KingGee', 'NNT'];

// Real product imagery is served from the Workwear Group Salesforce Commerce
// (Demandware) image CDNs. The URLs below were scraped from the official brand
// sites and verified to return HTTP 200 with an image/jpeg content-type.
const HY_IMG =
  'https://www.hardyakka.com/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-hardyakka-catalog/default/images/hi-res';
const KG_IMG =
  'https://www.kinggee.com/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-kinggee-catalog/default/images/hi-res';
const NNT_IMG =
  'https://www.nnt.com.au/dw/image/v2/BJCV_PRD/on/demandware.static/-/Sites-wwg-m-nnt-catalog/default/images/hi-res';

const IMG_PARAMS = '?sw=800&sh=800';

export const products: Product[] = [
  // ─── Hard Yakka ──────────────────────────────────────────────────────────
  {
    id: 'hy-y02500-foundations-cargo',
    brand: 'Hard Yakka',
    name: 'Foundations Drill Cargo Pant',
    sku: 'Y02500',
    description:
      "Hard Yakka's hard-working, hard-wearing relaxed fit cotton drill cargo work pants. 290gsm pre-shrunk drill with a bellowed cargo pocket and signature red waistband binding — built to work as hard as the person who wears it.",
    priceCents: 5995,
    imageUrl: `${HY_IMG}/y02500_bla_1.jpg${IMG_PARAMS}`,
    colors: ['Black', 'Navy', 'Khaki', 'Bottle Green'],
    sizes: ['72R', '77R', '82R', '87R', '92R', '97R', '102R', '107R', '112R'],
    category: 'Work Pants',
  },
  {
    id: 'hy-y07984-hivis-shirt',
    brand: 'Hard Yakka',
    name: 'Hi-Vis 2 Tone Closed Front Long Sleeve Shirt',
    sku: 'Y07984',
    description:
      'Get the job done right with the Foundations hi-vis long sleeve cotton drill gusset work shirt. Gusset sleeves give extra movement and a fade shade indicator lets you ensure you stay visible on site.',
    priceCents: 7495,
    imageUrl: `${HY_IMG}/y07984_ona_1.jpg${IMG_PARAMS}`,
    colors: ['Orange / Navy', 'Yellow / Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Hi-Vis',
  },
  {
    id: 'hy-y19038-heritage-hoodie',
    brand: 'Hard Yakka',
    name: 'Heritage Hoodie',
    sku: 'Y19038',
    description:
      'A classic Hard Yakka heritage pullover hoodie in soft brushed fleece — off-duty comfort with authentic workwear roots for cooler days on and off the tools.',
    priceCents: 5995,
    imageUrl: `${HY_IMG}/y19038_nav_1.jpg${IMG_PARAMS}`,
    colors: ['Navy', 'Charcoal', 'Forest'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Hoodies',
  },
  {
    id: 'hy-y06056-camper-jacket',
    brand: 'Hard Yakka',
    name: 'Heritage Camper Jacket',
    sku: 'Y06056',
    description:
      'A heritage-styled camper jacket built tough for cooler days. Rugged good looks with the durability you expect from Hard Yakka.',
    priceCents: 8995,
    imageUrl: `${HY_IMG}/y06056_mar_1.jpg${IMG_PARAMS}`,
    colors: ['Maroon', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Jackets',
  },
  {
    id: 'hy-y06124-canvas-bomber',
    brand: 'Hard Yakka',
    name: 'Heritage Canvas Bomber Jacket',
    sku: 'Y06124',
    description:
      'A rugged canvas bomber jacket with heritage detailing — durable, warm and ready for anything the day throws at it.',
    priceCents: 11995,
    imageUrl: `${HY_IMG}/y06124_for_1.jpg${IMG_PARAMS}`,
    colors: ['Forest', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Jackets',
  },
  {
    id: 'hy-y11244-hooded-tee',
    brand: 'Hard Yakka',
    name: 'Heritage Long Sleeve Tee With Hood',
    sku: 'Y11244',
    description:
      'A lightweight hooded long sleeve tee for easy layered comfort with a heritage look — great for milder days on site.',
    priceCents: 3995,
    imageUrl: `${HY_IMG}/y11244_cha_1.jpg${IMG_PARAMS}`,
    colors: ['Charcoal', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Tees',
  },

  // ─── KingGee ─────────────────────────────────────────────────────────────
  {
    id: 'kg-k14820-workcool2-shirt',
    brand: 'KingGee',
    name: 'Workcool 2 Lightweight Ripstop Long Sleeve Shirt',
    sku: 'K14820',
    description:
      'KingGee Workcool does what it says — keeps you cool while you work. Lightweight 145gsm cotton ripstop with underarm and upper-back cooling vents, a 3-piece collar for sun protection and two secure chest pockets.',
    priceCents: 5995,
    imageUrl: `${KG_IMG}/k14820_kha_1.jpg${IMG_PARAMS}`,
    colors: ['Khaki', 'Navy', 'Charcoal', 'Bottle Green', 'Sky'],
    sizes: ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Work Shirts',
  },
  {
    id: 'kg-k13023-workcool-cargo',
    brand: 'KingGee',
    name: 'Workcool Cargo Pant',
    sku: 'K13023',
    description:
      'Using breathable fabric with innovative behind-the-knee venting, these Workcool cargo pants perform in all conditions. Multifunctional pocketing makes them a staple for any work site.',
    priceCents: 6995,
    imageUrl: `${KG_IMG}/k13023_nav_1.jpg${IMG_PARAMS}`,
    colors: ['Navy', 'Khaki'],
    sizes: ['72R', '77R', '82R', '87R', '92R', '97R', '102R', '107R', '112R'],
    category: 'Work Pants',
  },
  {
    id: 'kg-k13026-workcool-pro-cargo',
    brand: 'KingGee',
    name: 'Workcool Pro Stretch Cargo Work Pants',
    sku: 'K13026',
    description:
      'Made from stretch ripstop fabric, the Workcool Pro pants are durable and ultra comfortable. A comfort gel-grip waistband and 9 multifunction pockets let you stay hands-free while on site.',
    priceCents: 8995,
    imageUrl: `${KG_IMG}/k13026_nav_1.jpg${IMG_PARAMS}`,
    colors: ['Navy', 'Khaki'],
    sizes: ['72R', '77R', '82R', '87R', '92R', '97R', '102R', '107R', '112R'],
    category: 'Work Pants',
  },
  {
    id: 'kg-k54936-reflective-drill-shirt',
    brand: 'KingGee',
    name: 'Originals Reflective Spliced Drill Shirt',
    sku: 'K54936',
    description:
      'Part of the new Originals range: a hi-vis reflective spliced drill shirt engineered for durability, comfort and all-day visibility. Performance built for value.',
    priceCents: 6495,
    imageUrl: `${KG_IMG}/k54936_ona_1.jpg${IMG_PARAMS}`,
    colors: ['Orange / Navy', 'Yellow / Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Hi-Vis',
  },
  {
    id: 'kg-k55018-hivis-hoodie',
    brand: 'KingGee',
    name: 'Originals Hi-Vis Spliced Full Zip Hoodie',
    sku: 'K55018',
    description:
      'Stay seen and stay warm with the Originals hi-vis spliced full-zip hoodie. Comfort and visibility combined for early starts and cold sites.',
    priceCents: 8995,
    imageUrl: `${KG_IMG}/k55018_ona_1.jpg${IMG_PARAMS}`,
    colors: ['Orange / Navy', 'Yellow / Navy'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Hi-Vis',
  },
  {
    id: 'kg-k44249-womens-vented-drill-shirt',
    brand: 'KingGee',
    name: "Women's Originals Vented Drill Shirt",
    sku: 'K44249',
    description:
      "The Women's Originals vented drill shirt combines rugged drill fabric with performance venting for comfort and durability right through the working day.",
    priceCents: 6495,
    imageUrl: `${KG_IMG}/k44249_ora_1.jpg${IMG_PARAMS}`,
    colors: ['Orange', 'Yellow'],
    sizes: ['8', '10', '12', '14', '16', '18', '20', '22', '24'],
    category: "Women's",
  },

  // ─── NNT ─────────────────────────────────────────────────────────────────
  {
    id: 'nnt-catuga-endonend-tunic',
    brand: 'NNT',
    name: 'Poly Cotton End On End Short Sleeve Tunic',
    sku: 'CATUGA',
    description:
      'Smart, functional and comfortable, the End on End Short Sleeve Tunic ticks all the boxes — from the neat standing collar to cuffed sleeves with notch detailing, plus handy pockets and an inverted action back pleat for movement.',
    priceCents: 4995,
    imageUrl: `${NNT_IMG}/catuga_nav_1.jpg${IMG_PARAMS}`,
    colors: ['Navy', 'Blue', 'Emerald', 'Copper'],
    sizes: ['6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
    category: 'Tunics',
  },
  {
    id: 'nnt-cat9r9-pixel-tunic',
    brand: 'NNT',
    name: 'Pixel Print Short Sleeve Tunic',
    sku: 'CAT9R9',
    description:
      'Designed for demanding healthcare environments, our Pixel Print Short Sleeve Tunic keeps you cool and comfortable through the longest shift with ultra-breathable, anti-microbial AeroCool and AeroSilver fabric.',
    priceCents: 5495,
    imageUrl: `${NNT_IMG}/cat9r9_nvl_1.jpg${IMG_PARAMS}`,
    colors: ['Navy', 'Green', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Healthcare',
  },
  {
    id: 'nnt-cat9xp-silvi-tunic',
    brand: 'NNT',
    name: 'Silvi Spot Print Short Sleeve Tunic',
    sku: 'CAT9XP',
    description:
      'A fresh spot-print short sleeve tunic that pairs a polished healthcare look with breathable, easy-care performance fabric for all-day comfort.',
    priceCents: 5495,
    imageUrl: `${NNT_IMG}/cat9xp_nvy_1.jpg${IMG_PARAMS}`,
    colors: ['Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Healthcare',
  },
  {
    id: 'nnt-catudj-endonend-shirt',
    brand: 'NNT',
    name: 'Poly Cotton End On End Short Sleeve Shirt',
    sku: 'CATUDJ',
    description:
      'This end on end shirting offers a classic style shirt in a comfortable cotton blend, with a modern slimline collar, darts for shaping, short sleeves and a left chest pocket. Easily styled with tailored pants.',
    priceCents: 4995,
    imageUrl: `${NNT_IMG}/catudj_red_1.jpg${IMG_PARAMS}`,
    colors: ['Red', 'Navy', 'White', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Corporate',
  },
  {
    id: 'nnt-catq4f-scrub-pant',
    brand: 'NNT',
    name: 'Next-Gen Antibacterial Active Rontgen Scrub Pant',
    sku: 'CATQ4F',
    description:
      'Our bestselling unisex scrub pant, cut from an improved cotton-rich stretch fabric with a Polygiene antibacterial finish for lasting freshness. An elasticised drawcord waist and smart cargo pocketing keep you moving all shift.',
    priceCents: 6995,
    imageUrl: `${NNT_IMG}/catq4f_bla_1.jpg${IMG_PARAMS}`,
    colors: ['Black', 'Charcoal', 'Copper'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'Scrubs',
  },
  {
    id: 'nnt-catu8h-poplin-shirt',
    brand: 'NNT',
    name: 'Poplin Short Sleeve Shirt',
    sku: 'CATU8H',
    description:
      'A crisp, easy-care poplin short sleeve shirt — a corporate wardrobe staple that stays sharp all day and pairs back with any tailored look.',
    priceCents: 4495,
    imageUrl: `${NNT_IMG}/catu8h_blk_1.jpg${IMG_PARAMS}`,
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    category: 'Corporate',
  },
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getProductsByBrand(brand: Brand): Product[] {
  return products.filter(p => p.brand === brand);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
