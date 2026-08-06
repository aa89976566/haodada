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
 * v15 — thisfoot-style layered experience:
 * fixed side panels + scrolling 414px center (interactive-hero → chat-stream).
 * No full-page composite master image.
 */
export function buildSiteHtml(): string {
  const product = "/images/haodada/product-reference.jpeg";
  const dogLeft = "/images/haodada/eat-bulldog.png";
  const dogRight = "/images/haodada/hero-pomeranian.png";

  return `<main class="experience-shell">
<aside class="side-panel side-left" aria-hidden="true">
  <div class="side-stack" data-parallax="0.12">
    <p class="side-label glitch-text">${escapeHtml(BRAND.name)}</p>
    <div class="crt-frame">
      <div class="crt-bezel">
        <div class="crt-screen">
          <img class="side-dog side-dog-body" src="${escapeAttr(dogLeft)}" alt="" width="713" height="1200" decoding="async" loading="lazy">
          <div class="side-dog-head-layer" data-float="dog">
            <img class="side-dog side-dog-head" src="${escapeAttr(dogLeft)}" alt="" width="713" height="1200" decoding="async" loading="lazy">
          </div>
          <div class="crt-scanlines"></div>
          <div class="crt-noise"></div>
          <div class="crt-flicker"></div>
        </div>
      </div>
      <div class="crt-stand"></div>
    </div>
    <p class="side-tag">無添加 · 純雞情</p>
  </div>
</aside>
<section class="center-column">
  <section class="interactive-hero" aria-label="${escapeAttr(BRAND.name)} 實驗結果">
    <div class="hero-atmosphere" aria-hidden="true">
      <div class="hero-sky"></div>
      <div class="hero-perspective-grid"></div>
    </div>
    <div class="hero-copy">
      <h1 class="hero-title glitch-text">實驗結果</h1>
      <p class="hero-lead">帶上${escapeHtml(BRAND.shortName)}<br>被搭訕機率<br>增加</p>
      <p class="hero-stat" aria-label="百分之三百二十七">327%</p>
    </div>
    <div class="hero-product-stage">
      <div class="hero-product-float" data-float="product">
        <img class="hero-product" src="${escapeAttr(product)}" alt="${escapeAttr(BRAND.name)} 產品包裝" width="1022" height="1602" decoding="async" fetchpriority="high">
      </div>
      <div class="hero-hand" aria-hidden="true">
        <svg class="hero-hand-svg" viewBox="0 0 64 64" width="56" height="56" focusable="false">
          <path fill="#fff" stroke="#111" stroke-width="2.5" d="M28 6c-2 0-3.5 1.6-3.5 3.5V30l-3.2-2.4c-2.2-1.6-5.3-.7-6.2 1.8-.7 1.9.2 4 2.1 5.1L32 46.5V58h8V34.2l8.2-1.6c2.3-.4 3.8-2.7 3.3-5-.4-1.9-2.1-3.2-4-3.2H36V9.5C36 7.6 34 6 28 6z"/>
        </svg>
      </div>
    </div>
    <div class="hero-feature">
      <h2 class="hero-feature-title">《狗公園公約》第 6 條</h2>
      <p class="hero-feature-body">帶球 只會開始遊戲<br>帶${escapeHtml(BRAND.shortName)} 才會開始聊天</p>
    </div>
  </section>
  <section class="chat-stream">
    <div class="chat">${renderChat()}</div>
  </section>
</section>
<aside class="side-panel side-right" aria-hidden="true">
  <div class="side-stack" data-parallax="-0.12">
    <p class="side-label glitch-text">${escapeHtml(BRAND.furmosa)}</p>
    <div class="crt-frame">
      <div class="crt-bezel">
        <div class="crt-screen">
          <img class="side-dog side-dog-body" src="${escapeAttr(dogRight)}" alt="" width="653" height="1200" decoding="async" loading="lazy">
          <div class="side-dog-head-layer" data-float="dog">
            <img class="side-dog side-dog-head" src="${escapeAttr(dogRight)}" alt="" width="653" height="1200" decoding="async" loading="lazy">
          </div>
          <div class="crt-scanlines"></div>
          <div class="crt-noise"></div>
          <div class="crt-flicker"></div>
        </div>
      </div>
      <div class="crt-stand"></div>
    </div>
    <p class="side-tag">低溫烘乾 · 狗公園社交</p>
  </div>
</aside>
</main>`;
}
