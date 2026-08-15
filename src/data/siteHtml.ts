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
  if ("preview" in block) {
    const preview = block.preview;
    return `<div class="mine messages"><div class="message has-link-preview last"><a href="${escapeAttr(preview.url)}" target="_blank" rel="noopener noreferrer" class="chat-preview-card" aria-label="前往${escapeAttr(preview.title)}商品頁"><img src="${escapeAttr(preview.image)}" alt="${escapeAttr(preview.imageAlt)}" class="chat-preview-image" width="900" height="520" loading="lazy" decoding="async"><span class="chat-preview-body"><span class="chat-preview-eyebrow">${escapeAttr(preview.eyebrow)}</span><strong>${escapeAttr(preview.title)}</strong><span class="chat-preview-description">${escapeAttr(preview.description)}</span><span class="chat-preview-domain"><span>${escapeAttr(preview.domain)}</span><b>查看商品 ↗</b></span></span></a></div></div>`;
  }
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
  return `<main class="experience-shell">
<aside class="side-panel side-left" aria-hidden="true">
  <span class="side-burst side-burst-round"></span>
  <div class="side-poster-wrap" data-parallax="0.12">
    <div class="side-poster-frame">
      <picture class="side-poster">
        <img class="side-poster-img" src="/images/side-chicken-left-v6.png" alt="" width="858" height="1833" decoding="async" fetchpriority="high">
      </picture>
      <span class="side-copy-fix">毛孩吃得單純安心</span>
    </div>
  </div>
</aside>
<section class="center-column">
  <section class="print-lab" aria-label="${escapeAttr(BRAND.name)} 食品資訊列印動畫">
    <div class="print-lab-sticky">
      <div class="print-lab-stage">
        <img class="print-lab-machine" src="/images/hero-factory-printer-front-v13.png" alt="正面嚎大大雞霸製作與包裝流程印表機，第一站使用小型桌上絞肉機進行雞肉絞製，第二站鋪平塑形，下方為完整藍色網格地板" width="941" height="1671" decoding="async" fetchpriority="high">
        <span class="process-label process-label-one">1. 雞肉絞製</span>
        <div class="print-paper-window">
          <article class="print-paper">
            <img class="print-paper-receipt" src="/images/haodada/product-receipt-sectioned-red-white-v7.png" alt="純白底紅墨嚎大大雞霸食品資訊發票，包含價格、淨重、成分、營養分析及獨立框線保存期限" width="941" height="1672" decoding="async">
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
        <img class="side-poster-img" src="/images/side-chicken-right-v6.png" alt="" width="852" height="1846" decoding="async" fetchpriority="high">
      </picture>
    </div>
  </div>
</aside>
</main>`;
}
