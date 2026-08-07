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
          <h3>
            * {BRAND.studio} × {BRAND.furmosa} *
          </h3>
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

function startMutedAutoplay(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      /* Autoplay may be blocked until gesture */
    });
  }
}

/**
 * v15 shell + classic IBM triptych hero:
 * fixed side posters + scrolling center (classic-hero → chat).
 * Scroll drives CSS custom properties via rAF (max parallax ~14px).
 */
export function HomePage() {
  const [ready, setReady] = useState(false);
  const html = useMemo(() => withBase(buildSiteHtml()), []);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    return () => document.body.classList.remove("page-ready");
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const video = document.querySelector<HTMLVideoElement>(
      "video.chat-product-video",
    );
    if (video) {
      if (reduceMotion) {
        video.removeAttribute("autoplay");
        video.pause();
      } else {
        startMutedAutoplay(video);
      }
    }

    if (reduceMotion) {
      document.documentElement.style.setProperty("--scroll-y", "0");
      document.documentElement.style.setProperty("--parallax", "0");
      return;
    }

    let raf = 0;
    const applyScrollVars = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const parallax = Math.max(-14, Math.min(14, y * 0.035));
      const root = document.documentElement;
      root.style.setProperty("--scroll-y", String(y));
      root.style.setProperty("--parallax", String(parallax));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyScrollVars();
      });
    };
    applyScrollVars();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="site-mirror" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
