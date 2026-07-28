"use client";

import { useCallback, useEffect, useState } from "react";
import { BRAND, HIGHLIGHTS } from "@/data/brand";
import { BagCard } from "@/components/BagCard";
import { Footer, TikTokBar } from "@/components/Footer";
import { IllegalBox } from "@/components/IllegalBox";
import {
  Background,
  CautionTape,
  Logo,
  Preloader,
} from "@/components/SiteChrome";

export function HomePage() {
  const [ready, setReady] = useState(false);
  const [flavorIndex, setFlavorIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const dismiss = useCallback(() => setReady(true), []);
  const active = HIGHLIGHTS[flavorIndex];

  useEffect(() => {
    const id = window.setInterval(() => {
      setFlavorIndex((i) => (i + 1) % HIGHLIGHTS.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  const scrollToCards = () => {
    document.getElementById("meet")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBuy = () => {
    document
      .getElementById("buy")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="page-root">
      {!ready ? <Preloader onDone={dismiss} /> : null}
      <Background />
      <Logo />
      <CautionTape />

      <div className={`container home-container${ready ? "" : " is-loading"}`}>
        <header className="header">
          <div className={`bg-wrapper${ready ? "" : " bg-wrapper-hide"}`}>
            {HIGHLIGHTS.map((item, i) => (
              <div
                key={`bg-${item.id}`}
                className="bg"
                style={{
                  opacity: i === flavorIndex ? 1 : 0,
                  background: item.primaryColor,
                }}
              />
            ))}
          </div>

          <div className="hero-product-slot bag" aria-hidden>
            <div className="hero-product-name">{active.name}</div>
            <div className="hero-product-desc">{active.desc}</div>
          </div>

          <div className="headline">
            <div className="tagline tagline-desktop-block">
              <div className="brand-title">{BRAND.name}</div>
              <div className="tagline-2">{BRAND.tagline}</div>
            </div>
            <div className="tagline-mobile tagline-mobile-block">
              <div className="brand-title">{BRAND.name}</div>
              <div className="tagline-2">{BRAND.tagline}</div>
            </div>
            <button type="button" className="tagline-down-btn" onClick={scrollToCards}>
              ↓
            </button>
          </div>

          {infoIndex === null ? (
            <button type="button" className="shop-now-bttn" onClick={scrollToBuy}>
              SHOP NOW
            </button>
          ) : null}

          <div className="header-illegal-box">
            <IllegalBox />
          </div>
        </header>

        <div className="content">
          <main className="main-content" id="meet">
            <div className="main-al-quote">
              <div className="main-al-quote-text">
                「這些是毛孩政府不希望你錯過的雞霸！」
              </div>
              <div className="main-al-quote-attr">{BRAND.mascot}</div>
            </div>

            <div className="header-illegal-box-mobile" id="buy">
              <IllegalBox mobile />
            </div>

            <div className="meet">Meet the {BRAND.shortName}:</div>

            <div className="cards">
              {HIGHLIGHTS.map((item, i) => (
                <BagCard
                  key={item.id}
                  item={item}
                  open={infoIndex === i}
                  onToggle={() => setInfoIndex((cur) => (cur === i ? null : i))}
                />
              ))}
            </div>

            <a className="wee-wrapper" href="#buy">
              <div className="wee-side">
                <div className="wee-headline">
                  order a bag of <span className="wee-text">{BRAND.shortName}</span>
                </div>
                <div className="wee-desc">
                  原肉低溫烘培
                  <br />
                  無添加防腐劑
                </div>
              </div>
            </a>
          </main>

          <TikTokBar />
          <Footer />
        </div>
      </div>
    </div>
  );
}
