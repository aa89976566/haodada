"use client";

import { useEffect, useMemo, useState } from "react";
import { THISFOOT_HTML } from "@/data/thisfootHtml";

function basePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix absolute site-root asset paths for GitHub Pages basePath. */
function withBase(html: string) {
  const base = basePath();
  if (!base) return html;
  return html
    .replace(/(src|href)="(\/_nuxt\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(src|href)="(\/img\/[^"]+)"/g, `$1="${base}$2"`)
    .replace(/(href)="(\/privacypolicy\.pdf)"/g, `$1="${base}$2"`)
    .replace(/(src|href)="(\/social\/[^"]+)"/g, `$1="${base}$2"`);
}

function markEntered() {
  try {
    sessionStorage.setItem("thisfoot-entered", "1");
  } catch {
    // ignore
  }
}

function hasEntered() {
  try {
    return sessionStorage.getItem("thisfoot-entered") === "1";
  } catch {
    return false;
  }
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    if (hasEntered()) {
      onDone();
      return;
    }
    const spin = window.setTimeout(() => setRotate(true), 80);
    return () => window.clearTimeout(spin);
  }, [onDone]);

  return (
    <div id="MSCHFPreloader">
      <div className={`gradient-background${rotate ? " rotate" : ""}`} />
      <div className="loader-inner">
        <div className="content-wrapper">
          <h1>This Foot Does Not Exist</h1>
          <h3>* MSCHF *</h3>
          <button
            type="button"
            className="enter"
            onClick={() => {
              markEntered();
              onDone();
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Direct static mirror of https://thisfootdoesnotexist.com/
 * Markup + CSS + assets captured from the live site.
 */
export function HomePage() {
  const [ready, setReady] = useState(false);
  const html = useMemo(() => withBase(THISFOOT_HTML), []);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    return () => document.body.classList.remove("page-ready");
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div
        className="thisfoot-mirror"
        // Static snapshot of the hydrated thisfoot DOM.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
