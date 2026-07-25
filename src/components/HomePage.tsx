"use client";

import { useCallback, useState } from "react";
import { BRAND, HIGHLIGHTS } from "@/data/brand";
import { BagCard } from "@/components/BagCard";
import { FallingChips } from "@/components/FallingChips";
import { Footer, TikTokBar } from "@/components/Footer";
import { IllegalBox } from "@/components/IllegalBox";
import {
  Background,
  CautionTape,
  IllegalAl,
  Logo,
  Menu,
  Preloader,
} from "@/components/SiteChrome";
import { asset } from "@/lib/asset";

export function HomePage() {
  const [ready, setReady] = useState(false);
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const dismiss = useCallback(() => setReady(true), []);

  const scrollToCards = () => {
    document.getElementById("meet")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBuy = () => {
    const el =
      document.querySelector(".header-illegal-box-mobile") ||
      document.querySelector(".header-illegal-box");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="page-root">
      {!ready ? <Preloader onDone={dismiss} /> : null}
      <Background />
      <FallingChips />
      <Logo />
      <Menu />
      <CautionTape />
      <IllegalAl />

      <div className={`container home-container${ready ? "" : " is-loading"}`}>
        <header className="header haodada-hero">
          <div className={`bg-wrapper${ready ? "" : " bg-wrapper-hide"}`}>
            <div
              className="bg"
              style={{ opacity: 1, background: BRAND.heroColor }}
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-product"
            src={asset("/images/dog-hero.png")}
            alt={BRAND.name}
          />

          <div className="headline haodada-headline">
            <div className="brand-lockup">{BRAND.name}</div>
            <div className="tagline-2">{BRAND.tagline}</div>
            <p className="hero-sub">{BRAND.heroLine}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tagline-down"
              src={asset("/images/down-arrow.png")}
              alt="往下看"
              onClick={scrollToCards}
            />
          </div>

          {infoIndex === null ? (
            <button type="button" className="shop-now-bttn" onClick={scrollToBuy}>
              立刻下單
            </button>
          ) : null}

          <div className="header-illegal-box">
            <IllegalBox />
          </div>
        </header>

        <div className="content">
          <main className="main-content" id="meet">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="main-bags main-dog"
              src={asset("/images/dog-hero.png")}
              alt={BRAND.name}
            />

            <div className="main-al-quote">
              <div className="main-al-quote-text">
                「給嚎大大吃的，才敢給你家毛孩吃！」
              </div>
              <div className="main-al-quote-attr">{BRAND.mascot}</div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="main-illegal-al"
              src={asset("/images/dog-hero.png")}
              alt={BRAND.mascot}
            />

            <div className="header-illegal-box-mobile" id="buy">
              <IllegalBox mobile />
            </div>

            <div className="meet">為什麼選{BRAND.name}：</div>

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
              <img src={asset("/images/dog-hero.png")} alt="" width={77} height={77} />
              <div className="wee-side">
                <div className="wee-headline">
                  現在就帶 <span className="wee-text">{BRAND.shortName}</span> 回家
                </div>
                <div className="wee-desc">
                  原肉低溫烘培
                  <br />
                  無添加防腐劑，毛孩開心咬
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
