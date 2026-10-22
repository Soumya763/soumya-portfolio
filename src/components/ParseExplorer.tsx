"use client";

import { useId, useState } from "react";
import { LOG_SAMPLES } from "@/lib/logSamples";

/** Raw line → Grok pattern → normalised document, per real pipeline. */
export default function ParseExplorer() {
  const uid = useId();
  const [i, setI] = useState(0);
  const s = LOG_SAMPLES[i];
  return (
    <div className="px">
      <div className="px-tabs" role="tablist" aria-label="Log source">
        {LOG_SAMPLES.map((l, n) => (
          <button
            key={l.id}
            role="tab"
            type="button"
            id={`${uid}-tab-${n}`}
            aria-selected={i === n}
            aria-controls={`${uid}-panel`}
            onClick={() => setI(n)}
          >
            {l.label}
            <small>{l.input}</small>
          </button>
        ))}
      </div>
      <div className="px-body" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${i}`}>
        <div className="px-pane">
          <p className="px-k">1 · Raw line (sample in the expected format)</p>
          <p className="px-raw">{s.segments.map((seg) => seg.t).join("")}</p>
          <p className="px-k">2 · Pattern from logstash/pipelines/{s.pipeline}</p>
          <p className="px-pattern">
            {s.pattern.split(/(%\{[^}]+\}|\(\?<[^>]+>)/g).map((part, n) =>
              /^(%\{|\(\?<)/.test(part) ? <b key={n}>{part}</b> : <span key={n}>{part}</span>
            )}
          </p>
          <p className="px-rule">{s.rule}</p>
        </div>
        <div className="px-pane">
          <p className="px-k">3 · Normalised document → {s.index}</p>
          <pre className="px-doc">
            {"{\n"}
            {s.doc.map(([k, v], n) => (
              <span key={k}>
                {"  "}
                <span className="key">&quot;{k}&quot;</span>
                {": "}
                <span className={k === "severity" ? `sev-${v}` : undefined}>&quot;{v}&quot;</span>
                {n < s.doc.length - 1 ? ",\n" : "\n"}
              </span>
            ))}
            {"}"}
          </pre>
        </div>
      </div>
    </div>
  );
}
