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
 * Classic IBM triptych hero (pre–PR #34 assets) inside the v15 shell:
 * fixed side posters + scrolling 414px center (classic-hero → chat-stream).
 * No CRT / eat-bulldog / pomeranian TV-frame hero.
 */
export function buildSiteHtml(): string {
  const line = BRAND.lineUrl;
  const handle = BRAND.lineHandle;

  return `<main class="experience-shell">
<aside class="side-panel side-left" aria-hidden="true">
  <div class="side-poster-wrap" data-parallax="0.12">
    <picture class="side-poster">
      <source srcset="/images/side-dog-left-v4.webp" type="image/webp">
      <img class="side-poster-img" src="/images/side-dog-left-v4.jpg" alt="" width="634" height="1360" decoding="async" fetchpriority="high">
    </picture>
  </div>
</aside>
<section class="center-column">
  <section class="classic-hero" aria-label="${escapeAttr(BRAND.name)} 實驗結果">
    <div class="classic-hero-wrap">
      <picture class="classic-hero-picture">
        <img class="classic-hero-img" src="/images/hero-furmosa-real-package-v2.jpg" alt="${escapeAttr(BRAND.name)} 實驗結果海報，兩隻狗狗拿著真實包裝雞排" width="941" height="1672" decoding="async" fetchpriority="high">
      </picture>
      <a class="furmosa-hotspot" href="${escapeAttr(line)}" target="_blank" rel="noopener noreferrer" title="加入 ${escapeAttr(handle)}" aria-label="加入 LINE ${escapeAttr(handle)}"></a>
    </div>
  </section>
  <section class="chat-stream">
    <div class="chat">${renderChat()}</div>
  </section>
</section>
<aside class="side-panel side-right" aria-hidden="true">
  <div class="side-poster-wrap" data-parallax="-0.12">
    <picture class="side-poster">
      <img class="side-poster-img" src="/images/side-dog-right-v4.jpg" alt="" width="627" height="1360" decoding="async" fetchpriority="high">
    </picture>
  </div>
</aside>
</main>`;
}
