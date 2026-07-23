export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-buttons">
            <a className="footer-button" href="/manifesto">
              Manifesto
            </a>
            <a className="footer-button" href="/faq">
              FAQ
            </a>
          </div>
          <div className="footer-links">
            <a className="footer-link" href="/toc.pdf" target="_blank" rel="noreferrer">
              Terms & conditions
            </a>
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <div>
            <div className="footer-bottom-drop-title">
              Illegal Chips is{" "}
              <a className="footer-mschf-link" href="https://mschf.xyz/" target="_blank" rel="noreferrer">
                MSCHF
              </a>{" "}
              DROP #61
            </div>
            <div className="footer-bottom-drop-desc">
              Every drop is different, and we never do the same thing twice.{" "}
              <a className="footer-download" href="https://mschf.com/illegalchips" target="_blank" rel="noreferrer">
                Download the MSCHF app
              </a>{" "}
              to hear about future drops.
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer-bottom-label" src="/images/label.png" alt="Illegal Chips label" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-bottom-snake"
            src="/images/footer-image.png"
            alt=""
          />
        </div>
      </div>
    </footer>
  );
}

export function TikTokBar() {
  return (
    <section className="tiktok">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tiktok-al" src="/images/al-standing.png" alt="" />
      <div className="tiktok-cta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tiktok-left" src="/images/tiktok.svg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tiktok-right" src="/images/tiktok.svg" alt="" />
        <div className="tiktok-cta-post">Post to TikTok</div>
        <a
          className="tiktok-cta-bttn"
          href="https://www.tiktok.com/tag/illegalchipschallenge"
          target="_blank"
          rel="noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/challenge.svg" alt="#illegalchipschallenge" />
        </a>
      </div>
      <div className="tiktok-quote">
        “Feed your friends illegal chips and make them guess what they’re eating!”
      </div>
    </section>
  );
}
