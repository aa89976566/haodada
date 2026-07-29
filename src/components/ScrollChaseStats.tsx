"use client";

import { useEffect, useRef } from "react";

type Stat = {
  id: string;
  label: string;
  target: number;
  suffix?: string;
  prefix?: string;
};

/**
 * Scroll-scrubbed counters with "chase" lag:
 * - Scroll position maps to an integer target (0 → N)
 * - Display value climbs/falls by +1/−1 at a capped rate
 * - DOM text updated via refs (no React re-render per frame)
 * - Passive scroll + single rAF coalesce for main-thread thrift
 *
 * Pattern refs: Apple product scrubbers, CounterUp + scroll timelines,
 * CSS scroll-driven for transforms only (compositor), IO for gate.
 */
export function ScrollChaseStats({
  stats,
  trackSelector = ".scroll-meter",
}: {
  stats: readonly Stat[];
  trackSelector?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const displayRef = useRef<number[]>(stats.map(() => 0));
  const scrollTargetRef = useRef<number[]>(stats.map(() => 0));
  const rafRef = useRef(0);
  const lastStepRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      stats.forEach((s, i) => {
        displayRef.current[i] = s.target;
        const el = valueRefs.current[i];
        if (el) el.textContent = format(s, s.target);
      });
      return;
    }

    const track =
      (document.querySelector(trackSelector) as HTMLElement | null) ?? root;

    const readScrollTargets = () => {
      const rect = track.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // Progress while the meter moves through the viewport (0 → 1)
      const start = viewH * 0.85;
      const end = viewH * 0.15;
      const raw = (start - rect.top) / (start - end + rect.height * 0.35);
      const progress = Math.min(1, Math.max(0, raw));

      stats.forEach((s, i) => {
        scrollTargetRef.current[i] = Math.round(progress * s.target);
      });
    };

    const STEP_MS = 48; // slow +1 cadence (~20 steps/sec)

    const tick = (now: number) => {
      rafRef.current = 0;
      const needsChase = stats.some(
        (_, i) => displayRef.current[i] !== scrollTargetRef.current[i],
      );
      if (!needsChase) return;

      if (now - lastStepRef.current >= STEP_MS) {
        lastStepRef.current = now;
        stats.forEach((s, i) => {
          const cur = displayRef.current[i];
          const goal = scrollTargetRef.current[i];
          if (cur === goal) return;
          const next = cur + (goal > cur ? 1 : -1);
          displayRef.current[i] = next;
          const el = valueRefs.current[i];
          if (el) el.textContent = format(s, next);
        });
      }
      schedule();
    };

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readScrollTargets();
      schedule();
    };

    // Gate: only listen while meter is near viewport
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0 },
    );

    io.observe(track);
    readScrollTargets();
    schedule();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stats, trackSelector]);

  return (
    <div className="scroll-stats" ref={rootRef} aria-label="產品數據">
      {stats.map((s, i) => (
        <div className="scroll-stat" key={s.id}>
          <span
            className="scroll-stat-value tabular"
            ref={(el) => {
              valueRefs.current[i] = el;
            }}
          >
            {format(s, 0)}
          </span>
          <span className="scroll-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function format(s: Stat, n: number) {
  return `${s.prefix ?? ""}${n}${s.suffix ?? ""}`;
}

export const HERO_STATS = [
  { id: "protein", label: "粗蛋白 %", target: 62, suffix: "%" },
  { id: "price", label: "胡蘿蔔價", target: 79, prefix: "$" },
  { id: "fat", label: "粗脂肪 %", target: 14, suffix: "%" },
] as const;
