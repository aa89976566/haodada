"use client";

import { useEffect } from "react";
import type { ProductHighlight } from "@/data/brand";
import { asset } from "@/lib/asset";

function BagInfo({
  item,
  onClose,
}: {
  item: ProductHighlight;
  onClose: () => void;
}) {
  const { info } = item;
  const starsSrc =
    info.stars >= 4.5 ? asset("/images/stars-4.5.svg") : asset("/images/stars-4.svg");

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
        aria-label="關閉資訊"
        onClick={onClose}
      />
      <div className={`info info-${info.position}`} role="dialog">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="info-arrow" src={asset("/images/info-arrow.svg")} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="info-x"
          src={asset("/images/x.svg")}
          alt="關閉"
          onClick={onClose}
        />
        <div className="info-headline">{info.headline}</div>
        <div className="info-content">
          <div className="info-does-not">堅持不含</div>
          <div className="info-content-title">{info.doesNotContain}</div>
          <div className="info-divider" />
          <div className="info-desc">{info.desc}</div>
          <div className="info-divider" />
          <div className="info-stats">
            <div>
              <div className="info-stat-title">
                <span className="info-stat-grams">{info.servingSize}</span>
              </div>
              <div className="info-stat-desc">份量建議</div>
            </div>
            <div>
              <div className="info-stat-title">{info.totalFat}</div>
              <div className="info-stat-desc">工法</div>
            </div>
            <div>
              <div className="info-stat-title">{info.calories}</div>
              <div className="info-stat-desc">亮點</div>
            </div>
          </div>
        </div>
        <div className="info-review">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="info-stars-img" src={starsSrc} alt={`${info.stars} 星`} />
          <div className="info-review-text">{info.numReviews} 則毛孩家長評價</div>
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
          aria-label={`關於${item.name}`}
          onClick={onToggle}
        />
        {open ? <BagInfo item={item} onClose={onToggle} /> : null}
      </div>
      <div
        className="card-title-text"
        style={{ color: item.textColor === "black" ? "#111" : "#fff" }}
      >
        {item.name}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="card-image card-image-dog"
        src={asset(item.image)}
        alt={item.name}
      />
      <div
        className="card-desc"
        style={{ color: item.textColor === "black" ? "#000" : "#fff" }}
      >
        {item.desc}
      </div>
    </div>
  );
}
