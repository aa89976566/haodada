/**
 * Production hardening QA.
 * Obsolete (kept, not deleted): qa-v15.mjs, qa-v15-regression.mjs,
 * qa-layout-columns.mjs — they query .interactive-hero / .hero-product
 * which left the tree when print-lab replaced the old hero.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/prod-qa";
const URL = process.env.QA_URL || "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
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
      await page.waitForTimeout(250);
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
  const clientErrors = [];
  const failed = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") clientErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    failed.push(`${req.failure()?.errorText || "fail"} ${req.url()}`);
  });

  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
  await dismiss(page);
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const noneish = (v) => !v || v === "none" || v === "";
    const leftImg = document.querySelector(".side-left .side-poster-img");
    const rightImg = document.querySelector(".side-right .side-poster-img");
    const hero = document.querySelector(".print-lab-machine");
    const receipt = document.querySelector(".print-paper-receipt");
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    let jsonOk = false;
    try {
      jsonOk = !!jsonLd && !!JSON.parse(jsonLd.textContent || "");
    } catch {
      jsonOk = false;
    }
    const canon = document.querySelector('link[rel="canonical"]')?.href || "";
    const s = (el) => (el ? getComputedStyle(el) : null);
    const leftStyle = s(leftImg);
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      leftSrc: leftImg?.currentSrc || leftImg?.src || "",
      rightSrc: rightImg?.currentSrc || rightImg?.src || "",
      heroSrc: hero?.currentSrc || hero?.src || "",
      receiptSrc: receipt?.currentSrc || receipt?.src || "",
      heroPriority: hero?.getAttribute("fetchpriority"),
      sidePriority: leftImg?.getAttribute("fetchpriority"),
      mask: leftStyle?.maskImage,
      clip: leftStyle?.clipPath,
      opacity: leftStyle?.opacity,
      sidesDisplay: {
        L: s(document.querySelector(".side-left"))?.display,
        R: s(document.querySelector(".side-right"))?.display,
      },
      centerW: document.querySelector(".center-column")?.getBoundingClientRect().width,
      jsonOk,
      canon,
      printLab: !!document.querySelector(".print-lab"),
      chat: !!document.querySelector(".chat-stream"),
      lineRel: [...document.querySelectorAll('a[href*="line.me"]')].every(
        (a) => (a.getAttribute("rel") || "").includes("noopener"),
      ),
    };
  });

  const shot = path.join(OUT, `prod-${vw}x${vh}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const checks = [];
  const push = (name, ok, detail) => checks.push({ name, ok, detail });
  push("no-overflow-x", !data.overflowX, String(data.overflowX));
  push("print-lab", data.printLab, String(data.printLab));
  push("chat", data.chat, String(data.chat));
  push("json-ld", data.jsonOk, String(data.jsonOk));
  push("canonical-clean", data.canon.includes("haodada") && !data.canon.includes("?"), data.canon);
  push("line-noopener", data.lineRel, String(data.lineRel));
  push("hero-high", data.heroPriority === "high", data.heroPriority);
  push(
    "hero-not-raw-4k",
    !/hero-factory-printer-front-v14-4k\.png$/.test(data.heroSrc.split("?")[0]),
    data.heroSrc,
  );

  if (vw <= 768) {
    push(
      "mobile-no-side-img",
      !data.leftSrc && !data.rightSrc,
      `L=${data.leftSrc} R=${data.rightSrc}`,
    );
    push(
      "mobile-sides-hidden",
      data.sidesDisplay.L === "none" && data.sidesDisplay.R === "none",
      JSON.stringify(data.sidesDisplay),
    );
    push("mobile-center-full", near(data.centerW, vw, 2), `w=${data.centerW}`);
  } else {
    push("desktop-sides", !!data.leftSrc && !!data.rightSrc, `${data.leftSrc} | ${data.rightSrc}`);
    push("side-low-priority", data.sidePriority === "low", data.sidePriority);
    push(
      "no-fade",
      data.opacity === "1" &&
        (data.mask === "none" || !data.mask) &&
        (data.clip === "none" || !data.clip),
      `${data.mask}/${data.clip}/${data.opacity}`,
    );
    push("center-414", near(data.centerW, 414, 2), `w=${data.centerW}`);
  }

  const serious = clientErrors.filter(
    (t) => !t.includes("favicon") && !t.includes("net::ERR_BLOCKED"),
  );
  push("console-clean", serious.length === 0, JSON.stringify(serious));
  push("requests-ok", failed.length === 0, JSON.stringify(failed));

  return {
    viewport: { w: vw, h: vh },
    shot,
    data,
    checks,
    pass: checks.every((c) => c.ok),
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
let all = true;
try {
  for (const { w, h } of VIEWPORTS) {
    const r = await measure(page, w, h);
    results.push(r);
    all = all && r.pass;
    console.log(`\n=== ${w}x${h} ${r.pass ? "PASS" : "FAIL"} ===`);
    for (const c of r.checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(OUT, "prod-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", all ? "PASS" : "FAIL");
process.exit(all ? 0 : 1);
