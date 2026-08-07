import { chromium } from "playwright";

const URL = "http://127.0.0.1:4173/";
const VW = 1324;
const VH = 921;

function near(a, b, tol = 3) {
  return Math.abs(a - b) <= tol;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: VW, height: VH });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });

const btn = page.locator("#SitePreloader button.enter");
if (await btn.count()) {
  try {
    await btn.click({ timeout: 2000 });
    await page.waitForTimeout(350);
  } catch {}
}
await page.evaluate(() => {
  document.body.classList.add("page-ready");
  const p = document.getElementById("SitePreloader");
  if (p) p.style.display = "none";
});
await page.waitForTimeout(400);

async function measure(scrollY) {
  return page.evaluate((y) => {
    window.scrollTo(0, y);
    const hero =
      document.querySelector(".interactive-hero") ||
      document.querySelector(".mobile-hero");
    const chat = document.querySelector(".chat-stream");
    const left = document.querySelector(".side-left");
    const right = document.querySelector(".side-right");
    const center =
      document.querySelector(".center-column") ||
      document.querySelector(".center-flow");
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        top: b.top,
        bottom: b.bottom,
        height: b.height,
        width: b.width,
      };
    };
    const se = document.scrollingElement;
    const nested = [...document.querySelectorAll("*")].filter((el) => {
      if (el === document.documentElement || el === document.body) return false;
      const s = getComputedStyle(el);
      return (
        (s.overflowY === "auto" || s.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 2
      );
    }).length;
    return {
      scrollY: window.scrollY,
      scrollingElement:
        se === document.documentElement
          ? "HTML"
          : se === document.body
            ? "BODY"
            : se?.tagName || null,
      nestedScroll: nested,
      hero: {
        ...r(hero),
        position: hero ? getComputedStyle(hero).position : null,
      },
      chat: {
        ...r(chat),
        position: chat ? getComputedStyle(chat).position : null,
        marginTop: chat ? getComputedStyle(chat).marginTop : null,
      },
      left: {
        ...r(left),
        position: left ? getComputedStyle(left).position : null,
      },
      right: {
        ...r(right),
        position: right ? getComputedStyle(right).position : null,
      },
      centerWidth: center ? center.getBoundingClientRect().width : null,
      gap: (() => {
        const hr = r(hero);
        const cr = r(chat);
        return hr && cr ? cr.top - hr.bottom : null;
      })(),
      hasMaster: !!document.querySelector(".desktop-master"),
      hasSpacer: !!document.querySelector(".desktop-hero-spacer, .center-spacer"),
    };
  }, scrollY);
}

const at0 = await measure(0);
const at300 = await measure(300);

const checks = [];
const push = (name, ok, detail) => checks.push({ name, ok, detail });

push("no-master", !at0.hasMaster, String(at0.hasMaster));
push("no-spacer", !at0.hasSpacer, String(at0.hasSpacer));
push("hero-relative", at0.hero.position === "relative" || at0.hero.position === "static", at0.hero.position);
push("center-414", near(at0.centerWidth, 414, 1), String(at0.centerWidth));
push("gap0", near(at0.gap ?? 99, 0, 1.5), String(at0.gap));
push("scroll-el", at0.scrollingElement === "HTML" || at0.scrollingElement === "BODY", at0.scrollingElement);
push("no-nested-scroll", at0.nestedScroll === 0, String(at0.nestedScroll));
push("y0-heroTop", near(at0.hero.top, 0, 3), String(at0.hero.top));
push("y0-chatTop", near(at0.chat.top, at0.hero.height, 3), `chat=${at0.chat.top} heroH=${at0.hero.height}`);
push("y300-heroTop", near(at300.hero.top, -300, 3), String(at300.hero.top));
push("y300-chatTop", near(at300.chat.top, at0.hero.height - 300, 3), `chat=${at300.chat.top} expect=${at0.hero.height - 300}`);
push("y300-leftTop", near(at300.left.top, 0, 1.5), String(at300.left.top));
push("y300-rightTop", near(at300.right.top, 0, 1.5), String(at300.right.top));
push("sides-fixed", at300.left.position === "fixed" && at300.right.position === "fixed", `${at300.left.position}/${at300.right.position}`);

const pass = checks.every((c) => c.ok);
console.log(JSON.stringify({ at0, at300, checks, pass }, null, 2));
for (const c of checks) console.log(`${c.ok ? "✓" : "✗"} ${c.name}: ${c.detail}`);
console.log(pass ? "ALL PASS" : "ALL FAIL");
await browser.close();
process.exit(pass ? 0 : 1);
