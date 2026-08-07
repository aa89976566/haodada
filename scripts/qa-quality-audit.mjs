import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/v15-quality-qa";
const URL = "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 1324, h: 921, label: "1324x921" },
  { w: 1920, h: 1080, label: "1920x1080" },
];

fs.mkdirSync(OUT, { recursive: true });

function parseScale(transform) {
  if (!transform || transform === "none") return 1;
  const m = transform.match(/matrix\(([^)]+)\)/);
  if (m) return Math.abs(parseFloat(m[1].split(",")[0]));
  const s = transform.match(/scale\(([^)]+)\)/);
  if (s) return Math.abs(parseFloat(s[1].split(",")[0]));
  return 1;
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
  await page.waitForTimeout(500);
}

async function audit(page, vw, vh, label) {
  await page.setViewportSize({ width: vw, height: vh, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const rows = await page.evaluate(() => {
    return [...document.querySelectorAll("img")].map((img) => {
      const s = getComputedStyle(img);
      const r = img.getBoundingClientRect();
      let el = img;
      let scale = 1;
      let transformChain = [];
      while (el && el !== document.body) {
        const t = getComputedStyle(el).transform;
        if (t && t !== "none") {
          transformChain.push({ tag: el.className || el.tagName, t });
          const m = t.match(/matrix\(([^)]+)\)/);
          if (m) scale *= Math.abs(parseFloat(m[1].split(",")[0]));
        }
        el = el.parentElement;
      }
      const src = (img.currentSrc || img.src || "").split("/").slice(-2).join("/");
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const rw = r.width;
      const rh = r.height;
      const ratio = rw > 0 ? nw / rw : Infinity;
      return {
        src,
        className: img.className,
        naturalWidth: nw,
        naturalHeight: nh,
        renderedWidth: Math.round(rw * 1000) / 1000,
        renderedHeight: Math.round(rh * 1000) / 1000,
        objectFit: s.objectFit,
        objectPosition: s.objectPosition,
        imageRendering: s.imageRendering,
        filter: s.filter,
        transform: s.transform,
        ancestorScale: Math.round(scale * 1000) / 1000,
        transformChain,
        dpr2Ratio: Math.round(ratio * 1000) / 1000,
        upscaled: ratio < 2 - 0.01,
        attrWidth: img.getAttribute("width"),
        attrHeight: img.getAttribute("height"),
        decoding: img.getAttribute("decoding"),
        srcset: img.getAttribute("srcset"),
      };
    });
  });

  const shot = path.join(OUT, `quality-${label}@2x.png`);
  await page.screenshot({ path: shot, fullPage: false });

  console.log(`\n======== ${label} @ DPR2 ========`);
  for (const row of rows) {
    const flag = row.upscaled ? "UPSCALED" : "ok";
    console.log(
      `[${flag}] ${row.src} class=${row.className} natural=${row.naturalWidth}x${row.naturalHeight} rendered=${row.renderedWidth}x${row.renderedHeight} fit=${row.objectFit} scale=${row.ancestorScale} ratio=${row.dpr2Ratio}`,
    );
  }
  return { label, shot, rows };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
try {
  for (const { w, h, label } of VIEWPORTS) {
    results.push(await audit(page, w, h, label));
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(OUT, "quality-audit-after.json"), JSON.stringify(results, null, 2));
const up = results.flatMap((r) =>
  r.rows.filter((x) => x.upscaled).map((x) => ({ viewport: r.label, ...x })),
);
console.log("\n===== UPSCALED SUMMARY =====");
console.log(JSON.stringify(up, null, 2));
const fail = up.length > 0;
console.log(fail ? "HAS UPSCALED" : "ALL DPR2 OK");
process.exit(fail ? 1 : 0);
