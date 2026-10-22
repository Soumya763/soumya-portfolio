"use client";

import { useEffect, useState } from "react";
import { Img, Tag } from "./Media";
import { LOG_SAMPLES } from "@/lib/logSamples";
import { useReducedMotion } from "@/lib/useReducedMotion";

const HERO_LOGS = LOG_SAMPLES.filter((s) => s.id !== "json" && s.id !== "proxy");

/**
 * Hero visual: three layers of the same craft, stacked — the interface a
 * person touches, the contract the model must answer in, and the pipeline
 * that turns raw text into structure. The log layer animates through real
 * Grok field extraction; with reduced motion it shows the final state.
 */
export default function HeroStack() {
  const reduce = useReducedMotion();
  const [{ i, tick }, setAnim] = useState({ i: 0, tick: 0 });
  const step = reduce ? 99 : tick;
  const sample = HERO_LOGS[i];
  const fields = sample.segments.filter((s) => s.f);
  // 1-based order of each field segment, used to light them up in sequence.
  const order: number[] = [];
  let count = 0;
  for (const seg of sample.segments) order.push(seg.f ? ++count : 0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setAnim(({ i: cur, tick: t }) => {
        const len = HERO_LOGS[cur].segments.filter((seg) => seg.f).length;
        return t > len + 4 ? { i: (cur + 1) % HERO_LOGS.length, tick: 0 } : { i: cur, tick: t + 1 };
      });
    }, 520);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="stack" aria-label="Three layers of my work: interface, model contract, data pipeline">
      <div className="stack-phone">
        <p className="layer-label">
          <b>01</b> Interface
        </p>
        <div className="phone">
          <div className="phone-screen">
            <Img
              src="/work/kp-design-chat.webp"
              alt="Konsa Pehnu AI stylist chat screen: the stylist suggests pairing a navy velvet bandhgala with an ivory pocket square."
              width={600}
              height={1360}
              priority
            />
          </div>
        </div>
      </div>

      <div className="stack-contract">
        <p className="layer-label">
          <b>02</b> Model contract
        </p>
        <div className="code">
          <div className="code-head">
            <span>stylist-chat · tool_use</span>
            <span>Claude</span>
          </div>
          <pre>
            <code>
              <span className="c">{"// the model must answer in this shape"}</span>
              {"\n{\n  "}
              <span className="k">reply</span>
              {": "}
              <span className="s">&quot;…&quot;</span>
              {",\n  "}
              <span className="k">items</span>
              {": [{ "}
              <span className="n">wardrobe_item_id</span>
              {", role }],\n  "}
              <span className="k">suggestions</span>
              {": [{ description }]\n}\n"}
              <span className="c">{"// then every id is re-checked against"}</span>
              {"\n"}
              <span className="c">{"// the signed-in user's own wardrobe"}</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="stack-log">
        <p className="layer-label">
          <b>03</b> Data pipeline · Grok parse · {sample.label}
        </p>
        <div className="code" aria-live="off">
          <div className="code-head">
            <span>logstash/pipelines/{sample.pipeline}</span>
            <span>{sample.input}</span>
          </div>
          <p className="parse-line">
            {sample.segments.map((s, n) => {
              if (!s.f) return <span key={n}>{s.t}</span>;
              return (
                <mark key={n} className={step >= order[n] ? "on" : ""}>
                  {s.t}
                </mark>
              );
            })}
          </p>
          <div className="parse-fields">
            {fields.map((s, n) => (
              <span key={s.f} className={step >= n + 1 ? "on" : ""}>
                <i>{s.f}</i> {s.t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Tag kind="design">Screen: design export, implemented in React</Tag>
        </div>
      </div>
    </div>
  );
}
