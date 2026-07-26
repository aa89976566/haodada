import { BRAND } from "@/data/brand";
import { asset } from "@/lib/asset";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-buttons">
            <a className="footer-button" href={asset("/manifesto/")}>
              Manifesto
            </a>
            <a className="footer-button" href={asset("/faq/")}>
              FAQ
            </a>
          </div>
          <div className="footer-links">
            <span className="footer-link">Terms & conditions</span>
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <div>
            <div className="footer-bottom-drop-title">
              {BRAND.name} is <span className="yellow-highlight">匠寵</span> {BRAND.dropLabel}
            </div>
            <div className="footer-bottom-drop-desc">
              Every treat is different — handmade, no preservatives, and made for howling joy.
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-bottom-label"
            src={asset("/images/haodada/pack-brown.png")}
            alt={BRAND.name}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-bottom-snake"
            src={asset("/images/haodada/hero-black.png")}
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
      <img className="tiktok-al" src={asset("/images/haodada/eat-dachshund.png")} alt="" />
      <div className="tiktok-cta">
        <div className="tiktok-cta-post">Post to TikTok</div>
        <div className="tiktok-cta-hashtag">#{BRAND.name}</div>
      </div>
      <div className="tiktok-quote">
        “Feed your friends {BRAND.shortName} and make them guess what they’re eating!”
      </div>
    </section>
  );
}
