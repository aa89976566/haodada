"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const LINES = [
  "DOG PARK LAB BIOS 3.27",
  "Memory check ........... OK",
  "Mounting experiment disk ",
  "Loading CRT driver ......",
  "Calibrating subjects ....",
  "Ready.",
] as const;

/** Fast DOS-style boot into the fake OS — silence after. */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (reduce) {
      const t = window.setTimeout(onDone, 100);
      return () => window.clearTimeout(t);
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= LINES.length) {
        window.clearInterval(id);
        window.setTimeout(onDone, 90);
        return;
      }
      setLineIdx(i);
    }, 110);
    return () => window.clearInterval(id);
  }, [onDone, reduce]);

  return (
    <div className="os-boot" role="status" aria-live="polite">
      <pre className="os-boot-pre">
        {LINES.map((line, idx) =>
          idx <= lineIdx ? `${line}\n` : "",
        ).join("")}
        <span className="os-boot-blink">█</span>
      </pre>
    </div>
  );
}
