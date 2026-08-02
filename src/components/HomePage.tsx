"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BRAND, CHAT } from "@/data/brand";

/** Single Drive hero — https://drive.google.com/file/d/1s302uFStOx6Pqki74FNVefS2qL3J3j9L */
const HERO_SRC = {
  webp: "/images/hero-drive.webp",
  jpg: "/images/hero-drive.jpg",
  alt: `${BRAND.displayName} 產品主視覺`,
  width: 1054,
  height: 1492,
} as const;

function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}

function markEntered() {
  try {
    sessionStorage.setItem("haodada-entered", "1");
  } catch {
    // ignore
  }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [rotate, setRotate] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

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
    return () => {
      window.clearTimeout(spin);
    };
  }, [onDone]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("haodada-entered") === "1") {
        return;
      }
    } catch {
      // ignore
    }

    if (progress === null) {
      const id = window.setTimeout(() => setProgress(12), 400);
      return () => window.clearTimeout(id);
    }

    if (progress < 100) {
      const id = window.setTimeout(
        () => setProgress(Math.min(100, progress + 18)),
        280,
      );
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      markEntered();
      onDone();
    }, 450);
    return () => window.clearTimeout(id);
  }, [progress, onDone]);

  return (
    <div id="MSCHFPreloader">
      <div className={`gradient-background${rotate ? " rotate" : ""}`} />
      <div className="loader-inner">
        <div className="content-wrapper">
          <h1>{BRAND.displayName}</h1>
          <h3>* {BRAND.dropLabel} *</h3>
          <h3>{BRAND.tagline}</h3>
          <div className="dark preloader-progress">
            <ProgressBar
              value={progress}
              label="雞霸烘乾進度"
              pendingLabel="低溫烘乾中"
              completeLabel="可以開吃了"
            />
          </div>
          <button
            type="button"
            className="enter"
            onClick={() => {
              markEntered();
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

                  {/* ONE hero only — Drive file 1s302uFStOx6Pqki74FNVefS2qL3J3j9L */}
                  <img
                    className="hero-image"
                    src={asset(HERO_SRC.jpg)}
                    srcSet={`${asset(HERO_SRC.webp)} ${HERO_SRC.width}w, ${asset(HERO_SRC.jpg)} ${HERO_SRC.width}w`}
                    sizes="(max-width: 768px) 100vw, 414px"
                    alt={HERO_SRC.alt}
                    width={HERO_SRC.width}
                    height={HERO_SRC.height}
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
