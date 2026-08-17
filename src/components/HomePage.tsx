"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BRAND } from "@/data/brand";
import { buildSiteHtml, sidePosterInnerHtml } from "@/data/siteHtml";
import { track } from "@/lib/analytics";

function basePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix absolute site-root asset paths for GitHub Pages basePath. */
function withBase(html: string) {
  const base = basePath();
  if (!base) return html;
  return html
    .replace(/(src|href|poster|data-src)="(\/_nuxt\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(src|href|poster|data-src)="(\/img\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(src|href|poster|data-src)="(\/images\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/srcset="([^"]+)"/g, (_m, value: string) => {
      return `srcset="${value.replaceAll("/images/", `${base}/images/`)}"`;
    })
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
              track("enter_clicked");
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

function prepareMutedVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
}

/**
 * Fixed side posters + scroll-driven factory printer hero → chat.
 * Scroll drives parallax and the paper-feed animation via rAF.
 */
function syncSidePosters(enabled: boolean) {
  document.querySelectorAll<HTMLElement>("picture.side-poster").forEach((picture) => {
    const side = picture.dataset.side === "right" ? "right" : "left";
    if (!enabled) {
      picture.replaceChildren();
      return;
    }
    if (picture.querySelector("img")) return;
    picture.innerHTML = withBase(sidePosterInnerHtml(side));
  });
}

export function HomePage() {
  const [ready, setReady] = useState(false);
  const html = useMemo(() => withBase(buildSiteHtml()), []);
  const printedRef = useRef(false);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    return () => document.body.classList.remove("page-ready");
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const video = document.querySelector<HTMLVideoElement>(
      "video.chat-product-video",
    );
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const playButton = video.parentElement?.querySelector<HTMLButtonElement>(
      ".chat-video-play",
    );
    prepareMutedVideo(video);

    const showPlayButton = () => playButton?.classList.add("is-visible");
    const hidePlayButton = () => playButton?.classList.remove("is-visible");
    const loadVideo = () => {
      if (video.getAttribute("src")) return;
      const source = video.dataset.src;
      if (!source) return;
      video.src = source;
      video.load();
    };
    const playVideo = async () => {
      loadVideo();
      try {
        await video.play();
        hidePlayButton();
        track("video_played");
      } catch {
        showPlayButton();
      }
    };
    const onManualPlay = () => void playVideo();
    const onVideoError = () => showPlayButton();
    const onVideoPlaying = () => hidePlayButton();

    playButton?.addEventListener("click", onManualPlay);
    video.addEventListener("error", onVideoError);
    video.addEventListener("stalled", onVideoError);
    video.addEventListener("playing", onVideoPlaying);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadVideo();
          if (reduceMotion) showPlayButton();
          else void playVideo();
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "320px 0px", threshold: 0.05 },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      playButton?.removeEventListener("click", onManualPlay);
      video.removeEventListener("error", onVideoError);
      video.removeEventListener("stalled", onVideoError);
      video.removeEventListener("playing", onVideoPlaying);
      video.pause();
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const desktop = window.matchMedia("(min-width: 769px)");
    const apply = () => syncSidePosters(desktop.matches);
    apply();
    desktop.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      syncSidePosters(false);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const product = target.closest("a.chat-preview-card");
      if (product instanceof HTMLAnchorElement) {
        track("product_clicked", { href: product.href });
        return;
      }
      const line = target.closest('a[href*="line.me"]');
      if (line instanceof HTMLAnchorElement) {
        track("line_clicked", { href: line.href });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const printLab = document.querySelector<HTMLElement>(".print-lab");

    if (reduceMotion) {
      document.documentElement.style.setProperty("--scroll-y", "0");
      document.documentElement.style.setProperty("--parallax", "0");
      printLab?.style.setProperty("--print-progress", "1");
      printLab?.classList.add("is-printed");
      if (!printedRef.current) {
        printedRef.current = true;
        track("print_completed");
      }
      return;
    }

    let raf = 0;
    const applyScrollVars = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const parallax = Math.max(-14, Math.min(14, y * 0.035));
      const root = document.documentElement;
      root.style.setProperty("--scroll-y", String(y));
      root.style.setProperty("--parallax", String(parallax));

      if (printLab) {
        const rect = printLab.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / travel));
        const printProgress = progress;
        printLab.style.setProperty("--print-progress", printProgress.toFixed(4));
        printLab.classList.toggle("is-printing", printProgress > 0.015 && printProgress < 0.985);
        const printed = printProgress >= 0.985;
        printLab.classList.toggle("is-printed", printed);
        if (printed && !printedRef.current) {
          printedRef.current = true;
          track("print_completed");
        }
      }
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
