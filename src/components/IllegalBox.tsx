"use client";

import { useState } from "react";
import { BOX_UNIT_PRICE, SOLD_OUT } from "@/data/items";
import { asset } from "@/lib/asset";

export function IllegalBox({
  className = "",
}: {
  className?: string;
  mobile?: boolean;
}) {
  const [amount, setAmount] = useState(1);
  const price = amount * BOX_UNIT_PRICE;

  return (
    <div
      className={`header-box${SOLD_OUT ? " header-box-sold-out" : ""}${className ? ` ${className}` : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="header-box-header"
        src={asset("/images/illegal-box-header.png")}
        alt="Illegal Box"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="header-box-img"
        src={asset("/images/illegal-box.png")}
        alt="Illegal Chips box"
      />
      <div className="header-box-tagline">
        Each box contains all
        <br />
        three flavors
        <br />
        + 1 extra
      </div>
      <div className="header-box-input">
        <div className="header-box-input-title">Amount</div>
        <button
          type="button"
          className={`header-box-control${amount <= 1 ? " header-box-control-disabled" : ""}`}
          aria-label="Decrease amount"
          disabled={amount <= 1 || SOLD_OUT}
          onClick={() => setAmount((n) => Math.max(1, n - 1))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/minus.svg")} alt="" />
        </button>
        <div className="header-box-input-num">{amount}</div>
        <button
          type="button"
          className={`header-box-control${amount >= 10 ? " header-box-control-disabled" : ""}`}
          aria-label="Increase amount"
          disabled={amount >= 10 || SOLD_OUT}
          onClick={() => setAmount((n) => Math.min(10, n + 1))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/plus.svg")} alt="" />
        </button>
      </div>
      {SOLD_OUT ? (
        <span className="header-box-buy" aria-disabled="true">
          buy now
          <span className="header-box-price">${price}</span>
        </span>
      ) : (
        <a
          className="header-box-buy"
          href={`https://panopticon-industries.myshopify.com/cart/40054626222268:${amount}`}
        >
          buy now
          <span className="header-box-price">${price}</span>
        </a>
      )}
    </div>
  );
}
