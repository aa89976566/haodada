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
  const line = BRAND.lineUrl;
  const handle = BRAND.lineHandle;

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
        <h1 class="print-hero-title">實驗結果</h1>
        <div class="print-paper-window">
          <article class="print-paper">
            <header class="print-paper-head">
              <span>雞肉原味｜NT$89</span>
              <strong>壕大大雞霸｜食品資訊</strong>
            </header>
            <dl class="print-specs">
              <div><dt>品名</dt><dd>壕大大雞霸</dd></div>
              <div><dt>口味</dt><dd>雞肉原味</dd></div>
              <div><dt>原料</dt><dd>純雞肉</dd></div>
              <div><dt>製作方式</dt><dd>整片雞胸肉低溫烘乾</dd></div>
              <div><dt>淨重</dt><dd>50 克</dd></div>
            </dl>
            <section class="print-nutrition" aria-label="營養成分">
              <h3>營養成分</h3>
              <p><span>粗蛋白</span><b>62%</b></p>
              <p><span>粗脂肪</span><b>14.5%</b></p>
              <p><span>粗纖維</span><b>0.5%</b></p>
            </section>
            <section class="print-details" aria-label="適用對象與餵食資訊">
              <p><b>適用對象</b><span>6 個月以上的狗狗與貓咪</span></p>
              <p><b>特別適合</b><span>活動量大、需要補給或比較挑嘴的毛孩</span></p>
              <p><b>餵食方式</b><span>可剪成小段，依犬貓體型調整份量</span></p>
              <p><b>用途</b><span>日常獎勵零食，需搭配主食與充足飲水</span></p>
            </section>
            <section class="print-features" aria-label="產品特色">
              <h3>產品特色</h3>
              <div><span>高蛋白補給</span><span>高適口性</span><span>單一蛋白質來源</span><span>大片造型・增加咀嚼感</span></div>
            </section>
            <a class="print-cta" href="${escapeAttr(line)}" target="_blank" rel="noopener noreferrer">
              <strong>雞肉原味 NT$89 →</strong>
              <span>前往 LINE ${escapeAttr(handle)}</span>
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
