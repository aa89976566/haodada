"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Experiment } from "@/data/dogParkLab";
import { createRng } from "@/lib/seeded";
import { asset } from "@/lib/asset";

type OsEvent =
  | "crt_flicker"
  | "status_tick"
  | "stamp"
  | "warning"
  | "blink";

const EVENT_TYPES: OsEvent[] = [
  "crt_flicker",
  "status_tick",
  "stamp",
  "warning",
  "blink",
];

/**
 * Poster stays untouched inside a CRT viewport.
 * All fiction lives in the surrounding operating-system chrome.
 */
export function DriveHeroExperience({ experiment }: { experiment: Experiment }) {
  const reduce = useReducedMotion();
  const rngRef = useRef(createRng(experiment.seed ^ 0x0d06));
  const [popularity, setPopularity] = useState(
    experiment.percentValue ?? 327,
  );
  const [statusLine, setStatusLine] = useState(experiment.status);
  const [flicker, setFlicker] = useState(false);
  const [blinkSide, setBlinkSide] = useState<"left" | "right" | "both" | null>(
    null,
  );
  const [stampVisible, setStampVisible] = useState(false);
  const [stampKind, setStampKind] = useState(experiment.stamps[0]?.kind ?? "TESTED");
  const [dialog, setDialog] = useState<string | null>(null);
  const [linePressed, setLinePressed] = useState(false);

  const lineHref = useMemo(() => "https://line.me/R/ti/p/@furmosa", []);

  const runEvent = useCallback(
    (type: OsEvent) => {
      if (type === "crt_flicker") {
        setFlicker(true);
        window.setTimeout(() => setFlicker(false), 90);
        return;
      }
      if (type === "blink") {
        const side =
          rngRef.current() < 0.33
            ? "both"
            : rngRef.current() < 0.5
              ? "left"
              : "right";
        setBlinkSide(side);
        window.setTimeout(() => setBlinkSide(null), 120);
        return;
      }
      if (type === "status_tick") {
        setPopularity((p) => p + (rngRef.current() < 0.5 ? -1 : 1));
        setStatusLine((s) => (s === "RUNNING" ? "RUNNING" : experiment.status));
        return;
      }
      if (type === "stamp") {
        const kinds = experiment.stamps.map((s) => s.kind);
        setStampKind(
          kinds[Math.floor(rngRef.current() * Math.max(kinds.length, 1))] ??
            "VERIFIED",
        );
        setStampVisible(true);
        return;
      }
      if (type === "warning") {
        const w =
          experiment.warnings[0] ??
          "WARNING — Dog attraction exceeds normal range";
        setDialog(w);
        window.setTimeout(() => setDialog(null), 2200);
      }
    },
    [experiment.status, experiment.stamps, experiment.warnings],
  );

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let timer = 0;

    const schedule = () => {
      const wait = 10000 + rngRef.current() * 30000;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const type =
          EVENT_TYPES[Math.floor(rngRef.current() * EVENT_TYPES.length)]!;
        runEvent(type);
        schedule();
      }, wait);
    };

    // First silence — no event for a while after boot
    timer = window.setTimeout(schedule, 12000 + rngRef.current() * 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce, runEvent]);

  return (
    <section className="os-desktop" aria-label="DOG PARK LAB operating system">
      <header className="os-menubar">
        <span className="os-menubar-brand">DOG PARK LAB</span>
        <span className="os-menubar-item">File</span>
        <span className="os-menubar-item">View</span>
        <span className="os-menubar-item">System</span>
        <span className="os-menubar-clock">SYSTEM ONLINE</span>
      </header>

      <div className="os-workspace">
        <article
          className={`os-window os-window-viewport${flicker ? " is-flicker" : ""}`}
        >
          <div className="os-titlebar">
            <span className="os-titlebar-icon" aria-hidden="true" />
            <h1 className="os-titlebar-text">
              EXPERIMENT.VIEWPORT — #{experiment.experimentNo}
            </h1>
            <div className="os-titlebar-controls" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="os-toolbar">
            <span>Operator {experiment.operator}</span>
            <span>{experiment.location}</span>
            <span>Date {experiment.dateLabel}</span>
          </div>

          {/* CRT bezel — poster is the screen contents only */}
          <div className="os-crt">
            <div className="os-crt-bezel">
              <div className="os-crt-glass">
                <picture>
                  <source
                    srcSet={asset("/images/hero-drive.webp")}
                    type="image/webp"
                  />
                  <img
                    src={asset("/images/hero-drive.jpg")}
                    alt="◈ 壕大大 ◈ 雞霸 experiment viewport"
                    width={2394}
                    height={1360}
                    decoding="async"
                    fetchPriority="high"
                    className="os-crt-image"
                  />
                </picture>

                {/* Blink as CRT phosphor dip over dog regions — not floating text */}
                {blinkSide && (
                  <div
                    className={`os-blink os-blink-${blinkSide}`}
                    aria-hidden="true"
                  />
                )}

                {/* Invisible service hit zones inside the glass, no labels */}
                <a
                  className={`os-hit os-hit-line${linePressed ? " is-pressed" : ""}`}
                  href={lineHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="加入 @FURMOSA"
                  onMouseDown={() => setLinePressed(true)}
                  onMouseUp={() => setLinePressed(false)}
                  onMouseLeave={() => setLinePressed(false)}
                />
                <span
                  className="os-hit os-hit-dog left"
                  aria-hidden="true"
                  title={experiment.dogs[0].label}
                />
                <span
                  className="os-hit os-hit-dog right"
                  aria-hidden="true"
                  title={experiment.dogs[1].label}
                />
              </div>

              {/* Machine plates live on the bezel, not on the artwork */}
              <div className="os-plate os-plate-serial">
                <span>IBM-SVC</span>
                <span>UNIT {experiment.experimentNo}</span>
              </div>
              <div className="os-plate os-plate-inspect">
                <span>INSPECTION</span>
                <span>{statusLine}</span>
              </div>
              {stampVisible && (
                <div className="os-sticker" aria-live="polite">
                  {stampKind}
                </div>
              )}
            </div>
          </div>

          <footer className="os-statusbar">
            <span>STATUS {statusLine}</span>
            <span>POP {popularity}</span>
            <span>VER {experiment.version}</span>
            <span>{experiment.sideEffect}</span>
          </footer>
        </article>

        {dialog && (
          <div className="os-dialog" role="alertdialog" aria-live="assertive">
            <div className="os-dialog-title">SYSTEM.ALERT</div>
            <div className="os-dialog-body">
              <p>{dialog}</p>
              <button type="button" onClick={() => setDialog(null)}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
