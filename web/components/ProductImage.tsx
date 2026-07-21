import { BRAND_ACCENT, type Product } from "@/lib/inventory";

/**
 * Renders a product image when a verified URL is present, otherwise a tasteful
 * branded tile (brand wordmark + product category) so the storefront never
 * shows a broken image during a client demo.
 */
export default function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={product.image}
        alt={product.name}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const accent = BRAND_ACCENT[product.brand];
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 ${className}`}
      style={{ backgroundColor: accent.bg }}
      role="img"
      aria-label={`${product.brand} ${product.name}`}
    >
      <span
        className="text-lg font-bold uppercase tracking-[0.14em]"
        style={{ color: accent.fg }}
      >
        {product.brand}
      </span>
      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
        {product.category}
      </span>
    </div>
  );
}
