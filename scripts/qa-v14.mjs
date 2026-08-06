import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/v14-qa";
const URL = "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 390, h: 844 },
  { w: 820, h: 900 },
  { w: 1024, h: 900 },
  { w: 1440, h: 900 },
  { w: 1920, h: 900 },
];
const HARD_TIMEOUT_MS = 90_000;

fs.mkdirSync(OUT, { recursive: true });

function near(a, b, tol = 1.5) {
  return Math.abs(a - b) <= tol;
}

async function dismissPreloader(page) {
  const btn = page.locator("#SitePreloader button.enter");
  if (await btn.count()) {
    try {
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(200);
    } catch {
      /* ignore */
    }
  }
  await page.evaluate(() => {
    document.body.classList.add("page-ready");
    const p = document.getElementById("SitePreloader");
    if (p) p.style.display = "none";
  });
}

async function measure(page, vw, vh) {
  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  await dismissPreloader(page);
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const master = document.querySelector(".desktop-master");
    const masterImg = document.querySelector(".desktop-master-img");
    const flow = document.querySelector(".center-flow");
    const spacer = document.querySelector(".center-spacer");
    const mobileHero = document.querySelector(".mobile-hero-flow");
    const chat = document.querySelector(".chat-stream");
    const video = document.querySelector("video.chat-product-video");
    const cssHref =
      [...document.querySelectorAll('link[rel="stylesheet"]')]
        .map((l) => l.href)
        .find((h) => h.includes("haodada-site")) || "";

    function rect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    }
    function style(el) {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        position: s.position,
        display: s.display,
        backgroundColor: s.backgroundColor,
        height: s.height,
        zIndex: s.zIndex,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        paddingTop: s.paddingTop,
        transform: s.transform,
      };
    }

    const banned = [];
    const html = document.body.innerText || "";
    for (const w of ["哪裡買", "LINE 加入", "line.me", "furmosa.com/products"]) {
      if (html.includes(w)) banned.push(w);
    }

    const mh = rect(mobileHero);
    const ch = rect(chat);
    const sp = rect(spacer);

    return {
      cssHref,
      hasThreeCrop: !!(
        document.querySelector(".reference-shell") ||
        document.querySelector(".master-side")
      ),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      docWidth: document.documentElement.scrollWidth,
      banned,
      master: { style: style(master), rect: rect(master) },
      masterImg: masterImg
        ? {
            rect: rect(masterImg),
            naturalWidth: masterImg.naturalWidth,
            naturalHeight: masterImg.naturalHeight,
            objectFit: getComputedStyle(masterImg).objectFit,
            src: (masterImg.getAttribute("src") || "").split("/").pop(),
          }
        : null,
      flow: rect(flow),
      spacer: { style: style(spacer), rect: sp },
      mobileHero: { style: style(mobileHero), rect: mh },
      chat: { style: style(chat), rect: ch },
      gapSpacerChat: sp && ch ? ch.top - sp.bottom : null,
      gapMobileHeroChat: mh && ch ? ch.top - mh.bottom : null,
      video: video
        ? {
            inChat: !!video.closest(".chat-stream"),
            autoplay: video.hasAttribute("autoplay"),
            muted: video.muted || video.hasAttribute("muted"),
            loop: video.hasAttribute("loop"),
            controls: video.hasAttribute("controls"),
            paused: video.paused,
          }
        : null,
    };
  });

  let afterScroll = null;
  if (vw >= 1024) {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(150);
    afterScroll = await page.evaluate(() => {
      const master = document.querySelector(".desktop-master");
      const spacer = document.querySelector(".center-spacer");
      const chat = document.querySelector(".chat-stream");
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: b.top, y: b.y, height: b.height, width: b.width };
      };
      return {
        scrollY: window.scrollY,
        master: r(master),
        spacer: r(spacer),
        chat: r(chat),
        masterPos: getComputedStyle(master).position,
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  const shot = path.join(OUT, `v14-${vw}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });

  push("css-v14", data.cssHref.includes("haodada-site-v14"), data.cssHref);
  push("no-three-crop", !data.hasThreeCrop, String(data.hasThreeCrop));
  push("no-overflow", !data.overflowX, `docW=${data.docWidth}`);
  push("banned", data.banned.length === 0, JSON.stringify(data.banned));
  push(
    "video",
    !!data.video &&
      data.video.inChat &&
      data.video.muted &&
      data.video.autoplay &&
      data.video.loop &&
      !data.video.controls,
    JSON.stringify(data.video),
  );

  if (vw >= 1024) {
    const expectX = (vw - 414) / 2;
    push(
      "center-flow",
      near(data.flow.x, expectX, 2) && near(data.flow.width, 414, 1),
      `x=${data.flow.x} w=${data.flow.width}`,
    );
    push(
      "master-fixed",
      data.master.style.position === "fixed" &&
        near(data.master.rect.top, 0, 1) &&
        near(data.master.rect.width, vw, 2) &&
        near(data.master.rect.height, vh, 2),
      JSON.stringify({ style: data.master.style, rect: data.master.rect }),
    );
    push(
      "master-img",
      data.masterImg?.naturalWidth === 960 &&
        data.masterImg?.naturalHeight === 540 &&
        data.masterImg?.src === "hero-master-v13.jpg",
      JSON.stringify(data.masterImg),
    );
    push(
      "spacer-100vh",
      near(data.spacer.rect.height, vh, 2) &&
        data.spacer.style.backgroundColor === "rgba(0, 0, 0, 0)",
      `h=${data.spacer.rect.height} bg=${data.spacer.style.backgroundColor}`,
    );
    push(
      "chat-opaque-follows-spacer",
      near(data.gapSpacerChat, 0, 1.5) &&
        data.chat.style.backgroundColor.includes("247"),
      `gap=${data.gapSpacerChat} bg=${data.chat.style.backgroundColor}`,
    );
    push(
      "mobile-hero-hidden",
      data.mobileHero.style.display === "none",
      data.mobileHero.style.display,
    );
    if (afterScroll) {
      push(
        "scroll-master-fixed",
        afterScroll.masterPos === "fixed" &&
          near(afterScroll.master.top, 0, 1.5),
        JSON.stringify(afterScroll.master),
      );
      push(
        "scroll-chat-moves",
        afterScroll.chat.top < vh - 100 && afterScroll.spacer.top < -400,
        JSON.stringify({
          spacerTop: afterScroll.spacer.top,
          chatTop: afterScroll.chat.top,
        }),
      );
    }
  } else {
    push(
      "master-hidden",
      data.master.style.display === "none",
      data.master.style.display,
    );
    push(
      "spacer-hidden",
      data.spacer.style.display === "none" || data.spacer.rect.height < 1,
      `display=${data.spacer.style.display} h=${data.spacer.rect?.height}`,
    );
    push(
      "mobile-hero-chat",
      data.mobileHero.style.display !== "none" &&
        near(data.gapMobileHeroChat ?? 99, 0, 1.5) &&
        data.chat.style.marginTop === "0px" &&
        data.chat.style.paddingTop === "0px" &&
        (data.chat.style.transform === "none" ||
          data.chat.style.transform === "matrix(1, 0, 0, 1, 0, 0)"),
      `gap=${data.gapMobileHeroChat} mt=${data.chat.style.marginTop} pt=${data.chat.style.paddingTop} tf=${data.chat.style.transform}`,
    );
  }

  return {
    viewport: { w: vw, h: vh },
    shot,
    data,
    afterScroll,
    checks,
    pass: checks.every((c) => c.ok),
  };
}

const timer = setTimeout(() => {
  console.error("HARD TIMEOUT exceeded");
  process.exit(2);
}, HARD_TIMEOUT_MS);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
let allPass = true;
try {
  for (const { w, h } of VIEWPORTS) {
    const r = await measure(page, w, h);
    results.push(r);
    allPass = allPass && r.pass;
    console.log(`\n=== ${w}x${h} ${r.pass ? "PASS" : "FAIL"} ===`);
    for (const c of r.checks) {
      console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
    }
  }
} finally {
  await browser.close().catch(() => {});
  clearTimeout(timer);
}
fs.writeFileSync(path.join(OUT, "v14-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", allPass ? "PASS" : "FAIL");
process.exit(allPass ? 0 : 1);
