import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/side-poster-qa";
const URL = process.env.QA_URL || "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 390, h: 844 },
  { w: 1024, h: 768 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
  { w: 2560, h: 1440 },
];

fs.mkdirSync(OUT, { recursive: true });

function near(a, b, tol = 2) {
  return Math.abs(a - b) <= tol;
}

async function dismiss(page) {
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
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const data = await page.evaluate(() => {
    const noneish = (v) =>
      !v || v === "none" || v === "unset" || v === "initial" || v === "";
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: b.x,
        y: b.y,
        top: b.top,
        right: b.right,
        bottom: b.bottom,
        left: b.left,
        width: b.width,
        height: b.height,
      };
    };
    const contains = (outer, inner, pad = 0.75) => {
      if (!outer || !inner) return false;
      return (
        inner.left >= outer.left - pad &&
        inner.right <= outer.right + pad &&
        inner.top >= outer.top - pad &&
        inner.bottom <= outer.bottom + pad
      );
    };
    const posterAudit = (img) => {
      if (!img) return null;
      const s = getComputedStyle(img);
      return {
        src: (img.currentSrc || img.src || "").split("/").pop(),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        rect: r(img),
        objectFit: s.objectFit,
        opacity: s.opacity,
        filter: s.filter,
        clipPath: s.clipPath,
        maskImage: s.maskImage,
        webkitMaskImage: s.webkitMaskImage,
        maskComposite: s.maskComposite,
        overflow: s.overflow,
        maxHeight: s.maxHeight,
        aspectRatio: s.aspectRatio,
      };
    };
    const left = document.querySelector(".side-left");
    const right = document.querySelector(".side-right");
    const center = document.querySelector(".center-column");
    const printLab = document.querySelector(".print-lab");
    const chat = document.querySelector(".chat-stream");
    const leftImg = document.querySelector(".side-left .side-poster-img");
    const rightImg = document.querySelector(".side-right .side-poster-img");
    const copyFix = document.querySelector(".side-copy-fix");
    const text = document.body.innerText || "";
    return {
      left: { display: left ? getComputedStyle(left).display : "missing", rect: r(left) },
      right: { display: right ? getComputedStyle(right).display : "missing", rect: r(right) },
      center: r(center),
      printLab: !!printLab,
      chat: !!chat,
      leftPoster: posterAudit(leftImg),
      rightPoster: posterAudit(rightImg),
      copyFixDisplay: copyFix ? getComputedStyle(copyFix).display : "absent",
      duplicateCopy:
        (text.match(/毛孩吃得單純安心/g) || []).length > 1 ||
        (text.match(/純雞情/g) || []).length > 1,
      cssHref:
        [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map((l) => l.href)
          .find((h) => h.includes("haodada-site")) || "",
      leftInPanel: contains(r(left), r(leftImg)),
      rightInPanel: contains(r(right), r(rightImg)),
    };
  });

  const shot = path.join(OUT, `side-${vw}x${vh}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });

  if (vw <= 768) {
    push(
      "mobile-sides-hidden",
      data.left.display === "none" && data.right.display === "none",
      `L=${data.left.display} R=${data.right.display}`,
    );
    push(
      "mobile-center-full",
      near(data.center.width, vw, 2),
      `w=${data.center.width}`,
    );
  } else {
    const noFade = (p) =>
      p &&
      p.opacity === "1" &&
      (p.filter === "none" || p.filter === "") &&
      (p.clipPath === "none" || p.clipPath === "") &&
      (p.maskImage === "none" || p.maskImage === "") &&
      (p.webkitMaskImage === "none" || p.webkitMaskImage === "");
    push("left-no-fade", noFade(data.leftPoster), JSON.stringify(data.leftPoster));
    push("right-no-fade", noFade(data.rightPoster), JSON.stringify(data.rightPoster));
    push(
      "left-ibm-asset",
      !!data.leftPoster?.src?.includes("side-dog-left-v3"),
      data.leftPoster?.src,
    );
    push(
      "right-ibm-asset",
      !!data.rightPoster?.src?.includes("side-dog-right-v3"),
      data.rightPoster?.src,
    );
    push(
      "contain",
      data.leftPoster?.objectFit === "contain" &&
        data.rightPoster?.objectFit === "contain",
      `${data.leftPoster?.objectFit}/${data.rightPoster?.objectFit}`,
    );
    push("left-in-viewport", data.leftInPanel, JSON.stringify(data.leftPoster?.rect));
    push("right-in-viewport", data.rightInPanel, JSON.stringify(data.rightPoster?.rect));
    push(
      "copy-fix-off",
      data.copyFixDisplay === "none" || data.copyFixDisplay === "absent",
      data.copyFixDisplay,
    );
    push("no-duplicate-copy", !data.duplicateCopy, String(data.duplicateCopy));
    push(
      "center-414",
      near(data.center.width, 414, 2),
      `w=${data.center.width}`,
    );
    push(
      "posters-loaded",
      (data.leftPoster?.naturalWidth || 0) >= 300 &&
        (data.rightPoster?.naturalWidth || 0) >= 300,
      `L=${data.leftPoster?.naturalWidth} R=${data.rightPoster?.naturalWidth}`,
    );
  }
  push("print-lab", data.printLab, String(data.printLab));
  push("chat", data.chat, String(data.chat));
  push("css-v15", data.cssHref.includes("haodada-site-v15"), data.cssHref);

  return { viewport: { w: vw, h: vh }, shot, data, checks, pass: checks.every((c) => c.ok) };
}

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
    for (const c of r.checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(OUT, "side-poster-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", allPass ? "PASS" : "FAIL");
process.exit(allPass ? 0 : 1);
