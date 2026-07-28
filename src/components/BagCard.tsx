"use client";

import { useEffect } from "react";
import type { ProductHighlight } from "@/data/brand";

function BagInfo({
  item,
  onClose,
}: {
  item: ProductHighlight;
  onClose: () => void;
}) {
  const { info } = item;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button type="button" className="info-backdrop" aria-label="關閉" onClick={onClose} />
      <div className={`info info-${info.position}`} role="dialog">
        <button type="button" className="info-x text-x" onClick={onClose} aria-label="關閉">
          ×
        </button>
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
                <span className="info-stat-grams">{info.servingSize}</span>
              </div>
              <div className="info-stat-desc">serving size</div>
            </div>
            <div>
              <div className="info-stat-title">{info.totalFat}</div>
              <div className="info-stat-desc">process</div>
            </div>
            <div>
              <div className="info-stat-title">{info.calories}</div>
              <div className="info-stat-desc">perk</div>
            </div>
          </div>
        </div>
        <div className="info-review">
          <div className="info-stars-text">{"★".repeat(Math.floor(info.stars))}☆</div>
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
  item: ProductHighlight;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="card card-text-only"
      style={{
        background: `linear-gradient(180deg, hsla(0,0%,100%,.4), rgba(0,0,0,.4)), ${item.primaryColor}`,
        color: item.textColor,
      }}
    >
      <div className={`card-tooltip${open ? " card-tooltip-selected" : ""}`}>
        <button
          type="button"
          className={`card-info text-info${open ? " card-info-selected" : ""}`}
          aria-label={`Info ${item.name}`}
          onClick={onToggle}
        >
          i
        </button>
        {open ? <BagInfo item={item} onClose={onToggle} /> : null}
      </div>
      <div
        className="card-title card-title-text"
        style={{ color: item.textColor === "black" ? "#111" : "#ffda22" }}
      >
        {item.name}
      </div>
      <div className="card-body-text" style={{ color: item.textColor === "black" ? "#111" : "#fff" }}>
        {item.name}
      </div>
      <div
        className="card-desc"
        style={{ color: item.textColor === "black" ? "#000" : "#fff" }}
      >
        {item.desc}
        <span className="card-until-now"> – until now!!</span>
      </div>
    </div>
  );
}
