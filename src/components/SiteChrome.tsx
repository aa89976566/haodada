"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Background() {
  return <div id="__bg" aria-hidden />;
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Illegal Chips">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.png" alt="Illegal Chips" />
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
    const onScroll = () => {
      setShow(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="illegal-al" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`illegal-al-quote${show ? " show" : ""}`}
        src="/images/al-quote.png"
        alt=""
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="illegal-al-img" src="/images/al.png" alt="" />
    </div>
  );
}

export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("illegal-chips-entered") === "1") {
        onDone();
        return;
      }
    } catch {
      // ignore
    }
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem("illegal-chips-entered", "1");
      } catch {
        // ignore
      }
      onDone();
    }, 1800);
    return () => window.clearTimeout(t);
  }, [onDone]);

  const marquee = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className="inner">
      {"///////// MSCHF DROP\u00A0"}
    </div>
  ));

  return (
    <div id="MSCHFPreloader">
      <div className="content">
        <div className="marquee top">{marquee}</div>
        <div className="middle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/drop-logo.png" alt="MSCHF" />
          <div className="line">----------------------------</div>
          <h3>* MSCHF DROP #61 *</h3>
          <div className="line">----------------------------</div>
          <button
            type="button"
            className="enter"
            onClick={() => {
              try {
                sessionStorage.setItem("illegal-chips-entered", "1");
              } catch {
                // ignore
              }
              onDone();
            }}
          >
            Enter
          </button>
        </div>
        <div className="marquee bottom reverse">{marquee}</div>
      </div>
    </div>
  );
}
