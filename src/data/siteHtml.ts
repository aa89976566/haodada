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
  if (block.kind === "mine") {
    return `<div class="mine messages">${renderTexts(block.texts, true)}</div>`;
  }
  return `<div class="yours messages">${renderTexts(block.texts, true)}</div>`;
}

function renderChat() {
  return CHAT.map(renderChatBlock).join("");
}

/** Full site markup: fixed sides + scrolling center, Furmosa content only. */
export function buildSiteHtml(): string {
  const line = BRAND.lineUrl;
  const handle = BRAND.lineHandle;

  return `<section class="hero is-fullheight"><div class="container main-container"><div class="columns is-gapless"><div class="column desktop-column left is-hidden-mobile"><picture class="desktop-hero-img"><source srcset="/images/side-dog-left-v2.webp" type="image/webp"><img src="/images/side-dog-left-v2.jpg" alt="嚎大大雞霸 無添加" width="634" height="1360" class="desktop-hero-img-el"></picture></div><div class="column is-3 mobile"><div class="mobile-wrapper"><div class="mobile-hero"><div class="hero-drive-wrap"><picture class="hero-image hero-drive"><source srcset="/images/hero-center-v2.webp" type="image/webp"><img src="/images/hero-center-v2.jpg" alt="實驗結果：帶上雞霸被搭訕機率增加 327%" width="1133" height="1360" decoding="async" fetchpriority="high" class="hero-drive-img"></picture><a class="furmosa-hotspot" href="${escapeAttr(line)}" target="_blank" rel="noopener noreferrer" title="加入 ${escapeAttr(handle)}" aria-label="加入 LINE ${escapeAttr(handle)}"></a></div><div class="mobile-text"><div class="c2a-wrapper"><a href="${escapeAttr(line)}" target="_blank" rel="noopener noreferrer" title="加入 ${escapeAttr(handle)}" class="button c2a-phone-hero c2a-line-hero" aria-label="加入 LINE ${escapeAttr(handle)}"><span class="c2a-line-label">加入 ${escapeAttr(handle)}</span></a></div></div></div><div class="mobile-messages"><div class="chat">${renderChat()}</div></div></div></div><div class="column desktop-column right is-hidden-mobile"><picture class="desktop-hero-img"><source srcset="/images/side-dog-right-v2.webp" type="image/webp"><img src="/images/side-dog-right-v2.jpg" alt="嚎大大雞霸 純雞情" width="627" height="1360" class="desktop-hero-img-el"></picture></div></div></div></section>`;
}
