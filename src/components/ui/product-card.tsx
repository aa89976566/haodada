import { cn } from "@/lib/utils";

/**
 * Adapted from ekmas/neobrutalism-components ImageCard (MIT) —
 * same listing as 21st.dev @ekmas/components/image-card.
 * Typography-first mobile product card (no product photos).
 */
type ProductCardProps = {
  title: string;
  priceLabel: string;
  blurb: string;
  href: string;
  badge?: string;
  className?: string;
};

export function ProductCard({
  title,
  priceLabel,
  blurb,
  href,
  badge = "DROP #01",
  className,
}: ProductCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "product-card block w-full overflow-hidden border-[3px] border-black bg-[var(--yellow)] text-black no-underline shadow-[5px_5px_0_0_var(--red)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--red)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b-[3px] border-black bg-black px-3 py-2">
        <span className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--yellow)]">
          {badge}
        </span>
        <span className="shrink-0 font-mono text-sm font-bold text-[var(--red)]">
          {priceLabel}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-mono text-xl font-bold uppercase leading-none tracking-tight">
          {title}
        </h3>
        <p className="font-mono text-[13px] leading-snug opacity-90">{blurb}</p>
        <span className="inline-block border-2 border-black bg-white px-2 py-1 font-mono text-[11px] font-bold uppercase">
          立刻下單 →
        </span>
      </div>
    </a>
  );
}
