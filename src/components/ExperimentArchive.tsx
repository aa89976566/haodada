"use client";

import type { Experiment } from "@/data/dogParkLab";

/** DOS / archive windows — part of the OS, not marketing cards. */
export function ExperimentArchive({ experiment }: { experiment: Experiment }) {
  return (
    <section className="os-lower" aria-label="Laboratory windows">
      <article className="os-window os-window-term">
        <div className="os-titlebar">
          <span className="os-titlebar-icon" aria-hidden="true" />
          <h2 className="os-titlebar-text">OBSERVATION.LOG</h2>
          <div className="os-titlebar-controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="os-term-body">
          <p className="os-term-prompt">
            C:\DPL\LOG&gt; type experiment_{experiment.experimentNo}.txt
          </p>
          <ul>
            {experiment.observations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="os-term-prompt">
            C:\DPL\LOG&gt; note — {experiment.note}
          </p>
          <p className="os-term-prompt os-term-cursor">C:\DPL\LOG&gt; _</p>
        </div>
      </article>

      <article className="os-window os-window-archive">
        <div className="os-titlebar">
          <span className="os-titlebar-icon" aria-hidden="true" />
          <h2 className="os-titlebar-text">ARCHIVE.DB — READ ONLY</h2>
          <div className="os-titlebar-controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="os-archive-toolbar">
          <span>Records {experiment.archive.length}</span>
          <span>Sort: UNSORTED</span>
          <span>Access: PUBLIC</span>
        </div>
        <table className="os-archive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>RESULT</th>
              <th>BREED</th>
              <th>POP</th>
              <th>SIDE EFFECT</th>
            </tr>
          </thead>
          <tbody>
            {experiment.archive.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.result}</td>
                <td>{row.breed}</td>
                <td>{row.popularity}</td>
                <td>{row.sideEffect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <aside className="os-window os-window-tag">
        <div className="os-titlebar">
          <span className="os-titlebar-icon" aria-hidden="true" />
          <h2 className="os-titlebar-text">SUBJECT.TAG</h2>
          <div className="os-titlebar-controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="os-tag-body">
          {experiment.dogs.map((d) => (
            <div key={d.label} className="os-tag-plate">
              <p className="os-tag-id">{d.label}</p>
              <p>
                {d.trait}: {d.traitValue}
              </p>
              <p>LIKES: {d.likes}</p>
              <p>MOOD: {d.mood}</p>
              <p>TREAT: {d.treatDetected ? "YES" : "NO"}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
