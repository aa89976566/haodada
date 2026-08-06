import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "/opt/cursor/artifacts/v13-qa";
const URL = "http://127.0.0.1:4173/";
const VIEWPORTS = [390, 820, 1024, 1440, 1920];
const HEIGHT = 900;

fs.mkdirSync(OUT, { recursive: true });

async function dismissPreloader(page) {
  const btn = page.locator("#SitePreloader button.enter");
  if (await btn.count()) {
    try {
      await btn.click({ timeout: 2500 });
      await page.waitForTimeout(400);
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

async function measure(page, vw) {
  await page.setViewportSize({ width: vw, height: HEIGHT });
  await page.goto(URL, { waitUntil: "networkidle" });
  await dismissPreloader(page);
  await page.waitForTimeout(700);

  const data = await page.evaluate(() => {
    const stage = document.querySelector(".master-hero-stage");
    const desk = document.querySelector(".master-hero-img--desktop");
    const mob = document.querySelector(".master-hero-img--mobile");
    const chat = document.querySelector(".mobile-messages .chat");
    const video = document.querySelector("video.chat-product-video");
    const videoMsg = document.querySelector(".message.has-video");
    const firstMsg = document.querySelector(".chat .message");
    const left = document.querySelector(".desktop-column.left");
    const right = document.querySelector(".desktop-column.right");
    const cssHref =
      [...document.querySelectorAll("link[rel=stylesheet]")]
        .map((l) => l.href)
        .find((h) => h.includes("haodada-site")) || "";

    function rect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
        width: r.width,
        height: r.height,
      };
    }

    function visible(el) {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    }

    const activeImg = visible(desk) ? desk : visible(mob) ? mob : null;
    const ar = activeImg
      ? {
          natural: { w: activeImg.naturalWidth, h: activeImg.naturalHeight },
          rendered: rect(activeImg),
          objectFit: getComputedStyle(activeImg).objectFit,
          src: activeImg.currentSrc || activeImg.src,
        }
      : null;

    const hardSell = [...document.querySelectorAll(".chat .message")].map(
      (el) => (el.innerText || "").trim(),
    );
    const banned = hardSell.filter((t) =>
      /哪裡買|line\.me|furmosa\.com|加 LINE|@FURMOSA/i.test(t),
    );

    return {
      cssHref,
      stage: rect(stage),
      stageBg: stage ? getComputedStyle(stage).backgroundColor : null,
      deskVisible: visible(desk),
      mobVisible: visible(mob),
      leftExists: !!left,
      rightExists: !!right,
      activeImg: ar,
      firstMessage: firstMsg
        ? {
            text: (firstMsg.innerText || "").slice(0, 60),
            top: firstMsg.getBoundingClientRect().top,
            stageBottom: stage ? stage.getBoundingClientRect().bottom : null,
            gap: stage
              ? firstMsg.getBoundingClientRect().top -
                stage.getBoundingClientRect().bottom
              : null,
          }
        : null,
      video: video
        ? {
            inChat: !!(chat && chat.contains(video)),
            props: {
              autoplay: video.autoplay,
              muted: video.muted,
              loop: video.loop,
              controls: video.controls,
              paused: video.paused,
            },
            widthPct:
              videoMsg && chat
                ? videoMsg.getBoundingClientRect().width /
                  chat.getBoundingClientRect().width
                : null,
          }
        : null,
      hasIgLink: !!document.querySelector(
        'a.phone-link[href*="instagram.com/furmosa_food"]',
      ),
      banned,
      overflowX:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      bubbles: hardSell.slice(0, 20),
    };
  });

  const shot = path.join(OUT, `v13-${vw}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  data.viewport = vw;
  data.shot = shot;
  return data;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
for (const vw of VIEWPORTS) {
  const r = await measure(page, vw);
  results.push(r);
  console.log("\n===", vw, "===");
  console.log("css", r.cssHref);
  console.log(
    "hero desk/mob",
    r.deskVisible,
    r.mobVisible,
    r.activeImg?.objectFit,
    r.activeImg?.natural,
    "src",
    (r.activeImg?.src || "").split("/").pop(),
  );
  console.log("stage", r.stage, "bg", r.stageBg);
  console.log("first", r.firstMessage);
  console.log("video", r.video);
  console.log("ig", r.hasIgLink, "banned", r.banned);
  console.log("overflowX", r.overflowX, "sides", r.leftExists, r.rightExists);
}
await browser.close();
fs.writeFileSync(path.join(OUT, "v13-qa.json"), JSON.stringify(results, null, 2));
console.log("\nWrote", path.join(OUT, "v13-qa.json"));
