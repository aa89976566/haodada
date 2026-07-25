"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

type Chip = {
  originalX: number;
  x: number;
  y: number;
  speed: number;
  index: number;
  timeOffset: number;
  timeMultiplier: number;
  swaySize: number;
  elem: HTMLImageElement | null;
};

function makeChip(x: number, y: number, index: number): Chip {
  const wide = window.innerWidth > 800;
  return {
    originalX: x,
    x,
    y,
    speed: wide ? 2.5 : 2.2,
    index,
    timeOffset: Math.random(),
    timeMultiplier: 1 + Math.random(),
    swaySize: wide ? 2 * Math.random() + 0.4 : Math.random() + 0.3,
    elem: null,
  };
}

function chipStyle(chip: Chip) {
  return `transform: translate(${Math.round(chip.x)}px, ${Math.round(chip.y)}px); transition: transform .05s;`;
}

export function FallingChips() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const chips: Chip[] = [];
    let index = 0;
    let last = performance.now();
    let raf = 0;
    let alive = true;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--fullHeight",
        `${document.body.scrollHeight}px`,
      );
    };
    syncHeight();
    const heightTimer = window.setInterval(syncHeight, 1000);
    window.addEventListener("resize", syncHeight);

    const addChip = () => {
      if (!alive || document.hidden) return;
      const chip = makeChip(Math.random() * window.innerWidth - 100, -100, index);
      chips.push(chip);
      const img = document.createElement("img");
      img.id = `chip-${chip.index}`;
      img.src = asset(`/images/chips/${Math.floor(11 * Math.random())}.png`);
      img.alt = "";
      img.className = "chip";
      img.setAttribute("style", chipStyle(chip));
      root.appendChild(img);
      chip.elem = img;
      index += 1;
    };

    const update = (t: number) => {
      if (!alive) return;
      const delta = (t - last) / 10;
      for (let i = 0; i < chips.length; i += 1) {
        const chip = chips[i];
        chip.y += chip.speed * delta;
        chip.x +=
          Math.sin((chip.timeMultiplier * Date.now()) / 1000 + chip.timeOffset) *
          delta *
          chip.swaySize;
        if (chip.elem) chip.elem.setAttribute("style", chipStyle(chip));
        if (chip.y > document.body.scrollHeight + 100) {
          chip.elem?.remove();
          chips.splice(i, 1);
          i -= 1;
        }
      }
      last = t;
      raf = window.requestAnimationFrame(update);
    };

    const spawnTimer = window.setInterval(addChip, 700);
    raf = window.requestAnimationFrame(update);

    return () => {
      alive = false;
      window.clearInterval(spawnTimer);
      window.clearInterval(heightTimer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncHeight);
      chips.forEach((c) => c.elem?.remove());
    };
  }, []);

  return <div ref={ref} className="chips" aria-hidden />;
}
