"use client";

import { useEffect, useMemo, useState } from "react";
import { BRAND } from "@/data/brand";
import { buildSiteHtml } from "@/data/siteHtml";

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
    .replace(/(src|href)="(\/social\/[^"]+)"/g, `$1="${base}$2"`);
}

const ENTERED_KEY = "haodada-entered";

function markEntered() {
  try {
    sessionStorage.setItem(ENTERED_KEY, "1");
  } catch {
    // ignore
  }
}

function hasEntered() {
  try {
    return sessionStorage.getItem(ENTERED_KEY) === "1";
  } catch {
    return false;
  }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [rotate, setRotate] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (hasEntered()) {
      onDone();
      return;
    }
    const spin = window.setTimeout(() => setRotate(true), 80);
    return () => window.clearTimeout(spin);
  }, [onDone]);

  return (
    <div
      id="SitePreloader"
      className={exiting ? "is-exiting" : undefined}
      style={exiting ? { pointerEvents: "auto" } : undefined}
    >
      <div className={`gradient-background${rotate ? " rotate" : ""}`} />
      <div className="loader-inner">
        <div className="content-wrapper">
          <h1>{BRAND.name}</h1>
          <h3>* {BRAND.studio} × {BRAND.furmosa} *</h3>
          <button
            type="button"
            className="enter"
            disabled={exiting}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (exiting) return;
              markEntered();
              setExiting(true);
              // Delay unmount past mouseup so ENTER cannot click-through
              // to the @FURMOSA hotspot underneath.
              window.setTimeout(() => onDone(), 320);
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

/** Left/right fixed columns, scrolling center chat — 嚎大大雞霸 / FURMOSA. */
export function HomePage() {
  const [ready, setReady] = useState(false);
  const html = useMemo(() => withBase(buildSiteHtml()), []);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    return () => document.body.classList.remove("page-ready");
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="site-mirror" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
