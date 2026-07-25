"use client";

import { useState } from "react";
import { BRAND } from "@/data/brand";
import { asset } from "@/lib/asset";

export function IllegalBox({
  className = "",
}: {
  className?: string;
  mobile?: boolean;
}) {
  const [amount, setAmount] = useState(1);
  const price = amount * BRAND.price;

  return (
    <div
      className={`header-box${BRAND.soldOut ? " header-box-sold-out" : ""}${className ? ` ${className}` : ""}`}
    >
      <div className="header-box-brand-badge">{BRAND.name}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="header-box-img header-box-img-dog"
        src={asset("/images/dog-hero.png")}
        alt={BRAND.name}
      />
      <div className="header-box-tagline">
        原肉雞排零食
        <br />
        低溫烘培
        <br />
        毛孩大口咬
      </div>
      <div className="header-box-input">
        <div className="header-box-input-title">數量</div>
        <button
          type="button"
          className={`header-box-control${amount <= 1 ? " header-box-control-disabled" : ""}`}
          aria-label="減少數量"
          disabled={amount <= 1 || BRAND.soldOut}
          onClick={() => setAmount((n) => Math.max(1, n - 1))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/minus.svg")} alt="" />
        </button>
        <div className="header-box-input-num">{amount}</div>
        <button
          type="button"
          className={`header-box-control${amount >= 10 ? " header-box-control-disabled" : ""}`}
          aria-label="增加數量"
          disabled={amount >= 10 || BRAND.soldOut}
          onClick={() => setAmount((n) => Math.min(10, n + 1))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/plus.svg")} alt="" />
        </button>
      </div>
      {BRAND.soldOut ? (
        <span className="header-box-buy" aria-disabled="true">
          立即購買
          <span className="header-box-price">
            {BRAND.currency}
            {price}
          </span>
        </span>
      ) : (
        <a className="header-box-buy" href="#buy">
          立即購買
          <span className="header-box-price">
            {BRAND.currency}
            {price}
          </span>
        </a>
      )}
    </div>
  );
}
