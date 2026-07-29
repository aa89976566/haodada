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
 * Apple-style sticky scrub + chase lag (After Effects “slider lag”):
 *
 * 1) Tall track creates scroll runway; sticky pin keeps hero in view
 * 2) Scroll distance → integer target (floor), one step per scroll quantum
 * 3) Display chases target by +1/−1 at capped cadence (slow add)
 * 4) textContent via refs (no React re-render / layout thrash)
 * 5) passive scroll + single rAF; IntersectionObserver gates listeners
 * 6) --scrub CSS var for compositor progress (bar / opacity)
 *
 * Refs: Apple product pages, CSS scroll-driven timelines, CounterUp.js
 */
export function ScrollChaseStats({
  stats,
  trackRef,
}: {
  stats: readonly Stat[];
  trackRef: React.RefObject<HTMLElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const displayRef = useRef<number[]>(stats.map(() => 0));
  const scrollTargetRef = useRef<number[]>(stats.map(() => 0));
  const rafRef = useRef(0);
  const lastStepRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      stats.forEach((s, i) => {
        displayRef.current[i] = s.target;
        const el = valueRefs.current[i];
        if (el) el.textContent = format(s, s.target);
      });
      track.style.setProperty("--scrub", "1");
      return;
    }

    const readScrollTargets = () => {
      const rect = track.getBoundingClientRect();
      const run = Math.max(1, track.offsetHeight - window.innerHeight);
      // How far we've scrolled through the sticky runway
      const scrolled = Math.min(run, Math.max(0, -rect.top));
      const progress = scrolled / run;
      progressRef.current = progress;
      track.style.setProperty("--scrub", progress.toFixed(4));

      stats.forEach((s, i) => {
        // Discrete steps: scroll → integer only (never fractional flash)
        scrollTargetRef.current[i] = Math.min(
          s.target,
          Math.floor(progress * s.target + 1e-6),
        );
      });
    };

    // Slower +1 for a deliberate “adding one while scrolling” feel
    const STEP_MS = 70;

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

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
          if (el) {
            el.textContent = format(s, next);
            el.dataset.pulse = "1";
            // clear pulse flag next frame (CSS after-effect hook)
            requestAnimationFrame(() => {
              if (el.dataset.pulse === "1") el.dataset.pulse = "0";
            });
          }
        });
      }
      schedule();
    };

    const onScroll = () => {
      readScrollTargets();
      schedule();
    };

    let listening = false;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !listening) {
          listening = true;
          window.addEventListener("scroll", onScroll, { passive: true });
          track.classList.add("is-scrubbing");
          onScroll();
        } else if (!visible && listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
          track.classList.remove("is-scrubbing");
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { rootMargin: "10% 0px 10% 0px", threshold: 0 },
    );

    io.observe(track);
    readScrollTargets();
    schedule();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      track.classList.remove("is-scrubbing");
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stats, trackRef]);

  const hero = stats[0];

  return (
    <div className="scroll-stats" ref={rootRef} aria-label="產品數據">
      <div className="scroll-stat scroll-stat-hero">
        <span
          className="scroll-stat-value tabular scroll-stat-hero-value"
          ref={(el) => {
            valueRefs.current[0] = el;
          }}
        >
          {format(hero, 0)}
        </span>
        <span className="scroll-stat-label">{hero.label}</span>
      </div>
      <div className="scroll-stat-row">
        {stats.slice(1).map((s, idx) => {
          const i = idx + 1;
          return (
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
          );
        })}
      </div>
      <div className="scroll-scrub-bar" aria-hidden>
        <div className="scroll-scrub-bar-fill" />
      </div>
    </div>
  );
}

function format(s: Stat, n: number) {
  return `${s.prefix ?? ""}${n}${s.suffix ?? ""}`;
}

export const HERO_STATS = [
  { id: "protein", label: "粗蛋白", target: 62, suffix: "%" },
  { id: "price", label: "胡蘿蔔", target: 79, prefix: "$" },
  { id: "fat", label: "粗脂肪", target: 14, suffix: "%" },
] as const;
