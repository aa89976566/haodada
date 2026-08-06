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
 * v14 — thisfootdoesnotexist reference shell:
 * fixed left/right master crops + scrolling 414px center rail (hero → chat).
 * Desktop uses one master JPEG for three synced viewport crops.
 */
export function buildSiteHtml(): string {
  const master = "/images/hero-master-v13.jpg";
  const masterAlt = `${BRAND.name} 統一主視覺`;

  return `<section class="hero is-fullheight"><div class="reference-shell"><aside class="master-side master-side--left" aria-hidden="true"><img class="master-crop-img" src="${escapeAttr(master)}" alt="" width="960" height="540" decoding="async" fetchpriority="high"></aside><main class="center-rail"><div class="center-hero-window"><img class="master-crop-img master-crop-img--desktop" src="${escapeAttr(master)}" alt="${escapeAttr(masterAlt)}" width="960" height="540" decoding="async" fetchpriority="high"><picture class="center-hero-mobile"><source srcset="/images/hero-center-v2.webp" type="image/webp"><img class="center-hero-mobile-img" src="/images/hero-center-v2.jpg" alt="${escapeAttr(BRAND.name)} 實驗結果海報" width="1133" height="1360" decoding="async" fetchpriority="high"></picture></div><section class="mobile-messages"><div class="chat">${renderChat()}</div></section></main><aside class="master-side master-side--right" aria-hidden="true"><img class="master-crop-img" src="${escapeAttr(master)}" alt="" width="960" height="540" decoding="async" fetchpriority="high"></aside></div></section>`;
}
