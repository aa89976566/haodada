"use client";

import { useCallback, useState } from "react";
import { FallingChips } from "@/components/FallingChips";
import { Footer, TikTokBar } from "@/components/Footer";
import {
  Background,
  CautionTape,
  IllegalAl,
  Logo,
  Menu,
  Preloader,
} from "@/components/SiteChrome";

export function TextPageShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const dismiss = useCallback(() => setReady(true), []);

  return (
    <div className="page-root">
      {!ready ? <Preloader onDone={dismiss} /> : null}
      <Background />
      <FallingChips />
      <Logo />
      <Menu />
      <CautionTape />
      <IllegalAl />
      <div className={`bg-wrapper${ready ? "" : " bg-wrapper-hide"}`}>
        {children}
        <TikTokBar />
        <Footer />
      </div>
    </div>
  );
}
