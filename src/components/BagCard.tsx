"use client";

import { useEffect } from "react";
import type { ChipItem } from "@/data/items";

function BagInfo({
  item,
  onClose,
}: {
  item: ChipItem;
  onClose: () => void;
}) {
  const { info } = item;
  const starsSrc =
    info.stars === 4.5 ? "/images/stars-4.5.svg" : "/images/stars-4.svg";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        className="info-backdrop"
        aria-label="Close info"
        onClick={onClose}
      />
      <div className={`info info-${info.position}`} role="dialog">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="info-arrow" src="/images/info-arrow.svg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="info-x"
          src="/images/x.svg"
          alt="Close"
          onClick={onClose}
        />
        <div className="info-headline">{info.headline}</div>
        <div className="info-content">
          <div className="info-does-not">Does not contain</div>
          <div className="info-content-title">{info.doesNotContain}</div>
          <div className="info-divider" />
          <div className="info-desc">{info.desc}</div>
          <div className="info-divider" />
          <div className="info-stats">
            <div>
              <div className="info-stat-title">
                {info.servingSize} <span className="info-stat-grams">bag</span>
              </div>
              <div className="info-stat-desc">serving size</div>
            </div>
            <div>
              <div className="info-stat-title">
                {info.totalFat}
                <span className="info-stat-grams">g</span>
              </div>
              <div className="info-stat-desc">total fat</div>
            </div>
            <div>
              <div className="info-stat-title">{info.calories}</div>
              <div className="info-stat-desc">calories</div>
            </div>
          </div>
        </div>
        <div className="info-review">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="info-stars-img" src={starsSrc} alt={`${info.stars} stars`} />
          <div className="info-review-text">{info.numReviews} reviews</div>
        </div>
      </div>
    </>
  );
}

export function BagCard({
  item,
  open,
  onToggle,
}: {
  item: ChipItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        background: `linear-gradient(180deg, hsla(0,0%,100%,.4), rgba(0,0,0,.4)), ${item.primaryColor}`,
        color: item.textColor,
      }}
    >
      <div className={`card-tooltip${open ? " card-tooltip-selected" : ""}`}>
        <button
          type="button"
          className={`card-info${open ? " card-info-selected" : ""}`}
          aria-label={`Info about ${item.name}`}
          onClick={onToggle}
        />
        {open ? <BagInfo item={item} onClose={onToggle} /> : null}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="card-title"
        src={`/images/${item.id}/title.png`}
        alt={item.name}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="card-image"
        src={`/images/${item.id}/bag.png`}
        alt={`${item.name} chips`}
      />
      <div className="card-desc" style={{ color: item.textColor === "black" ? "#000" : "#fff" }}>
        {item.desc}
        <span className="card-until-now"> – until now!!</span>
      </div>
      {item.showMythical ? (
        <div className="card-link">
          Visit{" "}
          <a href="https://www.youtube.com/mythicalkitchen" target="_blank" rel="noreferrer">
            mythicalkitchen.com
          </a>
          {item.link ? (
            <a
              className="card-play"
              href={item.link}
              target="_blank"
              rel="noreferrer"
              aria-label="Play video"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
