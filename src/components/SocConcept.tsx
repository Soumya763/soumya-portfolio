"use client";

import { useMemo, useState } from "react";
import { Tag } from "./Media";

/* PROPOSED CONCEPT with MOCK DATA. Not part of the implemented platform.
   It explores how raw-event investigation could sit next to the existing
   alert and incident views: source filters, a severity timeline, and an
   entity pivot that explains why an event matters. */

type Src = "firewall" | "windows" | "dns" | "proxy";
type Ev = { t: string; src: Src; sev: "low" | "medium" | "high"; type: string; entity: string; ip: string; host: string };

const EVENTS: Ev[] = [
  { t: "09:02", src: "windows", sev: "low", type: "windows_login", entity: "admin.temp", ip: "10.0.4.23", host: "WS-FIN-02" },
  { t: "09:04", src: "windows", sev: "low", type: "windows_login", entity: "admin.temp", ip: "10.0.4.23", host: "WS-FIN-03" },
  { t: "09:05", src: "firewall", sev: "medium", type: "firewall_connection_denied", entity: "10.0.4.23", ip: "10.0.4.23", host: "FW-CORE-01" },
  { t: "09:06", src: "windows", sev: "low", type: "windows_login", entity: "admin.temp", ip: "10.0.4.23", host: "WS-HR-01" },
  { t: "09:07", src: "dns", sev: "medium", type: "dns_query_suspicious", entity: "c2-server.com", ip: "10.0.4.23", host: "NS-01" },
  { t: "09:09", src: "windows", sev: "medium", type: "windows_login_failed", entity: "admin.temp", ip: "10.0.4.23", host: "WS-OPS-04" },
  { t: "09:10", src: "proxy", sev: "medium", type: "proxy_request_error", entity: "downloads.example.org", ip: "10.0.4.31", host: "PRX-01" },
  { t: "09:12", src: "windows", sev: "high", type: "rule: lateral movement", entity: "admin.temp", ip: "10.0.4.23", host: "4 distinct hosts" },
];
const COUNTS: Record<Src, number[]> = {
  firewall: [2, 3, 2, 4, 3, 5, 6, 4, 3, 2, 3, 4],
  windows: [1, 1, 2, 1, 1, 2, 4, 6, 5, 2, 1, 1],
  dns: [3, 2, 3, 2, 3, 2, 3, 5, 3, 2, 3, 2],
  proxy: [1, 2, 1, 1, 2, 1, 2, 2, 3, 1, 1, 2],
};
const COLORS: Record<Src, string> = { firewall: "#86b3d1", windows: "#e7b65a", dns: "#b59ad9", proxy: "#7dc59a" };

export default function SocConcept() {
  const [on, setOn] = useState<Set<Src>>(new Set(["firewall", "windows", "dns", "proxy"]));
  const [sel, setSel] = useState(7);
  const rows = useMemo(() => EVENTS.map((e, i) => ({ ...e, i })).filter((e) => on.has(e.src)), [on]);
  const max = Math.max(...COUNTS.firewall.map((_, i) => (Object.keys(COUNTS) as Src[]).reduce((a, s) => a + COUNTS[s][i], 0)));
  const picked = EVENTS[sel];
  const toggle = (s: Src) =>
    setOn((cur) => {
      const n = new Set(cur);
      if (n.has(s)) {
        if (n.size > 1) n.delete(s);
      } else n.add(s);
      return n;
    });

  return (
    <div className="concept" role="region" aria-label="Concept: investigation workspace, mock data">
      <div className="concept-top">
        <Tag kind="concept">Concept · mock data · not implemented</Tag>
        <p>Interactive sketch: filter sources and click a row to pivot.</p>
      </div>
      <div className="cd">
        <div className="cd-panel">
          <p className="cd-h">Event sources</p>
          <div className="cd-filter">
            {(Object.keys(COLORS) as Src[]).map((s) => (
              <button key={s} type="button" aria-pressed={on.has(s)} onClick={() => toggle(s)}>
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}>
                  <i style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[s] }} aria-hidden="true" />
                  {s}
                </span>
                <span>{COUNTS[s].reduce((a, b) => a + b, 0)}</span>
              </button>
            ))}
          </div>
          <p className="cd-h" style={{ marginTop: 18 }}>
            Severity
          </p>
          <div className="cd-legend" style={{ marginTop: 0 }}>
            <span>
              <i className="sev sev-high" />
              high
            </span>
            <span>
              <i className="sev sev-medium" />
              medium
            </span>
            <span>
              <i className="sev sev-low" />
              low
            </span>
          </div>
        </div>

        <div className="cd-panel">
          <p className="cd-h">Events per minute · 09:00 – 09:12 (mock)</p>
          <div className="cd-timeline" aria-hidden="true">
            {COUNTS.firewall.map((_, i) => (
              <div className="bar" key={i}>
                {(Object.keys(COUNTS) as Src[])
                  .filter((s) => on.has(s))
                  .map((s) => (
                    <i key={s} style={{ height: `${(COUNTS[s][i] / max) * 100}px`, background: COLORS[s], opacity: 0.85 }} />
                  ))}
              </div>
            ))}
          </div>
          <div className="cd-axis" aria-hidden="true">
            <span>09:00</span>
            <span>09:06</span>
            <span>09:12</span>
          </div>
          <div className="table-scroll">
            <table className="cd-table">
              <caption className="sr-only">Mock events, filtered by source</caption>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Source</th>
                  <th scope="col">Event type</th>
                  <th scope="col">Entity</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.i} data-sel={sel === e.i} onClick={() => setSel(e.i)}>
                    <td>{e.t}</td>
                    <td>{e.src}</td>
                    <td>
                      <span className={`sev sev-${e.sev}`} aria-label={`${e.sev} severity`} />
                      <button
                        type="button"
                        onClick={() => setSel(e.i)}
                        style={{ background: "none", border: 0, color: "inherit", font: "inherit", padding: 0, cursor: "pointer" }}
                      >
                        {e.type}
                      </button>
                    </td>
                    <td>{e.entity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cd-panel cd-pivot" aria-live="polite">
          <p className="cd-h">Pivot · selected event</p>
          <dl>
            <div>
              <dt>Event</dt>
              <dd>{picked.type}</dd>
            </div>
            <div>
              <dt>Entity</dt>
              <dd>{picked.entity}</dd>
            </div>
            <div>
              <dt>Source IP</dt>
              <dd>{picked.ip}</dd>
            </div>
            <div>
              <dt>Host</dt>
              <dd>{picked.host}</dd>
            </div>
          </dl>
          <p className="why">
            {picked.ip === "10.0.4.23"
              ? "Same source IP appears across Windows logins, a denied firewall connection and a suspicious DNS query within 10 minutes. A plain-language summary like this is what the concept proposes to generate from the correlation rules."
              : "No other events share this source IP in the window. The concept would say so explicitly, so an analyst can close it quickly."}
          </p>
        </div>
      </div>
    </div>
  );
}
