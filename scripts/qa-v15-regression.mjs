import { chromium } from "playwright";
import fs from "fs";

const URL = "http://127.0.0.1:4173/";
const OUT = "/opt/cursor/artifacts/v15-regression";
fs.mkdirSync(OUT, { recursive: true });

function near(a, b, tol = 3) {
  return Math.abs(a - b) <= tol;
}

async function dismiss(page) {
  const btn = page.locator("#SitePreloader button.enter");
  if (await btn.count()) {
    try {
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(300);
    } catch {}
  }
  await page.evaluate(() => {
    document.body.classList.add("page-ready");
    const p = document.getElementById("SitePreloader");
    if (p) p.style.display = "none";
  });
  await page.waitForTimeout(400);
}

async function measureScroll(page) {
  await page.setViewportSize({ width: 1324, height: 921 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await dismiss(page);

  const at = async (y) =>
    page.evaluate((scrollY) => {
      window.scrollTo(0, scrollY);
      const r = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          top: b.top,
          x: b.x,
          width: b.width,
          height: b.height,
          position: getComputedStyle(el).position,
        };
      };
      const nested = [...document.querySelectorAll("*")].filter((el) => {
        if (el === document.documentElement || el === document.body) return false;
        const s = getComputedStyle(el);
        return (
          (s.overflowY === "auto" || s.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 2
        );
      }).length;
      const se = document.scrollingElement;
      return {
        scrollY: window.scrollY,
        scrollingElement:
          se === document.documentElement
            ? "HTML"
            : se === document.body
              ? "BODY"
              : se?.tagName,
        nested,
        center: r(".center-column"),
        hero: r(".interactive-hero"),
        chat: r(".chat-stream"),
        left: r(".side-left"),
        right: r(".side-right"),
        css: [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map((l) => l.href)
          .find((h) => h.includes("haodada-site")),
        gap: (() => {
          const h = document.querySelector(".interactive-hero");
          const c = document.querySelector(".chat-stream");
          if (!h || !c) return null;
          return c.getBoundingClientRect().top - h.getBoundingClientRect().bottom;
        })(),
      };
    }, y);

  const y0 = await at(0);
  const y300 = await at(300);
  return { y0, y300 };
}

async function measureQuality(page, vw, vh) {
  await page.setViewportSize({ width: vw, height: vh, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  return page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      const nw = img.naturalWidth;
      const ratio = r.width > 0 ? nw / r.width : Infinity;
      return {
        src: (img.currentSrc || img.src || "").split("/").pop(),
        naturalWidth: nw,
        renderedWidth: Math.round(r.width * 1000) / 1000,
        ratio: Math.round(ratio * 1000) / 1000,
        ok: ratio >= 2 - 0.01,
      };
    }),
  );
}

async function measureLayout(page, vw, vh) {
  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await dismiss(page);
  return page.evaluate(() => {
    const c = document.querySelector(".center-column").getBoundingClientRect();
    const l = document.querySelector(".side-left").getBoundingClientRect();
    const r = document.querySelector(".side-right").getBoundingClientRect();
    return {
      center: { x: c.x, w: c.width },
      left: { x: l.x, w: l.width },
      right: { x: r.x, w: r.width },
    };
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const report = { checks: [], pass: true };
const push = (name, ok, detail) => {
  report.checks.push({ name, ok, detail });
  report.pass = report.pass && ok;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${detail}`);
};

try {
  const scroll = await measureScroll(page);
  report.scroll = scroll;
  const { y0, y300 } = scroll;
  push("css-v15", (y0.css || "").includes("haodada-site-v15"), y0.css);
  push("center-414", near(y0.center.width, 414, 1), `w=${y0.center.width}`);
  push("center-x", near(y0.center.x, (1324 - 414) / 2, 2), `x=${y0.center.x}`);
  push("left-w", near(y0.left.width, 455, 2), `w=${y0.left.width}`);
  push("right-w", near(y0.right.width, 455, 2), `w=${y0.right.width}`);
  push("sides-fixed", y0.left.position === "fixed" && y0.right.position === "fixed", `${y0.left.position}/${y0.right.position}`);
  push("hero-relative", y0.hero.position === "relative" || y0.hero.position === "static", y0.hero.position);
  push("gap0", near(y0.gap, 0, 1.5), String(y0.gap));
  push("scroll-el", y0.scrollingElement === "HTML" || y0.scrollingElement === "BODY", y0.scrollingElement);
  push("nested0", y0.nested === 0, String(y0.nested));
  push("y0-hero", near(y0.hero.top, 0, 3), String(y0.hero.top));
  push("y0-chat", near(y0.chat.top, y0.hero.height, 3), `chat=${y0.chat.top} h=${y0.hero.height}`);
  push("y300-hero", near(y300.hero.top, -300, 3), String(y300.hero.top));
  push("y300-chat", near(y300.chat.top, y0.hero.height - 300, 3), `chat=${y300.chat.top}`);
  push("y300-side", near(y300.left.top, 0, 1.5) && near(y300.right.top, 0, 1.5), `L=${y300.left.top} R=${y300.right.top}`);

  for (const [vw, vh] of [
    [1324, 921],
    [1920, 1080],
  ]) {
    const imgs = await measureQuality(page, vw, vh);
    report[`quality_${vw}`] = imgs;
    const bad = imgs.filter((i) => !i.ok);
    push(`dpr2-${vw}`, bad.length === 0, bad.length ? JSON.stringify(bad) : "all>=2");
  }

  const layout1920 = await measureLayout(page, 1920, 1080);
  report.layout1920 = layout1920;
  push("1920-center", near(layout1920.center.w, 414, 1) && near(layout1920.center.x, 753, 2), JSON.stringify(layout1920.center));
  push("1920-sides", near(layout1920.left.w, 753, 2) && near(layout1920.right.w, 753, 2), JSON.stringify({ L: layout1920.left, R: layout1920.right }));
} finally {
  await browser.close();
}

fs.writeFileSync(`${OUT}/regression.json`, JSON.stringify(report, null, 2));
console.log(report.pass ? "\nREGRESSION PASS" : "\nREGRESSION FAIL");
process.exit(report.pass ? 0 : 1);
