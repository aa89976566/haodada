"use client";

import { BrutalButton } from "@/components/ui/brutal-button";
import { BRAND } from "@/data/brand";
import { cn } from "@/lib/utils";

type StickyPurchaseBarProps = {
  className?: string;
  visible?: boolean;
};

/**
 * Sticky bottom purchase bar — night-market ticket stub energy.
 * Inspired by 21st sticky / brutal CTA patterns; custom for haodada.
 */
export function StickyPurchaseBar({
  className,
  visible = true,
}: StickyPurchaseBarProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "sticky-purchase-bar fixed inset-x-0 bottom-0 z-[60] border-t-[3px] border-black bg-[var(--yellow)] px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[414px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-black/70">
            {BRAND.dropLabel} · 現買現寄
          </div>
          <div className="truncate font-mono text-base font-bold leading-tight text-black">
            {BRAND.shortName} {BRAND.currency}
            {BRAND.price}
            <span className="ml-1 text-xs font-bold text-black/60">起</span>
          </div>
        </div>
        <BrutalButton asChild size="lg" variant="ink" className="shrink-0">
          <a href={BRAND.shopUrl} target="_blank" rel="noreferrer">
            {BRAND.cta}
          </a>
        </BrutalButton>
      </div>
    </div>
  );
}
