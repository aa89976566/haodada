import { BRAND } from "@/data/brand";
import { asset } from "@/lib/asset";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-buttons">
            <a className="footer-button" href={asset("/manifesto/")}>
              品牌理念
            </a>
            <a className="footer-button" href={asset("/faq/")}>
              常見問題
            </a>
          </div>
          <div className="footer-links">
            <span className="footer-link">寵物零食 · 原肉烘培</span>
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <div>
            <div className="footer-bottom-drop-title">{BRAND.name}</div>
            <div className="footer-bottom-drop-desc">
              {BRAND.description}
              <br />
              每一口都想讓毛孩大聲嚎叫的開心。
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-bottom-label footer-dog"
            src={asset("/images/dog-hero.png")}
            alt={BRAND.name}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-bottom-snake footer-dog"
            src={asset("/images/dog-hero.png")}
            alt=""
          />
        </div>
      </div>
    </footer>
  );
}

export function TikTokBar() {
  return (
    <section className="tiktok haodada-share">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tiktok-al" src={asset("/images/dog-hero.png")} alt="" />
      <div className="tiktok-cta">
        <div className="tiktok-cta-post">分享毛孩開吃瞬間</div>
        <div className="tiktok-cta-hashtag">#{BRAND.name}</div>
      </div>
      <div className="tiktok-quote">
        「拿嚎大大雞霸獎勵毛孩，看牠邊咬邊搖尾巴！」
      </div>
    </section>
  );
}
