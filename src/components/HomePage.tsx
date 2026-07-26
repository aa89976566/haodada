"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BELOW_FOLD_IMAGE,
  BRAND,
  HIGHLIGHTS,
  MASCOT_IMAGE,
} from "@/data/brand";
import { BagCard } from "@/components/BagCard";
import { FallingChips } from "@/components/FallingChips";
import { Footer, TikTokBar } from "@/components/Footer";
import { IllegalBox } from "@/components/IllegalBox";
import {
  Background,
  CautionTape,
  Logo,
  Menu,
  Preloader,
} from "@/components/SiteChrome";
import { asset } from "@/lib/asset";

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
      <FallingChips />
      <Logo />
      <Menu />
      <CautionTape />

      <div className={`container home-container${ready ? "" : " is-loading"}`}>
        {/* ===== HERO — mirrors Illegal Chips header structure ===== */}
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

          {/* mobile secondary layer (Illegal Chips: .ingredient) */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`ingredient-${item.id}`}
              className="ingredient"
              src={asset(item.sideImage)}
              alt=""
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          {/* main product replaces chip BAG */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`bag-${item.id}`}
              className="bag"
              src={asset(item.image)}
              alt={item.name}
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          {/* desktop left layer (Illegal Chips: .eating) */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`eating-${item.id}`}
              className="eating"
              src={asset(item.sideImage)}
              alt=""
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          <div className="headline">
            {/* desktop tagline block */}
            <div className="tagline tagline-desktop-block">
              <div className="brand-title">{BRAND.name}</div>
              <div className="tagline-2">{BRAND.tagline}</div>
            </div>
            {/* mobile tagline block */}
            <div className="tagline-mobile tagline-mobile-block">
              <div className="brand-title">{BRAND.name}</div>
              <div className="tagline-2">{BRAND.tagline}</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tagline-down"
              src={asset("/images/down-arrow.png")}
              alt=""
              onClick={scrollToCards}
            />
          </div>

          {infoIndex === null ? (
            <button type="button" className="shop-now-bttn" onClick={scrollToBuy}>
              SHOP NOW
            </button>
          ) : null}

          {/* desktop-only shop dock (hidden on mobile like original) */}
          <div className="header-illegal-box">
            <IllegalBox productImage={active.image} />
          </div>
        </header>

        {/* ===== BELOW FOLD — mirrors Illegal Chips .content ===== */}
        <div className="content">
          <main className="main-content" id="meet">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="main-bags"
              src={asset(BELOW_FOLD_IMAGE)}
              alt={BRAND.name}
            />

            <div className="main-al-quote">
              <div className="main-al-quote-text">
                「這些是毛孩政府不希望你錯過的雞霸！」
              </div>
              <div className="main-al-quote-attr">{BRAND.mascot}</div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="main-illegal-al"
              src={asset(MASCOT_IMAGE)}
              alt={BRAND.mascot}
            />

            <div className="header-illegal-box-mobile" id="buy">
              <IllegalBox productImage={active.image} mobile />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/images/haodada/pack-brown.png")}
                alt=""
                width={88}
                height={88}
                style={{ objectFit: "contain" }}
              />
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
