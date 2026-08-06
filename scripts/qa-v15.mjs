import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/v15-qa";
const URL = "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1324, h: 921 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];
const HARD_TIMEOUT_MS = 120_000;

fs.mkdirSync(OUT, { recursive: true });

function near(a, b, tol = 2) {
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

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const data = await page.evaluate(() => {
    const shell = document.querySelector(".experience-shell");
    const left = document.querySelector(".side-left");
    const right = document.querySelector(".side-right");
    const center = document.querySelector(".center-column");
    const hero = document.querySelector(".interactive-hero");
    const chat = document.querySelector(".chat-stream");
    const product = document.querySelector(".hero-product");
    const video = document.querySelector("video.chat-product-video");
    const cssHref =
      [...document.querySelectorAll('link[rel="stylesheet"]')]
        .map((l) => l.href)
        .find((h) => h.includes("haodada-site")) || "";

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const style = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        position: s.position,
        display: s.display,
        overflow: s.overflow,
        overflowY: s.overflowY,
        height: s.height,
        top: s.top,
      };
    };

    const htmlOverflow = getComputedStyle(document.documentElement).overflowY;
    const bodyOverflow = getComputedStyle(document.body).overflowY;
    const banned = [];
    const text = document.body.innerText || "";
    for (const w of ["哪裡買", "LINE 加入", "line.me", "furmosa.com/products"]) {
      if (text.includes(w)) banned.push(w);
    }

    const hr = rect(hero);
    const cr = rect(chat);
    const gap = hr && cr ? cr.top - hr.bottom : 99;

    let productAudit = null;
    if (product) {
      const r = product.getBoundingClientRect();
      productAudit = {
        naturalWidth: product.naturalWidth,
        naturalHeight: product.naturalHeight,
        renderedWidth: r.width,
        ok:
          product.naturalWidth >= r.width * 2 - 1 ||
          r.width <= product.naturalWidth + 0.5,
      };
    }

    return {
      cssHref,
      hasLegacy:
        !!document.querySelector(".desktop-master") ||
        !!document.querySelector(".master-hero-stage") ||
        !!document.querySelector(".reference-shell"),
      shell: !!shell,
      left: { style: style(left), rect: rect(left) },
      right: { style: style(right), rect: rect(right) },
      center: { style: style(center), rect: rect(center) },
      hero: { style: style(hero), rect: hr },
      chat: { style: style(chat), rect: cr },
      gap,
      productAudit,
      banned,
      scroll: {
        htmlOverflow,
        bodyOverflow,
        docScrollHeight: document.documentElement.scrollHeight,
        bodyScrollHeight: document.body.scrollHeight,
        scrollingElement: document.scrollingElement === document.documentElement ? "html" : document.scrollingElement === document.body ? "body" : "other",
      },
      video: video
        ? {
            inChat: !!video.closest(".chat-stream"),
            autoplay: video.hasAttribute("autoplay"),
            muted: video.muted || video.hasAttribute("muted"),
            loop: video.hasAttribute("loop"),
            controls: video.hasAttribute("controls"),
          }
        : null,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  let afterScroll = null;
  if (vw >= 769) {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    afterScroll = await page.evaluate(() => {
      const left = document.querySelector(".side-left");
      const right = document.querySelector(".side-right");
      const hero = document.querySelector(".interactive-hero");
      const chat = document.querySelector(".chat-stream");
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: b.top, height: b.height, width: b.width };
      };
      return {
        left: { pos: getComputedStyle(left).position, ...r(left) },
        right: { pos: getComputedStyle(right).position, ...r(right) },
        hero: r(hero),
        chat: r(chat),
        scrollY: window.scrollY,
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // reduced-motion smoke on 1324
  let reducedMotionOk = true;
  if (vw === 1324) {
    const ctx = await page.context().browser().newContext({
      reducedMotion: "reduce",
      viewport: { width: vw, height: vh },
    });
    const client = await ctx.newPage();
    await client.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });
    await dismissPreloader(client);
    await client.waitForTimeout(300);
    reducedMotionOk = await client.evaluate(() => {
      const float = document.querySelector(".hero-product-float");
      const hand = document.querySelector(".hero-hand");
      const fs = float ? getComputedStyle(float).animationName : "none";
      const hs = hand ? getComputedStyle(hand).animationName : "none";
      return (fs === "none" || fs === "") && (hs === "none" || hs === "");
    });
    await ctx.close();
  }

  const shot = path.join(OUT, `v15-${vw}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });

  push("css-v15", data.cssHref.includes("haodada-site-v15"), data.cssHref);
  push("no-legacy-composite", !data.hasLegacy, String(data.hasLegacy));
  push("shell", data.shell, String(data.shell));
  push("banned", data.banned.length === 0, JSON.stringify(data.banned));
  push("no-overflow-x", !data.overflowX, String(data.overflowX));
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
  push(
    "hero-chat-gap",
    near(data.gap, 0, 2),
    `gap=${data.gap}`,
  );
  push(
    "product-2x-or-no-upscale",
    !!data.productAudit?.ok,
    JSON.stringify(data.productAudit),
  );
  push(
    "body-scroll",
    data.scroll.bodyOverflow === "auto" ||
      data.scroll.bodyOverflow === "scroll" ||
      data.scroll.scrollingElement === "html" ||
      data.scroll.scrollingElement === "body",
    JSON.stringify(data.scroll),
  );
  // center column must not be an independent scrollport
  push(
    "center-no-scrollport",
    data.center.style.overflow === "visible" ||
      data.center.style.overflow === "hidden" ||
      data.center.style.overflowY === "visible",
    JSON.stringify(data.center.style),
  );

  if (vw <= 768) {
    push(
      "sides-hidden",
      data.left.style.display === "none" && data.right.style.display === "none",
      `L=${data.left.style.display} R=${data.right.style.display}`,
    );
    push(
      "center-full",
      near(data.center.rect.width, vw, 2),
      `w=${data.center.rect.width}`,
    );
  } else {
    push(
      "center-414",
      near(data.center.rect.width, 414, 2),
      `w=${data.center.rect.width} x=${data.center.rect.x}`,
    );
    push(
      "sides-fixed",
      data.left.style.position === "fixed" &&
        data.right.style.position === "fixed" &&
        near(data.left.rect.top, 0, 2) &&
        near(data.right.rect.top, 0, 2),
      JSON.stringify({ left: data.left, right: data.right }),
    );
    if (afterScroll) {
      push(
        "scroll-sides-fixed",
        afterScroll.left.pos === "fixed" &&
          afterScroll.right.pos === "fixed" &&
          near(afterScroll.left.top, 0, 2) &&
          near(afterScroll.right.top, 0, 2),
        JSON.stringify({ left: afterScroll.left, right: afterScroll.right }),
      );
      push(
        "scroll-hero-leaves",
        near(afterScroll.hero.top, -500, 8),
        `heroTop=${afterScroll.hero.top}`,
      );
      const expectChat = afterScroll.hero.height - 500;
      push(
        "scroll-chat-follows",
        near(afterScroll.chat.top, expectChat, 10),
        `chatTop=${afterScroll.chat.top} expect≈${expectChat}`,
      );
    }
    if (vw === 1324) {
      push("reduced-motion", reducedMotionOk, String(reducedMotionOk));
    }
    // dogs fully visible — side panel contains CRT within bounds
    if (vw >= 1440) {
      push(
        "side-panel-tall",
        near(data.left.rect.height, vh, 2) && near(data.right.rect.height, vh, 2),
        `Lh=${data.left.rect.height} Rh=${data.right.rect.height}`,
      );
    }
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
  console.error("HARD TIMEOUT");
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
fs.writeFileSync(path.join(OUT, "v15-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", allPass ? "PASS" : "FAIL");
process.exit(allPass ? 0 : 1);
