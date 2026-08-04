"use client";

import type { ArchiveCard } from "@/data/dogParkLab";

export function ExperimentArchive({ cards }: { cards: ArchiveCard[] }) {
  return (
    <section className="dpl-archive" aria-labelledby="dpl-archive-title">
      <header className="dpl-archive-head">
        <h2 id="dpl-archive-title">EXPERIMENT ARCHIVE</h2>
        <p>Public records · unsorted · possibly wrong</p>
      </header>
      <ul className="dpl-archive-list">
        {cards.map((card) => (
          <li key={card.id} className="dpl-archive-item">
            <div
              className="dpl-archive-photo"
              style={{
                background: `repeating-linear-gradient(90deg, hsl(${card.photoHue} 18% 22%), hsl(${card.photoHue} 18% 22%) 2px, hsl(${card.photoHue} 12% 16%) 2px, hsl(${card.photoHue} 12% 16%) 4px)`,
              }}
              aria-hidden="true"
            >
              <span>PHOTO</span>
              <span>{card.breed}</span>
            </div>
            <div className="dpl-archive-body">
              <p className="dpl-archive-id">{card.id}</p>
              <p>
                <strong>Result</strong> {card.result}
              </p>
              <p>
                <strong>Breed</strong> {card.breed}
              </p>
              <p>
                <strong>Popularity</strong> {card.popularity}
              </p>
              <p>
                <strong>Side effects</strong> {card.sideEffect}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="dpl-archive-foot">
        End of visible archive · further records sealed by DOG UNIT
      </p>
    </section>
  );
}
