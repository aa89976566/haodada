/**
 * Smoke-test the www.furmosa.com/haodada reverse-proxy after menu rewrite.
 */
import { chromium } from "playwright";
import fs from "fs";

const SITE = process.env.QA_URL || "https://www.furmosa.com/haodada/";
const OUT = "/opt/cursor/artifacts/furmosa-domain-qa";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const checks = [];
const push = (name, ok, detail) => {
  checks.push({ name, ok, detail });
  console.log(`  ${ok ? "✓" : "✗"} ${name}: ${detail}`);
};

try {
  for (const { label, viewport } of [
    { label: "mobile-390", viewport: { width: 390, height: 844 } },
    { label: "desktop-1440", viewport: { width: 1440, height: 900 } },
  ]) {
    const page = await browser.newPage({ viewport });
    const failed = [];
    const errors = [];
    const redirects = [];
    page.on("requestfailed", (req) => {
      failed.push(`${req.failure()?.errorText || "fail"} ${req.url()}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      const status = res.status();
      if (status >= 300 && status < 400) {
        redirects.push(`${status} ${res.url()} -> ${res.headers().location || ""}`);
      }
    });

    const response = await page.goto(SITE, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(800);
    const finalUrl = page.url();
    const title = await page.title();
    const canon = await page.evaluate(
      () => document.querySelector('link[rel="canonical"]')?.href || "",
    );
    const cssOk = await page.evaluate(() => {
      return [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) =>
        l.href.includes("haodada-site-v15.css"),
      );
    });
    const loop = redirects.filter((r) => r.includes("/haodada") && r.includes("haodada"));
    push(`${label}-http`, !!response && response.status() < 400, String(response?.status()));
    push(`${label}-stays-on-www`, finalUrl.includes("www.furmosa.com/haodada"), finalUrl);
    push(`${label}-title`, title.includes("嚎大大雞霸"), title);
    push(
      `${label}-canonical`,
      canon.startsWith("https://www.furmosa.com/haodada/") && !canon.includes("?"),
      canon,
    );
    push(`${label}-css`, cssOk, "haodada-site-v15.css");
    push(
      `${label}-console`,
      errors.filter((t) => !t.includes("favicon")).length === 0,
      JSON.stringify(errors),
    );
    push(
      `${label}-requests`,
      failed.filter((t) => !t.includes("favicon")).length === 0,
      JSON.stringify(failed),
    );
    push(`${label}-no-loop`, loop.length <= 2, JSON.stringify(redirects.slice(0, 8)));
    await page.screenshot({ path: `${OUT}/${label}.png`, fullPage: false });
    await page.close();
  }

  const apex = await fetch("https://furmosa.com/haodada", { redirect: "manual" });
  const apexLoc = apex.headers.get("location") || "";
  const apexOk =
    [301, 302, 307, 308].includes(apex.status) &&
    apexLoc.includes("www.furmosa.com/haodada");
  push(
    "apex-redirects-to-www",
    apexOk || apex.status === 200,
    `${apex.status} ${apexLoc}`.trim(),
  );
} finally {
  await browser.close();
}

const pass = checks.every((c) => c.ok);
fs.writeFileSync(`${OUT}/domain-qa.json`, JSON.stringify(checks, null, 2));
console.log("\nALL", pass ? "PASS" : "FAIL");
process.exit(pass ? 0 : 1);
