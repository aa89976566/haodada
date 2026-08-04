"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { Experiment } from "@/data/dogParkLab";
import { asset } from "@/lib/asset";

function SplitFlapNumber({
  value,
  reduce,
  seed,
}: {
  value: number;
  reduce: boolean | null;
  seed: number;
}) {
  const mv = useMotionValue(reduce ? value : 0);
  const display = useTransform(mv, (v) => `${Math.round(v)}%`);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [mv, reduce, value]);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let timer: number;
    // Deterministic-ish schedule from seed (not Math.random).
    let tick = seed >>> 0;

    const nextWait = () => {
      tick = (Math.imul(tick ^ (tick >>> 15), 1 | tick) + 0x6d2b79f5) >>> 0;
      const unit = (tick >>> 0) / 4294967296;
      return 12000 + unit * 8000;
    };

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setGlitch(true);
        window.setTimeout(() => {
          if (!cancelled) setGlitch(false);
          schedule();
        }, 140);
      }, nextWait());
    };
    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce, seed]);

  return (
    <span className={`dpl-pct${glitch ? " is-glitch" : ""}`} aria-label={`Result ${value}%`}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

export function DriveHeroExperience({ experiment }: { experiment: Experiment }) {
  const reduce = useReducedMotion();
  const [cursorDog, setCursorDog] = useState(false);
  const [micro, setMicro] = useState<string | null>(null);
  const [warningIdx, setWarningIdx] = useState(0);
  const [productTilt, setProductTilt] = useState({ x: 0, y: 0 });
  const [linePressed, setLinePressed] = useState(false);
  const [stampOnce, setStampOnce] = useState(false);
  const [dogsLooking, setDogsLooking] = useState(false);

  const lineHref = useMemo(
    () => "https://line.me/R/ti/p/@furmosa",
    [],
  );

  useEffect(() => {
    // Stamp "實驗結果" feeling — once after load (overlay label).
    const t = window.setTimeout(() => setStampOnce(true), 180);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setDogsLooking(true), 8000);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!experiment.microEvent || reduce) return;
    const show = window.setTimeout(() => {
      setMicro(experiment.microEvent!.type);
      window.setTimeout(() => setMicro(null), 1600);
    }, experiment.microEvent.delayMs);
    return () => window.clearTimeout(show);
  }, [experiment.microEvent, reduce]);

  useEffect(() => {
    if (experiment.warnings.length <= 1) return;
    const id = window.setInterval(() => {
      setWarningIdx((i) => (i + 1) % experiment.warnings.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [experiment.warnings]);

  const onProductMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 8; // max ~4deg each side
    const rotX = (0.5 - py) * 8;
    setProductTilt({
      x: Math.max(-4, Math.min(4, rotX)),
      y: Math.max(-4, Math.min(4, rotY)),
    });
  };

  return (
    <section className="drive-hero dpl-hero" aria-label="DOG PARK LAB Hero">
      <div
        className={`drive-hero-stage dpl-stage${dogsLooking ? " dogs-looking" : ""}`}
        style={
          reduce
            ? undefined
            : {
                transform: `perspective(900px) rotateX(${productTilt.x}deg) rotateY(${productTilt.y}deg)`,
              }
        }
        onMouseMove={onProductMove}
        onMouseLeave={() => setProductTilt({ x: 0, y: 0 })}
      >
        <picture>
          <source srcSet={asset("/images/hero-drive.webp")} type="image/webp" />
          <img
            src={asset("/images/hero-drive.jpg")}
            alt="◈ 壕大大 ◈ 雞霸 — DOG PARK LAB poster"
            width={2394}
            height={1360}
            decoding="async"
            fetchPriority="high"
            className="drive-hero-img dpl-poster"
          />
        </picture>

        <div className="drive-hero-scanlines" aria-hidden="true" />
        <div className="drive-hero-grain" aria-hidden="true" />
        <div className="dpl-crt-flicker" aria-hidden="true" />

        {/* Dog hover zones — cursor becomes dog emoji */}
        <button
          type="button"
          className="dpl-hotspot dpl-hotspot-dog left"
          aria-label={`${experiment.dogs[0].label} profile`}
          onMouseEnter={() => setCursorDog(true)}
          onMouseLeave={() => setCursorDog(false)}
        />
        <button
          type="button"
          className="dpl-hotspot dpl-hotspot-dog right"
          aria-label={`${experiment.dogs[1].label} profile`}
          onMouseEnter={() => setCursorDog(true)}
          onMouseLeave={() => setCursorDog(false)}
        />

        {/* Physical LINE hit area over poster button */}
        <a
          className={`dpl-hotspot dpl-hotspot-line${linePressed ? " is-pressed" : ""}`}
          href={lineHref}
          target="_blank"
          rel="noreferrer"
          aria-label="加入 @FURMOSA"
          onMouseDown={() => setLinePressed(true)}
          onMouseUp={() => setLinePressed(false)}
          onMouseLeave={() => setLinePressed(false)}
        >
          <span className="dpl-line-stretch">@FURMOSA</span>
        </a>

        {/* Percentage overlay — covers baked 327% without redesigning poster */}
        <div className="dpl-pct-slot" aria-live="polite">
          {experiment.percentValue != null ? (
            <SplitFlapNumber value={experiment.percentValue} reduce={reduce} seed={experiment.seed} />
          ) : (
            <span className="dpl-pct dpl-pct-text">{experiment.result}</span>
          )}
        </div>

        {/* Title stamp once */}
        <div
          className={`dpl-title-stamp${stampOnce ? " is-stamped" : ""}`}
          aria-hidden="true"
        >
          實驗結果
        </div>

        {/* Random brutal stamps */}
        {experiment.stamps.map((s) => (
          <span
            key={`${s.kind}-${s.x}-${s.y}`}
            className="dpl-stamp"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.opacity,
              transform: `rotate(${s.rot}deg)`,
            }}
          >
            {s.kind}
          </span>
        ))}
      </div>

      {/* System HUD — outside poster layout chrome */}
      <div className="dpl-hud" data-dog-cursor={cursorDog ? "1" : "0"}>
        <div className="dpl-hud-tr">
          <span>SYSTEM ONLINE</span>
          <span>STATUS {experiment.status}</span>
        </div>
        <div className="dpl-hud-bl">
          <span>DOG PARK EXPERIMENT #{experiment.experimentNo}</span>
          <span>VER {experiment.version}</span>
        </div>

        <aside className="dpl-meta" aria-label="Experiment metadata">
          <p>
            <strong>Operator</strong> {experiment.operator}
          </p>
          <p>
            <strong>Location</strong> {experiment.location}
          </p>
          <p>
            <strong>Date</strong> {experiment.dateLabel}
          </p>
          <p>
            <strong>Side effect</strong> {experiment.sideEffect}
          </p>
          <p>
            <strong>Note</strong> {experiment.note}
          </p>
        </aside>

        <aside className="dpl-dogs" aria-label="Subject profiles">
          {experiment.dogs.map((d) => (
            <div key={d.label} className="dpl-dog-card">
              <p className="dpl-dog-label">{d.label}</p>
              <p>
                {d.trait} {d.traitValue}
              </p>
              <p>Likes {d.likes}</p>
              <p>Mood {d.mood}</p>
              <p>Treat detected {d.treatDetected ? "YES" : "NO"}</p>
            </div>
          ))}
        </aside>

        <aside className="dpl-log" aria-label="Observation log">
          <p className="dpl-log-title">OBSERVATION LOG</p>
          <ul>
            {experiment.observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </aside>

        {experiment.warnings[warningIdx] && (
          <p className="dpl-warning" role="status">
            {experiment.warnings[warningIdx]}
          </p>
        )}

        {micro && (
          <motion.p
            className="dpl-micro"
            initial={reduce ? false : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            {micro}
          </motion.p>
        )}
      </div>
    </section>
  );
}
