"use client";

import { useCallback, useEffect, useState } from "react";
import { ITEMS } from "@/data/items";
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
  const [flavorIndex, setFlavorIndex] = useState(1); // start on Fugu blue hero
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const dismiss = useCallback(() => setReady(true), []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFlavorIndex((i) => (i + 1) % ITEMS.length);
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
            {ITEMS.map((item, i) => (
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

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ingredient dog-hero"
            src={asset("/images/dog-hero.png")}
            alt=""
          />
          {ITEMS.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`bag-${item.id}`}
              className="bag"
              src={asset(`/images/${item.id}/bag-isolated.png`)}
              alt=""
              style={{ opacity: i === flavorIndex ? 1 : 0 }}
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="eating dog-hero"
            src={asset("/images/dog-hero.png")}
            alt=""
          />

          <div className="headline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tagline" src={asset("/images/tagline.png")} alt="Illegal Chips" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tagline-mobile"
              src={asset("/images/tagline-mobile.png")}
              alt="Illegal Chips"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tagline-down"
              src={asset("/images/down-arrow.png")}
              alt="Scroll down"
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
            <img className="main-bags" src={asset("/images/three-bags.png")} alt="All three flavors" />

            <div className="main-al-quote">
              <div className="main-al-quote-text">
                &quot;These are the flavors the government doesn’t want you to try!&quot;
              </div>
              <div className="main-al-quote-attr">Illegal Al</div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="main-illegal-al" src={asset("/images/al.png")} alt="Illegal Al" />

            <div className="header-illegal-box-mobile" id="buy">
              <IllegalBox mobile />
            </div>

            <div className="meet">Meet the chips:</div>

            <div className="cards">
              {ITEMS.map((item, i) => (
                <BagCard
                  key={item.id}
                  item={item}
                  open={infoIndex === i}
                  onToggle={() => setInfoIndex((cur) => (cur === i ? null : i))}
                />
              ))}
            </div>

            <a
              className="wee-wrapper"
              href="https://www.sayweee.com/en/promotion/partnership/mschf-illegal-chips-2021?campaign_id=PartnerWebsite_MSCHF"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/wee.svg")} alt="Weee!" width={77} height={40} />
              <div className="wee-side">
                <div className="wee-headline">
                  order a bag on <span className="wee-text">Weee!</span>{" "}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="wee-arrow" src={asset("/images/wee-arrow.svg")} alt="" />
                </div>
                <div className="wee-desc">
                  Get $20 off and free delivery
                  <br />
                  on your first order of $35+
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
