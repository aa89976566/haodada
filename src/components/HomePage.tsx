"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [flavorIndex, setFlavorIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const dismiss = useCallback(() => setReady(true), []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFlavorIndex((i) => (i + 1) % HIGHLIGHTS.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

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

          {/* "ingredient" layer — secondary dog cutout (Illegal Chips pattern) */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`ingredient-${item.id}`}
              className="ingredient"
              src={asset(item.eatingImage)}
              alt=""
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          {/* Main product = dog photo, same slot as chip BAG */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`bag-${item.id}`}
              className="bag hero-dog-bag"
              src={asset(item.bagImage)}
              alt={item.name}
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          {/* Desktop "eating" layer */}
          {HIGHLIGHTS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`eating-${item.id}`}
              className="eating"
              src={asset(item.eatingImage)}
              alt=""
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}

          <div className="headline">
            <div className="tagline-text brand-title">{BRAND.name}</div>
            <div className="tagline-2">{BRAND.tagline}</div>
            <p className="hero-sub-line">{BRAND.heroLine}</p>
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
              SHOP NOW
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
              className="main-bags"
              src={asset("/images/haodada/hero-pomeranian.png")}
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
              src={asset("/images/haodada/eat-bulldog.png")}
              alt={BRAND.mascot}
            />

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/images/haodada/pack-brown.png")}
                alt=""
                width={90}
                height={90}
                style={{ objectFit: "contain" }}
              />
              <div className="wee-side">
                <div className="wee-headline">
                  立刻入手 <span className="wee-text">{BRAND.name}</span>
                </div>
                <div className="wee-desc">
                  原肉低溫烘培
                  <br />
                  無添加防腐劑，毛孩安心咬
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
