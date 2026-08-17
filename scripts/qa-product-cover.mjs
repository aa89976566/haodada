/**
 * Product-card cover QA: single real packaging photo, no collage crop.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/product-cover-qa";
const SITE = process.env.QA_URL || "http://127.0.0.1:4173/";
const VIEWPORTS = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1440, h: 900 },
];

fs.mkdirSync(OUT, { recursive: true });

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

const browser = await chromium.launch({ headless: true });
const results = [];
let all = true;

try {
  for (const { w, h } of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const failed = [];
    const errors = [];
    page.on("requestfailed", (req) => {
      failed.push(`${req.failure()?.errorText || "fail"} ${req.url()}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(SITE, { waitUntil: "networkidle", timeout: 45000 });
    await dismiss(page);
    const card = page.locator("a.chat-preview-card");
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const img = document.querySelector(".chat-preview-image");
      const card = document.querySelector("a.chat-preview-card");
      if (!img || !card) return { missing: true };
      const s = getComputedStyle(img);
      const r = img.getBoundingClientRect();
      const ratio = r.height ? r.width / r.height : 0;
      const native = 1022 / 1602;
      return {
        src: img.currentSrc || img.src || "",
        alt: img.getAttribute("alt") || "",
        wAttr: img.getAttribute("width"),
        hAttr: img.getAttribute("height"),
        objectFit: s.objectFit,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        ratio,
        native,
        displayW: r.width,
        displayH: r.height,
        naturalW: img.naturalWidth,
        title: card.querySelector("strong")?.textContent || "",
        domain: card.querySelector(".chat-preview-domain span")?.textContent || "",
        href: card.getAttribute("href") || "",
        rel: card.getAttribute("rel") || "",
      };
    });

    const shot = path.join(OUT, `cover-${w}x${h}.png`);
    await card.screenshot({ path: shot });
    await page.screenshot({
      path: path.join(OUT, `page-${w}x${h}.png`),
      fullPage: false,
    });

    const checks = [];
    const push = (name, ok, detail) => checks.push({ name, ok, detail });
    push("card-present", !data.missing, JSON.stringify(data));
    push(
      "cover-product-reference",
      /product-reference\.jpeg/.test(data.src || "") &&
        !/hero-furmosa-real-package/.test(data.src || ""),
      data.src,
    );
    push(
      "cover-not-collage",
      !/hero-furmosa|side-chicken|side-dog/.test(data.src || ""),
      data.src,
    );
    push("object-fit-contain", data.objectFit === "contain", data.objectFit);
    push("attrs-1022x1602", data.wAttr === "1022" && data.hAttr === "1602", `${data.wAttr}x${data.hAttr}`);
    push(
      "ratio-stable",
      Math.abs((data.ratio || 0) - (data.native || 0)) < 0.04,
      `display=${data.ratio} native=${data.native}`,
    );
    push("decoded", (data.naturalW || 0) >= 1000, String(data.naturalW));
    push("no-overflow-x", !data.overflowX, String(data.overflowX));
    push("title-kept", data.title.includes("嚎大大雞霸"), data.title);
    push("domain-kept", data.domain.includes("furmosa.com"), data.domain);
    push(
      "link-kept",
      data.href.includes("furmosa.com") && data.rel.includes("noopener"),
      `${data.href} ${data.rel}`,
    );
    push(
      "console-clean",
      errors.filter((t) => !t.includes("favicon")).length === 0,
      JSON.stringify(errors),
    );
    push("requests-ok", failed.length === 0, JSON.stringify(failed));

    const pass = checks.every((c) => c.ok);
    all = all && pass;
    results.push({ viewport: { w, h }, shot, data, checks, pass });
    console.log(`\n=== ${w}x${h} ${pass ? "PASS" : "FAIL"} ===`);
    for (const c of checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
    await page.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(OUT, "product-cover-qa.json"), JSON.stringify(results, null, 2));
console.log("\nALL", all ? "PASS" : "FAIL");
process.exit(all ? 0 : 1);
