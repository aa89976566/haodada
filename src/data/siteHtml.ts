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
 * v13 layout: one unified master hero (first viewport) → yellow chat rail.
 * Desktop uses hero-master-v13.jpg (16:9 contain + corner-blue letterbox).
 * Mobile uses existing center poster so the first screen stays readable.
 */
export function buildSiteHtml(): string {
  return `<section class="hero is-fullheight"><div class="container main-container"><div class="master-hero-stage"><img class="master-hero-img master-hero-img--desktop" src="/images/hero-master-v13.jpg" alt="${escapeAttr(BRAND.name)} 統一主視覺" width="960" height="540" decoding="async" fetchpriority="high"><picture class="master-hero-mobile"><source srcset="/images/hero-center-v2.webp" type="image/webp"><img class="master-hero-img master-hero-img--mobile" src="/images/hero-center-v2.jpg" alt="${escapeAttr(BRAND.name)} 實驗結果海報" width="1133" height="1360" decoding="async" fetchpriority="high"></picture></div><div class="chat-rail"><div class="mobile-messages"><div class="chat">${renderChat()}</div></div></div></div></section>`;
}
