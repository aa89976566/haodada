/**
 * Keyboard, reduced-motion, ENTER, and first-party analytics contract QA.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/interaction-qa";
const SITE = process.env.QA_URL || "http://127.0.0.1:4173/";

fs.mkdirSync(OUT, { recursive: true });

function push(checks, name, ok, detail) {
  checks.push({ name, ok, detail });
  console.log(`  ${ok ? "✓" : "✗"} ${name}: ${detail}`);
}

async function measureNetwork(page) {
  const images = [];
  page.on("response", (res) => {
    const url = res.url();
    if (/\.(png|jpe?g|webp|avif|gif|mp4)(\?|$)/i.test(url)) {
      images.push({
        url,
        status: res.status(),
        bytes: Number(res.headers()["content-length"] || 0),
      });
    }
  });
  return images;
}

const browser = await chromium.launch({ headless: true });
const checks = [];
let pass = true;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const images = await measureNetwork(page);
  await page.goto(SITE, { waitUntil: "domcontentloaded", timeout: 45000 });

  const enter = page.locator("#SitePreloader button.enter");
  push(checks, "enter-visible", await enter.isVisible(), "preloader ENTER");

  await enter.focus();
  const enterOutline = await enter.evaluate((el) => {
    const s = getComputedStyle(el);
    return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
  });
  push(
    checks,
    "enter-focus-visible",
    /solid/.test(enterOutline) && !/0px/.test(enterOutline),
    enterOutline,
  );

  await page.keyboard.press("Enter");
  await page.waitForTimeout(450);
  const preloaderGone = await page.evaluate(() => {
    const p = document.getElementById("SitePreloader");
    return !p || getComputedStyle(p).display === "none" || !p.isConnected;
  });
  push(checks, "enter-keyboard", preloaderGone, `gone=${preloaderGone}`);

  await page.screenshot({
    path: path.join(OUT, "after-enter-1440.png"),
    fullPage: false,
  });

  const hero4k = images.some((i) => /v14-4k\.png/.test(i.url));
  push(checks, "no-4k-png-request", !hero4k, hero4k ? "4K PNG requested" : "ok");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.body.classList.add("page-ready");
    const p = document.getElementById("SitePreloader");
    if (p) p.style.display = "none";
  });
  await page.waitForTimeout(400);
  const mobileAfter = await page.evaluate(() => ({
    left: !!document.querySelector(".side-left .side-poster-img"),
    right: !!document.querySelector(".side-right .side-poster-img"),
  }));
  push(
    checks,
    "mobile-no-side-nodes",
    !mobileAfter.left && !mobileAfter.right,
    JSON.stringify(mobileAfter),
  );

  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  const mobileImages = [];
  mobilePage.on("request", (req) => {
    if (/side-dog-/.test(req.url())) mobileImages.push(req.url());
  });
  await mobilePage.goto(SITE, { waitUntil: "networkidle", timeout: 45000 });
  await mobilePage.locator("#SitePreloader button.enter").click({ timeout: 3000 }).catch(() => {});
  await mobilePage.waitForTimeout(600);
  push(
    checks,
    "fresh-mobile-zero-side-requests",
    mobileImages.length === 0,
    JSON.stringify(mobileImages),
  );
  await mobilePage.close();

  const reduce = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await reduce.goto(SITE, { waitUntil: "networkidle", timeout: 45000 });
  await reduce.locator("#SitePreloader button.enter").click({ timeout: 3000 }).catch(() => {});
  await reduce.waitForTimeout(500);
  const reduceData = await reduce.evaluate(() => {
    const lab = document.querySelector(".print-lab");
    const video = document.querySelector("video.chat-product-video");
    return {
      printed: lab?.classList.contains("is-printed"),
      progress: lab ? getComputedStyle(lab).getPropertyValue("--print-progress").trim() : "",
      videoSrc: video?.getAttribute("src") || "",
      videoPaused: video ? video.paused : true,
    };
  });
  push(checks, "reduced-print-complete", !!reduceData.printed, JSON.stringify(reduceData));
  await reduce.locator("video.chat-product-video").scrollIntoViewIfNeeded();
  await reduce.waitForTimeout(800);
  const videoState = await reduce.evaluate(() => {
    const video = document.querySelector("video.chat-product-video");
    const btn = document.querySelector(".chat-video-play");
    return {
      paused: !video || video.paused,
      btnVisible: !!btn && getComputedStyle(btn).display !== "none",
    };
  });
  push(
    checks,
    "reduced-no-autoplay",
    videoState.paused,
    JSON.stringify(videoState),
  );
  await reduce.screenshot({
    path: path.join(OUT, "reduced-motion-1440.png"),
    fullPage: false,
  });
  await reduce.close();

  const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await kb.goto(SITE, { waitUntil: "networkidle", timeout: 45000 });
  await kb.locator("#SitePreloader button.enter").click({ timeout: 3000 }).catch(() => {});
  await kb.waitForTimeout(400);

  async function tabTo(selector) {
    await kb.locator(selector).scrollIntoViewIfNeeded();
    for (let i = 0; i < 50; i++) {
      await kb.keyboard.press("Tab");
      const hit = await kb.evaluate((sel) => document.activeElement?.matches(sel), selector);
      if (hit) return true;
    }
    return false;
  }

  const productTabbed = await tabTo("a.chat-preview-card");
  const productFocus = await kb.evaluate(() => {
    const el = document.activeElement;
    const s = el ? getComputedStyle(el) : null;
    return `${el?.className || ""} ${s?.outlineStyle} ${s?.outlineWidth}`;
  });
  push(
    checks,
    "product-focus-visible",
    productTabbed && /solid/.test(productFocus) && !/ 0px/.test(productFocus),
    productFocus,
  );
  const productHref = await kb.locator("a.chat-preview-card").getAttribute("href");
  const productRel = await kb.locator("a.chat-preview-card").getAttribute("rel");
  push(
    checks,
    "product-external",
    !!productHref?.includes("furmosa.com") && !!productRel?.includes("noopener"),
    `${productHref} ${productRel}`,
  );
  const lineTabbed = await tabTo("a.chat-link");
  const lineFocus = await kb.evaluate(() => {
    const el = document.activeElement;
    const s = el ? getComputedStyle(el) : null;
    return `${el?.className || ""} ${s?.outlineStyle} ${s?.outlineWidth}`;
  });
  push(
    checks,
    "line-focus-visible",
    lineTabbed && /solid/.test(lineFocus) && !/ 0px/.test(lineFocus),
    lineFocus,
  );
  const lineHref = await kb.locator("a.chat-link").getAttribute("href");
  const lineRel = await kb.locator("a.chat-link").getAttribute("rel");
  push(
    checks,
    "line-external",
    !!lineHref?.includes("line.me") && !!lineRel?.includes("noopener"),
    `${lineHref} ${lineRel}`,
  );
  await kb.evaluate(() => {
    document.body.style.zoom = "2";
  });
  await kb.waitForTimeout(200);
  const zoomOk = await kb.evaluate(() => {
    const product = document.querySelector("a.chat-preview-card");
    const line = document.querySelector("a.chat-link");
    const r = (el) => el?.getBoundingClientRect();
    const pr = r(product);
    const lr = r(line);
    return !!(pr && lr && pr.width > 40 && lr.width > 20);
  });
  push(checks, "zoom-200-controls", zoomOk, "product+LINE still measurable");
  await kb.screenshot({
    path: path.join(OUT, "zoom-200-1440.png"),
    fullPage: false,
  });
  await kb.close();

  const expected = [
    "enter_clicked",
    "print_completed",
    "product_clicked",
    "line_clicked",
    "video_played",
  ];
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/lib/analytics.ts"),
    "utf8",
  );
  push(
    checks,
    "analytics-events",
    expected.every((e) => src.includes(`"${e}"`)) && src.includes("haodadaAnalytics"),
    "source contract",
  );
} finally {
  await browser.close();
}

pass = checks.every((c) => c.ok);
fs.writeFileSync(path.join(OUT, "interaction-qa.json"), JSON.stringify(checks, null, 2));
console.log("\nALL", pass ? "PASS" : "FAIL");
process.exit(pass ? 0 : 1);
