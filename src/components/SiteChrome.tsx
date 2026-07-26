"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, MASCOT_IMAGE } from "@/data/brand";
import { asset } from "@/lib/asset";

export function Background() {
  return <div id="__bg" aria-hidden />;
}

/** Text logo only — no product photo (avoids hero duplication) */
export function Logo() {
  return (
    <Link href="/" className="logo logo-text" aria-label={BRAND.name}>
      <span className="logo-mark">{BRAND.name}</span>
    </Link>
  );
}

export function Menu() {
  const pathname = usePathname();
  return (
    <nav className="menu">
      <Link
        href="/manifesto"
        className={`menu-link${pathname === "/manifesto" ? " menu-link-highlight" : ""}`}
      >
        Manifesto
      </Link>
      <Link
        href="/faq"
        className={`menu-link${pathname === "/faq" ? " menu-link-highlight" : ""}`}
      >
        FAQ
      </Link>
    </nav>
  );
}

export function CautionTape() {
  return <div className="caution" aria-hidden />;
}

export function IllegalAl() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="illegal-al" aria-hidden>
      <div className={`illegal-al-quote text-bubble${show ? " show" : ""}`}>嚎！</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="illegal-al-img" src={asset(MASCOT_IMAGE)} alt="" />
    </div>
  );
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
    }, 1600);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/haodada/hero-pomeranian.png")} alt={BRAND.name} />
          <div className="line">----------------------------</div>
          <h3>* {BRAND.name} {BRAND.dropLabel} *</h3>
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
