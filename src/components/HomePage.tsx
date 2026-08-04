"use client";

import { useEffect, useMemo, useState } from "react";
import { THISFOOT_HTML } from "@/data/thisfootHtml";
import { asset } from "@/lib/asset";

function basePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix absolute site-root asset paths for GitHub Pages basePath. */
function withBase(html: string) {
  const base = basePath();
  if (!base) return html;
  return html
    .replace(/(src|href)="(\/_nuxt\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(src|href)="(\/img\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(src|href)="(\/images\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(srcset)="(\/images\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(href)="(\/privacypolicy\.pdf)"/g, `$1="${base}$2"`)
    .replace(/(src|href)="(\/social\/[^"]+)"/g, `$1="${base}$2"`);
}

function markEntered() {
  try {
    sessionStorage.setItem("thisfoot-entered", "1");
  } catch {
    // ignore
  }
}

function hasEntered() {
  try {
    return sessionStorage.getItem("thisfoot-entered") === "1";
  } catch {
    return false;
  }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    if (hasEntered()) {
      onDone();
      return;
    }
    const spin = window.setTimeout(() => setRotate(true), 80);
    return () => window.clearTimeout(spin);
  }, [onDone]);

  return (
    <div id="MSCHFPreloader">
      <div className={`gradient-background${rotate ? " rotate" : ""}`} />
      <div className="loader-inner">
        <div className="content-wrapper">
          <h1>◈ 壕大大 ◈ 雞霸</h1>
          <h3>* 匠寵 DROP #01 *</h3>
          <button
            type="button"
            className="enter"
            onClick={() => {
              markEntered();
              onDone();
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

function DriveHero() {
  return (
    <section className="drive-hero" aria-label="Hero">
      <div className="drive-hero-stage">
        <picture>
          <source srcSet={asset("/images/hero-drive.webp")} type="image/webp" />
          <img
            src={asset("/images/hero-drive.jpg")}
            alt="◈ 壕大大 ◈ 雞霸"
            width={2394}
            height={1360}
            decoding="async"
            fetchPriority="high"
            className="drive-hero-img"
          />
        </picture>
        <div className="drive-hero-scanlines" aria-hidden="true" />
        <div className="drive-hero-grain" aria-hidden="true" />
      </div>
    </section>
  );
}

/** Drive campaign hero on top; thisfoot chat retained below. */
export function HomePage() {
  const [ready, setReady] = useState(false);
  const html = useMemo(() => withBase(THISFOOT_HTML), []);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    return () => document.body.classList.remove("page-ready");
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <DriveHero />
      <div
        className="thisfoot-mirror thisfoot-chat"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
