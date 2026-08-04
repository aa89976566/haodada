"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LINES = [
  "Initializing…",
  "Scanning Dog Park…",
  "Loading Experiment…",
  "Calibrating Dogs…",
  "Experiment Ready",
] as const;

export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (reduce) {
      const t = window.setTimeout(onDone, 120);
      return () => window.clearTimeout(t);
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= LINES.length) {
        window.clearInterval(id);
        window.setTimeout(onDone, 80);
        return;
      }
      setLineIdx(i);
    }, 140);

    return () => window.clearInterval(id);
  }, [onDone, reduce]);

  return (
    <div className="dpl-boot" role="status" aria-live="polite">
      <div className="dpl-boot-panel">
        <p className="dpl-boot-title">DOG PARK LAB</p>
        <ul className="dpl-boot-lines">
          {LINES.map((line, idx) => (
            <li
              key={line}
              className={idx <= lineIdx ? "is-on" : ""}
              aria-hidden={idx > lineIdx}
            >
              {idx <= lineIdx ? `> ${line}` : ""}
            </li>
          ))}
        </ul>
        {!reduce && (
          <motion.div
            className="dpl-boot-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}
