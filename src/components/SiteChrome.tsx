"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BRAND } from "@/data/brand";

export function Background() {
  return <div id="__bg" aria-hidden />;
}

export function Logo() {
  return (
    <Link href="/" className="logo logo-text" aria-label={BRAND.name}>
      <span className="logo-mark">{BRAND.name}</span>
    </Link>
  );
}

export function CautionTape() {
  return <div className="caution caution-css" aria-hidden />;
}

export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("haodada-entered") === "1") {
        onDone();
        return;
      }
    } catch {
      // ignore
    }
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem("haodada-entered", "1");
      } catch {
        // ignore
      }
      onDone();
    }, 1400);
    return () => window.clearTimeout(t);
  }, [onDone]);

  const marquee = Array.from({ length: 18 }, (_, i) => (
    <div key={i} className="inner">
      {`///////// ${BRAND.name}\u00A0`}
    </div>
  ));

  return (
    <div id="MSCHFPreloader">
      <div className="content">
        <div className="marquee top">{marquee}</div>
        <div className="middle">
          <div className="line">----------------------------</div>
          <h3>
            * {BRAND.name} {BRAND.dropLabel} *
          </h3>
          <div className="line">----------------------------</div>
          <button
            type="button"
            className="enter"
            onClick={() => {
              try {
                sessionStorage.setItem("haodada-entered", "1");
              } catch {
                // ignore
              }
              onDone();
            }}
          >
            ENTER
          </button>
        </div>
        <div className="marquee bottom reverse">{marquee}</div>
      </div>
    </div>
  );
}
