import { BRAND, CHAT, type ChatBlock } from "@/data/brand";

function escapeAttr(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function renderTexts(texts: string[], markLast: boolean) {
  return texts
    .map((text, i) => {
      const last = markLast && i === texts.length - 1 ? " last" : "";
      return `<div class="message${last}">${text}</div>`;
    })
    .join("");
}

function renderChatBlock(block: ChatBlock): string {
  if ("video" in block) {
    return `<div class="yours messages"><div class="message has-image has-video last"><video class="chat-product-video" muted loop playsinline webkit-playsinline preload="none" width="720" height="1280" data-src="${escapeAttr(block.video)}" poster="/images/haodada/customer-dog-product-v3.jpg" aria-label="${escapeAttr(block.alt)}"></video><button class="chat-video-play" type="button" aria-label="播放狗公園影片">播放影片</button></div></div>`;
  }
  if ("image" in block) {
    return `<div class="yours messages"><div class="message has-image last"><img src="${escapeAttr(block.image)}" alt="${escapeAttr(block.alt)}" class="chat-bubble-photo" width="286" height="420" loading="lazy" decoding="async"></div></div>`;
  }
  if (block.kind === "mine") {
    return `<div class="mine messages">${renderTexts(block.texts, true)}</div>`;
  }
  return `<div class="yours messages">${renderTexts(block.texts, true)}</div>`;
}

function renderChat() {
  return CHAT.map(renderChatBlock).join("");
}

/**
 * Classic IBM triptych hero (pre–PR #34 assets) inside the v15 shell:
 * fixed side posters + scrolling 414px center (classic-hero → chat-stream).
 * No CRT / eat-bulldog / pomeranian TV-frame hero.
 */
export function buildSiteHtml(): string {
  const shop = BRAND.shopUrl;

  return `<main class="experience-shell">
<aside class="side-panel side-left" aria-hidden="true">
  <span class="side-burst side-burst-round"></span>
  <div class="side-poster-wrap" data-parallax="0.12">
    <div class="side-poster-frame">
      <picture class="side-poster">
        <source srcset="/images/side-dog-left-v4.webp" type="image/webp">
        <img class="side-poster-img" src="/images/side-dog-left-v4.jpg" alt="" width="634" height="1360" decoding="async" fetchpriority="high">
      </picture>
      <span class="side-copy-fix">毛孩吃得單純安心</span>
    </div>
  </div>
</aside>
<section class="center-column">
  <section class="print-lab" aria-label="${escapeAttr(BRAND.name)} 食品資訊列印動畫">
    <div class="print-lab-sticky">
      <div class="print-lab-stage">
        <img class="print-lab-machine" src="/images/hero-factory-printer-front-v10.png" alt="正面嚎大大雞霸製作與包裝流程印表機" width="941" height="1671" decoding="async" fetchpriority="high">
        <div class="print-paper-window">
          <article class="print-paper">
            <a class="print-paper-link" href="${escapeAttr(shop)}" target="_blank" rel="noopener noreferrer" aria-label="開啟嚎大大雞霸商品頁激情下單">
              <img class="print-paper-receipt" src="/images/haodada/product-receipt-v1.jpg" alt="嚎大大雞霸台灣發票式食品資訊與營養分析" width="844" height="1863" decoding="async">
              <span class="print-paper-cta" aria-hidden="true">激情下單</span>
            </a>
          </article>
        </div>
      </div>
    </div>
  </section>
  <section class="chat-stream">
    <div class="chat">${renderChat()}</div>
  </section>
</section>
<aside class="side-panel side-right" aria-hidden="true">
  <span class="side-burst side-burst-sharp"></span>
  <div class="side-poster-wrap" data-parallax="-0.12">
    <div class="side-poster-frame">
      <picture class="side-poster">
        <img class="side-poster-img" src="/images/side-dog-right-v4.jpg" alt="" width="627" height="1360" decoding="async" fetchpriority="high">
      </picture>
    </div>
  </div>
</aside>
</main>`;
}
