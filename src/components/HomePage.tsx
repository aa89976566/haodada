"use client";

import { useEffect, useState } from "react";
import { BRAND, CHAT } from "@/data/brand";

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
          <h1>{BRAND.name}</h1>
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
      <div className="wordmark-title">{BRAND.name}</div>
      <div className="wordmark-sub">{BRAND.dropLabel}</div>
    </div>
  );
}

function DesktopColumn({
  side,
}: {
  side: "left" | "right";
}) {
  return (
    <aside className={`column desktop-column ${side} is-hidden-mobile`}>
      <Wordmark className="logo-desktop" />
      <div className={`desktop-hero-art art-panel${side === "right" ? " alt" : ""}`}>
        <span className="art-mascot" aria-hidden />
        <span className="art-caption">
          {side === "left" ? "原肉低溫烘培" : "無添加防腐劑"}
        </span>
      </div>
      <div className="desktop-c2a">
        <a className="cta-chip" href="#order">
          {BRAND.currency}
          {BRAND.price}
        </a>
        <p>{BRAND.ctaHint}</p>
      </div>
    </aside>
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
                    key={`m-${i}-${j}`}
                  >
                    {text}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="yours messages" key={`y-${i}`}>
              {block.texts.map((text, j) => (
                <div
                  className={`message${j === block.texts.length - 1 ? " last" : ""}`}
                  key={`y-${i}-${j}`}
                >
                  {text}
                </div>
              ))}
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
                    <span className="credit-pill">by {BRAND.studio}</span>
                  </div>

                  <div className="hero-image art-panel">
                    <span className="art-mascot" aria-hidden />
                    <span className="art-caption">電腦也會想咬一口</span>
                  </div>

                  <div className="mobile-text" id="order">
                    <div className="c2a-wrapper">
                      <a className="button c2a-phone-hero" href="#order">
                        {BRAND.cta}
                        <span className="pointer" aria-hidden />
                      </a>
                      <p>{BRAND.ctaHint}</p>
                    </div>
                    <div className="legs">
                      <p className="legs-banner">{BRAND.tagline}</p>
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
