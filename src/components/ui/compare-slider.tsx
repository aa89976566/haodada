"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight compare slider inspired by Dice UI / 21st.dev @diceui/compare-slider.
 * Self-contained (no @base-ui / diceui hook graph) for fastest ship on haodada.
 */
type Orientation = "horizontal" | "vertical";

type CompareSliderProps = {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  defaultValue?: number;
  orientation?: Orientation;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CompareSlider({
  before,
  after,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  defaultValue = 52,
  orientation = "horizontal",
  className,
}: CompareSliderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState(defaultValue);
  const dragging = React.useRef(false);

  const updateFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next =
        orientation === "horizontal"
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      setValue(clamp(next, 0, 100));
    },
    [orientation],
  );

  React.useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      updateFromPointer(event.clientX, event.clientY);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateFromPointer]);

  const isHorizontal = orientation === "horizontal";
  const clip =
    isHorizontal
      ? `inset(0 ${100 - value}% 0 0)`
      : `inset(0 0 ${100 - value}% 0)`;
  const handleStyle = isHorizontal
    ? { left: `${value}%` }
    : { top: `${value}%` };

  return (
    <div
      ref={rootRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={`${beforeLabel} vs ${afterLabel}`}
      tabIndex={0}
      className={cn(
        "compare-slider relative touch-none select-none overflow-hidden border-[3px] border-black bg-black shadow-[5px_5px_0_0_var(--red)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--yellow)]",
        isHorizontal ? "h-[220px] w-full" : "h-[320px] w-full",
        className,
      )}
      onPointerDown={(event) => {
        dragging.current = true;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX, event.clientY);
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 2;
        if (
          (isHorizontal && event.key === "ArrowLeft") ||
          (!isHorizontal && event.key === "ArrowUp")
        ) {
          event.preventDefault();
          setValue((v) => clamp(v - step, 0, 100));
        }
        if (
          (isHorizontal && event.key === "ArrowRight") ||
          (!isHorizontal && event.key === "ArrowDown")
        ) {
          event.preventDefault();
          setValue((v) => clamp(v + step, 0, 100));
        }
      }}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: clip }}>
        {before}
      </div>

      <span className="pointer-events-none absolute left-2 top-2 z-10 border-2 border-black bg-[var(--yellow)] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-black">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute bottom-2 right-2 z-10 border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-black">
        {afterLabel}
      </span>

      <div
        aria-hidden
        className={cn(
          "absolute z-20 bg-black",
          isHorizontal
            ? "top-0 h-full w-[3px] -translate-x-1/2"
            : "left-0 h-[3px] w-full -translate-y-1/2",
        )}
        style={handleStyle}
      >
        <span
          className={cn(
            "absolute flex size-9 items-center justify-center border-[3px] border-black bg-[var(--yellow)] font-mono text-[11px] font-bold text-black shadow-[2px_2px_0_0_var(--red)]",
            isHorizontal
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
        >
          VS
        </span>
      </div>
    </div>
  );
}
