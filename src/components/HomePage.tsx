"use client";

import { useEffect, useState } from "react";
import { BRAND, CHAT } from "@/data/brand";

/** Single Drive hero asset — used once in the phone column */
const HERO_SRC = {
  webp: "/images/hero-jiba.webp",
  jpg: "/images/hero-jiba.jpg",
  alt: `${BRAND.displayName} 產品主視覺`,
} as const;

function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("haodada-entered") === "1") {
        onDone();
        return;
      }
    } catch {
      // ignore
    }
    const spin = window.setTimeout(() => setRotate(true), 80);
    const done = window.setTimeout(() => {
      try {
        sessionStorage.setItem("haodada-entered", "1");
      } catch {
        // ignore
      }
      onDone();
    }, 1600);
    return () => {
      window.clearTimeout(spin);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div id="MSCHFPreloader">
      <div className={`gradient-background${rotate ? " rotate" : ""}`} />
      <div className="loader-inner">
        <div className="content-wrapper">
          <h1>{BRAND.displayName}</h1>
          <h3>* {BRAND.dropLabel} *</h3>
          <h3>{BRAND.tagline}</h3>
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
      </div>
    </div>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`wordmark ${className}`.trim()}>
      <div className="wordmark-title">{BRAND.displayName}</div>
      <div className="wordmark-sub">
        {BRAND.studio} · {BRAND.dropLabel}
      </div>
    </div>
  );
}

/** Desktop sides: logo + CTA only (no second/third hero photo) */
function DesktopColumn({ side }: { side: "left" | "right" }) {
  const variant = side === "left" ? BRAND.variants[0] : BRAND.variants[1];
  return (
    <div className={`column desktop-column ${side} is-hidden-mobile`}>
      <Wordmark className="logo-desktop" />
      <div className="desktop-side-copy">
        <div className="desktop-side-title">{variant.name}</div>
        <p>{variant.blurb}</p>
      </div>
      <div className="desktop-c2a">
        <a className="cta-chip" href={variant.url} target="_blank" rel="noreferrer">
          {BRAND.currency}
          {variant.price}
        </a>
        <p>{BRAND.ctaHint}</p>
      </div>
    </div>
  );
}

function ChatThread() {
  return (
    <div className="mobile-messages">
      <div className="chat">
        {CHAT.map((block, i) => {
          if (block.kind === "mine") {
            return (
              <div className="mine messages" key={`m-${i}`}>
                {block.texts.map((text, j) => (
                  <div
                    className={`message${j === block.texts.length - 1 ? " last" : ""}`}
                    key={`mt-${i}-${j}`}
                  >
                    {text}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="yours messages" key={`y-${i}`}>
              {block.texts.map((text, j) => {
                const isHtml = text.includes("<");
                return (
                  <div
                    className={`message${j === block.texts.length - 1 ? " last" : ""}`}
                    key={`yt-${i}-${j}`}
                    {...(isHtml
                      ? { dangerouslySetInnerHTML: { __html: text } }
                      : { children: text })}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HomePage() {
  const [ready, setReady] = useState(false);

  return (
    <div className={ready ? "page-ready" : undefined}>
      {!ready ? <Preloader onDone={() => setReady(true)} /> : null}

      <section className="hero is-fullheight">
        <div className="container main-container">
          <div className="columns is-gapless">
            <DesktopColumn side="left" />

            <div className="column is-3 mobile">
              <div className="mobile-wrapper">
                <div className="mobile-hero">
                  <Wordmark className="logo-main" />

                  <div className="about-link">
                    <a
                      className="credit-pill"
                      href="https://furmosa.com"
                      target="_blank"
                      rel="noreferrer"
                      title="匠寵 Furmosa"
                    >
                      by {BRAND.studio}
                    </a>
                  </div>

                  {/* ONE hero only — matches thisfoot .hero-image slot */}
                  <img
                    className="hero-image"
                    src={asset(HERO_SRC.jpg)}
                    srcSet={`${asset(HERO_SRC.webp)} 900w`}
                    sizes="(max-width: 768px) 100vw, 414px"
                    alt={HERO_SRC.alt}
                    width={900}
                    height={1274}
                    decoding="async"
                    fetchPriority="high"
                  />

                  <div className="mobile-text" id="order">
                    <div className="c2a-wrapper">
                      <a
                        className="button c2a-phone-hero"
                        href={BRAND.shopUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="購買雞霸"
                      >
                        {BRAND.cta}
                        <span className="pointer" aria-hidden />
                      </a>
                      <p>{BRAND.ctaHint}</p>
                    </div>
                    <div className="legs">
                      <p className="legs-banner">{BRAND.tagline}</p>
                      <p className="legs-price">
                        胡蘿蔔 {BRAND.currency}
                        {BRAND.price} · 原味 {BRAND.currency}
                        {BRAND.priceOriginal}
                      </p>
                    </div>
                  </div>
                </div>

                <ChatThread />
              </div>
            </div>

            <DesktopColumn side="right" />
          </div>
        </div>
      </section>
    </div>
  );
}
