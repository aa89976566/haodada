"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND } from "@/data/brand";
import { asset } from "@/lib/asset";

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

export function Menu() {
  const pathname = usePathname();
  return (
    <nav className="menu">
      <Link
        href="/manifesto"
        className={`menu-link${pathname === "/manifesto" ? " menu-link-highlight" : ""}`}
      >
        品牌理念
      </Link>
      <Link
        href="/faq"
        className={`menu-link${pathname === "/faq" ? " menu-link-highlight" : ""}`}
      >
        常見問題
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
    const onScroll = () => {
      setShow(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`illegal-al haodada-mascot${show ? " show" : ""}`} aria-hidden>
      <div className={`mascot-bubble${show ? " show" : ""}`}>嚎！</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="illegal-al-img" src={asset("/images/dog-hero.png")} alt="" />
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

  const marquee = Array.from({ length: 16 }, (_, i) => (
    <div key={i} className="inner">
      {`///////// ${BRAND.name}\u00A0`}
    </div>
  ));

  return (
    <div id="MSCHFPreloader" className="haodada-preloader">
      <div className="content">
        <div className="marquee top">{marquee}</div>
        <div className="middle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/dog-hero.png")} alt={BRAND.name} />
          <div className="line">----------------------------</div>
          <h3>* {BRAND.name} *</h3>
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
            進入商店
          </button>
        </div>
        <div className="marquee bottom reverse">{marquee}</div>
      </div>
    </div>
  );
}
