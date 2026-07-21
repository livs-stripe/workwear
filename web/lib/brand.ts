// Verified Workwear Group brand imagery, scraped from workweargroup.com.au and
// the sub-brand storefronts. Every URL below was checked with `curl -sI` to
// return HTTP 200 with an `image/jpeg` content-type before being committed.
// These are hotlinked directly from the official Prismic / Demandware CDNs.

export const WWG_IMAGES = {
  // Full-bleed homepage hero banner (1440x617) from the live corporate site.
  hero: "https://images.prismic.io/wwg-corporate/ff7ea957-1b36-4daf-825b-25024929137a_WWGHomepageBanner-1440x617+v2.jpg?auto=compress,format",
  // "About Us" lifestyle image (640x512).
  about: "https://images.prismic.io/wwg-corporate/bfc9b118-900b-4f9b-ae37-cb369b6cd254_WWGAboutUs-640x512.jpg?auto=compress,format",
  // "Join Our Team" image (528x422).
  team: "https://images.prismic.io/wwg-corporate/230ca01d-e6cd-4037-aa1a-4e8a2e438da4_WWGJoinOurTeam-528x422.jpg?auto=compress,format",
} as const;

export interface BrandTile {
  name: string;
  blurb: string;
  image: string;
  href: string;
  accent: string;
}

// Sub-brand feature tiles use the same imagery the corporate homepage does.
export const BRAND_TILES: BrandTile[] = [
  {
    name: "Hard Yakka",
    blurb:
      "Iconic Australian workwear built as hard as the people who wear it — drill, hi-vis and heritage.",
    image:
      "https://images.prismic.io/wwg-corporate/bd96bc0c-2eaf-43ba-a84d-5dea4dc178e1_WWGHardYakka-304x380.jpg?auto=compress,format",
    href: "/demo/checkout",
    accent: "#F4B23E",
  },
  {
    name: "KingGee",
    blurb:
      "Trusted since 1926 — performance workwear engineered for comfort, durability and value.",
    image:
      "https://images.prismic.io/wwg-corporate/cf176eb3-fdc5-4866-9715-eeb8f9b5976c_WWGKingGee-304x380+v2.jpg?auto=compress,format",
    href: "/demo/checkout",
    accent: "#1F3A5F",
  },
  {
    name: "NNT",
    blurb:
      "Corporate, healthcare and hospitality uniforms with tailored fit and all-day performance.",
    image:
      "https://images.prismic.io/wwg-corporate/ZjRAIkMTzAJOCgeu_WWGNNT-304x380-v2.jpg?auto=format,compress",
    href: "/demo/checkout",
    accent: "#DC3D46",
  },
];
