import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/v15-layout-qa";
const URL = "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 1324, h: 921 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

fs.mkdirSync(OUT, { recursive: true });

function near(a, b, tol = 1.5) {
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

async function measure(page, vw, vh) {
  await page.setViewportSize({ width: vw, height: vh });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  const data = await page.evaluate(() => {
    const center = document.querySelector(".center-column");
    const hero = document.querySelector(".interactive-hero");
    const chat = document.querySelector(".chat-stream");
    const left = document.querySelector(".side-left");
    const right = document.querySelector(".side-right");
    const leftVisual = left?.querySelector(".crt-frame");
    const rightVisual = right?.querySelector(".crt-frame");
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
    const contains = (outer, inner) => {
      if (!outer || !inner) return false;
      return (
        inner.left >= outer.left - 0.5 &&
        inner.right <= outer.right + 0.5 &&
        inner.top >= outer.top - 0.5 &&
        inner.bottom <= outer.bottom + 0.5
      );
    };
    const lr = r(left);
    const rr = r(right);
    const cr = r(center);
    const hr = r(hero);
    const chr = r(chat);
    const lv = r(leftVisual);
    const rv = r(rightVisual);
    return {
      center: cr,
      hero: { ...hr, position: getComputedStyle(hero).position },
      chat: chr,
      gap: hr && chr ? chr.top - hr.bottom : null,
      left: {
        ...lr,
        position: getComputedStyle(left).position,
        bg: getComputedStyle(left).backgroundColor,
      },
      right: {
        ...rr,
        position: getComputedStyle(right).position,
        bg: getComputedStyle(right).backgroundColor,
      },
      leftVisualInBounds: contains(lr, lv),
      rightVisualInBounds: contains(rr, rv),
      leftVisual: lv,
      rightVisual: rv,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      overlapLeftCenter: lr && cr ? lr.right - cr.left : null,
      overlapRightCenter: rr && cr ? cr.right - rr.left : null,
      equalSides: lr && rr ? Math.abs(lr.width - rr.width) < 1 : false,
    };
  });

  const shot = path.join(OUT, `layout-${vw}x${vh}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const expectSide = (vw - 414) / 2;
  const expectCenterX = expectSide;
  const checks = [];
  const push = (n, ok, d) => checks.push({ name: n, ok, detail: d });

  push(
    "center",
    near(data.center.width, 414, 1) && near(data.center.x, expectCenterX, 2),
    `x=${data.center.x} w=${data.center.width} expectX=${expectCenterX}`,
  );
  push(
    "left",
    near(data.left.width, expectSide, 2) &&
      near(data.left.x, 0, 1) &&
      data.left.position === "fixed",
    `x=${data.left.x} w=${data.left.width} expectW=${expectSide}`,
  );
  push(
    "right",
    near(data.right.width, expectSide, 2) &&
      near(data.right.x, expectCenterX + 414, 2) &&
      data.right.position === "fixed",
    `x=${data.right.x} w=${data.right.width} expectW=${expectSide}`,
  );
  push("equal-sides", data.equalSides, `L=${data.left.width} R=${data.right.width}`);
  push(
    "no-overlap",
    Math.abs(data.overlapLeftCenter) <= 1.5 &&
      Math.abs(data.overlapRightCenter) <= 1.5,
    `Lseam=${data.overlapLeftCenter} Rseam=${data.overlapRightCenter}`,
  );
  push("left-visual-in", data.leftVisualInBounds, JSON.stringify(data.leftVisual));
  push("right-visual-in", data.rightVisualInBounds, JSON.stringify(data.rightVisual));
  push("gap0", near(data.gap ?? 99, 0, 1.5), String(data.gap));
  push(
    "hero-flow",
    data.hero.position === "relative" || data.hero.position === "static",
    data.hero.position,
  );
  push(
    "blue-match",
    data.left.bg === data.bodyBg && data.right.bg === data.bodyBg,
    `body=${data.bodyBg} L=${data.left.bg} R=${data.right.bg}`,
  );

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
fs.writeFileSync(path.join(OUT, "layout-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", all ? "PASS" : "FAIL");
process.exit(all ? 0 : 1);
