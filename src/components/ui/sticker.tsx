import { cn } from "@/lib/utils";

/**
 * Sticker label inspired by 21st.dev sticker / MSCHF absurd drop energy.
 * Used for editorial stamps — not overlaid on hero media.
 */
type StickerProps = {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  tone?: "yellow" | "coral" | "ink" | "blue";
};

const tones: Record<NonNullable<StickerProps["tone"]>, string> = {
  yellow: "bg-[var(--yellow)] text-black",
  coral: "bg-[var(--red)] text-white",
  ink: "bg-black text-[var(--yellow)]",
  blue: "bg-[var(--blue)] text-white",
};

export function Sticker({
  children,
  className,
  rotate = -6,
  tone = "yellow",
}: StickerProps) {
  return (
    <span
      className={cn(
        "sticker inline-block border-[3px] border-black px-2.5 py-1 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.06em] shadow-[3px_3px_0_0_#000]",
        tones[tone],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
