import { BRAND, CHAT, type ChatBlock } from "@/data/brand";

function escapeAttr(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
    return `<div class="yours messages"><div class="message has-image has-video last"><video class="chat-product-video" autoplay muted loop playsinline webkit-playsinline preload="auto" width="720" height="1280" src="${escapeAttr(block.video)}" aria-label="${escapeAttr(block.alt)}"></video></div></div>`;
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
 * Classic IBM side posters + layered center hero (~744px thisfoot rhythm).
 * Center is HTML/CSS layers (no hero-center-v2 edge fragments).
 * Chat unchanged; fixed sides + document-flow center scroll retained.
 */
export function buildSiteHtml(): string {
  const line = BRAND.lineUrl;
  const handle = BRAND.lineHandle;
  const product = "/images/haodada/product-reference.jpeg";

  return `<main class="experience-shell">
<aside class="side-panel side-left" aria-hidden="true">
  <div class="side-poster-wrap" data-parallax="0.12">
    <picture class="side-poster">
      <source srcset="/images/side-dog-left-v3.webp" type="image/webp">
      <img class="side-poster-img" src="/images/side-dog-left-v3.jpg" alt="" width="634" height="1360" decoding="async" fetchpriority="high">
    </picture>
  </div>
</aside>
<section class="center-column">
  <section class="classic-hero" aria-label="${escapeAttr(BRAND.name)} 實驗結果">
    <div class="classic-hero-stage">
      <div class="classic-hero-atmosphere" aria-hidden="true">
        <div class="classic-hero-sky"></div>
        <div class="classic-hero-grid"></div>
      </div>
      <div class="classic-hero-copy">
        <h1 class="classic-hero-title">實驗結果</h1>
        <p class="classic-hero-lead">帶上${escapeHtml(BRAND.shortName)}<br>被搭訕機率<br>增加</p>
        <p class="classic-hero-stat" aria-label="百分之三百二十七">327%</p>
      </div>
      <div class="classic-hero-product-stage">
        <div class="classic-hero-product-float">
          <img class="classic-hero-product" src="${escapeAttr(product)}" alt="${escapeAttr(BRAND.name)} 產品包裝" width="1022" height="1602" decoding="async" fetchpriority="high">
        </div>
      </div>
      <div class="classic-hero-cta-row">
        <a class="classic-hero-line" href="${escapeAttr(line)}" target="_blank" rel="noopener noreferrer" aria-label="加入 LINE ${escapeAttr(handle)}">
          <span class="classic-hero-line-icon" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="28" height="28" focusable="false">
              <circle cx="20" cy="20" r="20" fill="#06C755"/>
              <path fill="#fff" d="M20 9.2c-6.2 0-11.2 4.1-11.2 9.2 0 4.5 4 8.3 9.4 9.1.37.08.87.24 1 .55.11.28.07.72.04 1l-.18 1.1c-.05.32-.24 1.25 1.1.68 1.33-.56 7.2-4.24 9.82-7.26C32.3 21.4 31.2 13.4 20 13.4"/>
              <path fill="#06C755" d="M14.2 18.1h-1.5v4.6h1.5v-4.6zm3.7 0h-1.5l-1.2 3.2-1.2-3.2h-1.55l2 4.6h1.5l2-4.6zm3.55 0H19.9v4.6h1.55v-4.6zm5.7 0h-3.9v4.6h1.5v-1.55h2.05c1.05 0 1.9-.75 1.9-1.75v-.55c0-1-.8-1.75-1.85-1.75zm-.25 2.05h-1.65v-.85h1.65c.25 0 .45.16.45.4v.05c0 .24-.2.4-.45.4z"/>
            </svg>
          </span>
          <span class="classic-hero-line-text">加入 ${escapeHtml(handle)}</span>
        </a>
        <span class="classic-hero-hand" aria-hidden="true">
          <svg class="classic-hero-hand-svg" viewBox="0 0 64 64" width="48" height="48" focusable="false">
            <path fill="#fff" stroke="#111" stroke-width="2.5" d="M28 6c-2 0-3.5 1.6-3.5 3.5V30l-3.2-2.4c-2.2-1.6-5.3-.7-6.2 1.8-.7 1.9.2 4 2.1 5.1L32 46.5V58h8V34.2l8.2-1.6c2.3-.4 3.8-2.7 3.3-5-.4-1.9-2.1-3.2-4-3.2H36V9.5C36 7.6 34 6 28 6z"/>
          </svg>
        </span>
      </div>
      <div class="classic-hero-feature">
        <h2 class="classic-hero-feature-title">《狗公園公約》第 6 條</h2>
        <p class="classic-hero-feature-body">帶球 只會開始遊戲<br>帶${escapeHtml(BRAND.shortName)} 才會開始聊天</p>
      </div>
    </div>
  </section>
  <section class="chat-stream">
    <div class="chat">${renderChat()}</div>
  </section>
</section>
<aside class="side-panel side-right" aria-hidden="true">
  <div class="side-poster-wrap" data-parallax="-0.12">
    <picture class="side-poster">
      <source srcset="/images/side-dog-right-v3.webp" type="image/webp">
      <img class="side-poster-img" src="/images/side-dog-right-v3.jpg" alt="" width="627" height="1360" decoding="async" fetchpriority="high">
    </picture>
  </div>
</aside>
</main>`;
}
