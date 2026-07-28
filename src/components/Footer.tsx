import { BRAND } from "@/data/brand";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-links">
            <span className="footer-link">Terms & conditions</span>
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom footer-bottom-text">
          <div>
            <div className="footer-bottom-drop-title">
              {BRAND.name} is <span className="yellow-highlight">匠寵</span>{" "}
              {BRAND.dropLabel}
            </div>
            <div className="footer-bottom-drop-desc">
              Every treat is handmade. No preservatives. Maximum howling.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function TikTokBar() {
  return (
    <section className="tiktok haodada-share">
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
