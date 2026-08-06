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
 * v14 — single fixed .desktop-master + 414px .center-flow.
 * Document scroll is body-only: transparent spacer then opaque chat.
 * Mobile (≤768): hide master/spacer, show .mobile-hero in flow.
 */
export function buildSiteHtml(): string {
  const master = "/images/hero-master-v13.jpg";
  const mobileJpg = "/images/hero-center-v2.jpg";
  const mobileWebp = "/images/hero-center-v2.webp";

  return `<main class="page-shell">
  <div class="desktop-master" aria-hidden="true"><img src="${escapeAttr(master)}" alt="" width="960" height="540" decoding="async" fetchpriority="high"></div>
  <div class="center-flow">
    <section class="desktop-hero-spacer" aria-label="${escapeAttr(BRAND.name)}"></section>
    <section class="mobile-hero">
      <picture class="mobile-hero-picture">
        <source srcset="${escapeAttr(mobileWebp)}" type="image/webp">
        <img class="mobile-hero-img" src="${escapeAttr(mobileJpg)}" alt="${escapeAttr(BRAND.name)}" width="828" height="1472" decoding="async" fetchpriority="high">
      </picture>
    </section>
    <section class="mobile-messages chat-stream">
      <div class="chat">${renderChat()}</div>
    </section>
  </div>
</main>`;
}
