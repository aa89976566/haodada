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

fs.mkdirSync(OUT, { recursive: true });

async function dismissPreloader(page) {
  const btn = page.locator("#SitePreloader button.enter");
  if (await btn.count()) {
    try {
      await btn.click({ timeout: 2500 });
      await page.waitForTimeout(350);
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

function near(a, b, tol = 1.5) {
  return Math.abs(a - b) <= tol;
}

async function measure(page, vw, vh) {
  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(URL, { waitUntil: "networkidle" });
  await dismissPreloader(page);
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const shell = document.querySelector(".reference-shell");
    const rail = document.querySelector(".center-rail");
    const heroWin = document.querySelector(".center-hero-window");
    const chat = document.querySelector(".mobile-messages");
    const left = document.querySelector(".master-side--left");
    const right = document.querySelector(".master-side--right");
    const imgs = [...document.querySelectorAll("img.master-crop-img")];
    const video = document.querySelector("video.chat-product-video");
    const chatEl = document.querySelector(".mobile-messages .chat");
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
        left: r.left,
        right: r.right,
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
        width: s.width,
        height: s.height,
        overflow: s.overflow,
        backgroundColor: s.backgroundColor,
      };
    }

    const imgInfo = imgs.map((img) => {
      const r = rect(img);
      const s = getComputedStyle(img);
      return {
        className: img.className,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: r?.width ?? 0,
        renderedTop: r?.top ?? null,
        renderedLeft: r?.left ?? null,
        cssWidth: s.width,
        cssTop: s.top,
        cssLeft: s.left,
        maxWidth: s.maxWidth,
        display: s.display,
        src: (img.currentSrc || img.src).split("/").pop(),
      };
    });

    return {
      cssHref,
      vw: window.innerWidth,
      vh: window.innerHeight,
      docWidth: document.documentElement.scrollWidth,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      shell: rect(shell),
      rail: rect(rail),
      heroWin: rect(heroWin),
      chat: rect(chat),
      left: { rect: rect(left), style: style(left) },
      right: { rect: rect(right), style: style(right) },
      imgs: imgInfo,
      gapHeroChat:
        heroWin && chat
          ? chat.getBoundingClientRect().top -
            heroWin.getBoundingClientRect().bottom
          : null,
      video: video
        ? {
            inChat: !!(chatEl && chatEl.contains(video)),
            autoplay: video.autoplay,
            muted: video.muted,
            loop: video.loop,
            controls: video.controls,
            paused: video.paused,
          }
        : null,
      banned: [...document.querySelectorAll(".chat .message")]
        .map((el) => (el.innerText || "").trim())
        .filter((t) => /哪裡買|line\.me|furmosa\.com|加 LINE/i.test(t)),
      hasLegacy: !!(
        document.querySelector(".master-hero-stage") ||
        document.querySelector(".chat-rail")
      ),
    };
  });

  // Scroll test on desktop
  let afterScroll = null;
  if (vw >= 1024) {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    afterScroll = await page.evaluate(() => {
      const left = document.querySelector(".master-side--left");
      const right = document.querySelector(".master-side--right");
      const heroWin = document.querySelector(".center-hero-window");
      const chat = document.querySelector(".mobile-messages");
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: b.top, y: b.y, x: b.x, width: b.width };
      };
      return {
        scrollY: window.scrollY,
        left: r(left),
        right: r(right),
        heroWin: r(heroWin),
        chat: r(chat),
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
  }

  const shot = path.join(OUT, `v14-${vw}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  // Assertions summary
  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });

  push("css-v14", data.cssHref.includes("haodada-site-v14"), data.cssHref);
  push("no-legacy", !data.hasLegacy, String(data.hasLegacy));
  push("no-overflow", !data.overflowX, `docW=${data.docWidth} vw=${data.vw}`);
  push(
    "banned-hard-sell",
    data.banned.length === 0,
    JSON.stringify(data.banned),
  );
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
    const expectedSide = (vw - 414) / 2;
    const expectedCenterX = expectedSide;
    push(
      "center-x",
      near(data.rail.x, expectedCenterX, 2),
      `got ${data.rail.x} expect ${expectedCenterX}`,
    );
    push("center-w", near(data.rail.width, 414, 1), `got ${data.rail.width}`);
    push(
      "left-w",
      near(data.left.rect.width, expectedSide, 2) &&
        data.left.style.position === "fixed",
      `w=${data.left.rect?.width} pos=${data.left.style?.position}`,
    );
    push(
      "right-x",
      near(data.right.rect.x, expectedCenterX + 414, 2) &&
        near(data.right.rect.width, expectedSide, 2) &&
        data.right.style.position === "fixed",
      `x=${data.right.rect?.x} w=${data.right.rect?.width}`,
    );
    push(
      "hero-top0",
      near(data.heroWin.top, 0, 1.5),
      `top=${data.heroWin.top}`,
    );
    push(
      "chat-follows-hero",
      near(data.gapHeroChat, 0, 1.5),
      `gap=${data.gapHeroChat}`,
    );

    const visibleMaster = data.imgs.filter(
      (i) => i.display !== "none" && i.renderedWidth > 10,
    );
    push(
      "three-master-imgs",
      visibleMaster.length === 3 &&
        visibleMaster.every(
          (i) =>
            i.naturalWidth === 960 &&
            i.naturalHeight === 540 &&
            near(i.renderedWidth, vw, 2) &&
            near(i.renderedTop, 0, 1.5),
        ),
      JSON.stringify(
        visibleMaster.map((i) => ({
          n: [i.naturalWidth, i.naturalHeight],
          w: i.renderedWidth,
          top: i.renderedTop,
          left: i.renderedLeft,
          src: i.src,
        })),
      ),
    );

    // Seam check: left panel right edge == center left; center right == right panel left
    const seamL = Math.abs(
      data.left.rect.right - data.heroWin.left,
    );
    const seamR = Math.abs(data.heroWin.right - data.right.rect.left);
    push(
      "crop-seams",
      seamL <= 1.5 && seamR <= 1.5,
      `seamL=${seamL} seamR=${seamR}`,
    );

    if (afterScroll) {
      push(
        "scroll-sides-fixed",
        near(afterScroll.left.top, 0, 1.5) &&
          near(afterScroll.right.top, 0, 1.5),
        JSON.stringify({
          leftTop: afterScroll.left.top,
          rightTop: afterScroll.right.top,
        }),
      );
      push(
        "scroll-center-moves",
        afterScroll.heroWin.top < -400 && afterScroll.heroWin.top > -600,
        `heroTop=${afterScroll.heroWin.top} chatTop=${afterScroll.chat.top}`,
      );
    }
  } else {
    push(
      "sides-hidden",
      data.left.style.display === "none" &&
        data.right.style.display === "none",
      `L=${data.left.style?.display} R=${data.right.style?.display}`,
    );
    push(
      "chat-follows-hero",
      near(data.gapHeroChat, 0, 1.5),
      `gap=${data.gapHeroChat}`,
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

const browser = await chromium.launch({
  headless: true,
  channel: undefined,
});
const page = await browser.newPage();
const results = [];
let allPass = true;
for (const { w, h } of VIEWPORTS) {
  const r = await measure(page, w, h);
  results.push(r);
  allPass = allPass && r.pass;
  console.log(`\n=== ${w}x${h} ${r.pass ? "PASS" : "FAIL"} ===`);
  for (const c of r.checks) {
    console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
  }
  console.log(
    "  rects",
    JSON.stringify({
      left: r.data.left.rect,
      rail: r.data.rail,
      hero: r.data.heroWin,
      chat: r.data.chat,
      right: r.data.right.rect,
      gap: r.data.gapHeroChat,
    }),
  );
}
await browser.close();
fs.writeFileSync(path.join(OUT, "v14-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", allPass ? "PASS" : "FAIL");
console.log("Wrote", path.join(OUT, "v14-qa.json"));
process.exit(allPass ? 0 : 1);
