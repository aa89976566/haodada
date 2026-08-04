"use client";

import { useEffect, useMemo, useState } from "react";
import { BootSequence } from "@/components/BootSequence";
import { DriveHeroExperience } from "@/components/DriveHeroExperience";
import { ExperimentArchive } from "@/components/ExperimentArchive";
import { createSessionSeed, generateExperiment } from "@/data/dogParkLab";

/**
 * DOG PARK LAB — interactive fake experiment over the existing poster.
 * Poster layout is preserved; experience layers are overlays + archive.
 */
export function HomePage() {
  const [ready, setReady] = useState(false);
  const experiment = useMemo(() => generateExperiment(createSessionSeed()), []);

  useEffect(() => {
    document.body.classList.toggle("page-ready", ready);
    document.body.classList.add("dog-park-lab");
    return () => {
      document.body.classList.remove("page-ready", "dog-park-lab");
    };
  }, [ready]);

  return (
    <>
      {!ready && <BootSequence onDone={() => setReady(true)} />}
      <main className={`dpl-main${ready ? " is-ready" : ""}`}>
        <DriveHeroExperience experiment={experiment} />
        <ExperimentArchive cards={experiment.archive} />
      </main>
    </>
  );
}
