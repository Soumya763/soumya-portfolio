import type { Metadata } from "next";
import Link from "next/link";
import CaseToc from "@/components/CaseToc";
import ParseExplorer from "@/components/ParseExplorer";
import SocConcept from "@/components/SocConcept";
import { ThreatArchitecture, ThreatPipeline } from "@/components/Diagrams";
import { Browser, Figure, Phone, Tag } from "@/components/Media";
import { OG_IMAGE, SITE_URL, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Threat Hunting & Security Monitoring Platform · Case study",
  description:
    "Case study: a multi-pipeline security log platform. Logstash and Grok parse DNS, firewall, Windows, proxy and JSON events into OpenSearch indices; YAML detection rules, alert correlation and a React investigation UI sit on top.",
  alternates: SITE_URL ? { canonical: "/work/threat-hunting/" } : undefined,
  openGraph: { title: "Threat Hunting & Security Monitoring Platform · Soumya Singh", type: "article", images: [OG_IMAGE] },
};

const TOC = [
  { id: "problem", label: "The problem" },
  { id: "pipeline", label: "Data pipeline" },
  { id: "analyst", label: "Analyst experience" },
  { id: "architecture", label: "Architecture" },
  { id: "opportunities", label: "Design opportunities" },
  { id: "demonstrates", label: "What it shows" },
];

export default function ThreatHunting() {
  return (
    <article className="case-th">
      <header className="case-hero">
        <div className="wrap">
          <p className="crumbs">
            <Link href="/#work">Selected work</Link>
            <span aria-hidden="true">/</span>
            <span>02</span>
          </p>
          <p className="eyebrow">Case study 02 · Security data systems</p>
          <h1 className="display case-title">Threat Hunting &amp; Security Monitoring Platform</h1>
          <p className="case-headline">
            From raw syslog to <em>an incident an analyst can act on.</em>
          </p>
          <dl className="case-meta">
            <div>
              <dt>Focus</dt>
              <dd>Pipeline architecture, detection logic, analyst UI</dd>
            </div>
            <div>
              <dt>Ingestion</dt>
              <dd>Logstash 8.15 · Grok · Docker Compose</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>OpenSearch client (opensearch-py) · FastAPI · PostgreSQL · React</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <a className="link" href={site.repos.threat} target="_blank" rel="noopener noreferrer">
                  threat-hunting-security-monitoring-platform
                </a>
              </dd>
            </div>
          </dl>
          <div className="case-hero-media" data-reveal>
            <Figure kind="sample" caption="The real React dashboard, run locally with sample alerts and incidents shaped exactly like the API's responses.">
              <Browser url="localhost · Security Overview" src="/work/th-dashboard.webp" alt="Security Overview dashboard with alert counts, recent alerts and active incidents" width={1600} height={1223} priority />
            </Figure>
          </div>
        </div>
      </header>

      <div className="wrap case-body">
        <CaseToc items={TOC} />
        <div>
          {/* A */}
          <section className="chapter" id="problem" aria-labelledby="p-h">
            <p className="ch-label">A · The problem</p>
            <h2 id="p-h" className="display h-m">
              Many sources, <em>many formats,</em> one question
            </h2>
            <div className="cols">
              <div className="prose">
                <p>
                  A security analyst&apos;s question is simple: <strong>is anything here actually suspicious, and what do I do about it?</strong>{" "}
                  The data behind it isn&apos;t. Firewall, Windows authentication, DNS and proxy logs each arrive as differently shaped text. Searching
                  across them means first agreeing on what “source IP” or “severity” means.
                </p>
                <p>
                  Without that shared structure, analysts end up grepping raw lines. And when detections fire one by one, five alerts from the same
                  attacker look like five separate problems.
                </p>
              </div>
              <div className="callout">
                <strong>What I built:</strong> a pipeline that parses and normalises heterogeneous logs into searchable indices, plus a backend and
                UI that turn rule matches into alerts, group related alerts into incidents, and give analysts a place to investigate.
                <br />
                <br />
                It runs against <strong>synthetic and sample events</strong> (<code className="inline-code">scripts/generate_logs.py</code>). It
                isn&apos;t connected to a production network.
              </div>
            </div>
          </section>

          {/* B */}
          <section className="chapter" id="pipeline" aria-labelledby="pl-h">
            <p className="ch-label">B · Data pipeline</p>
            <h2 id="pl-h" className="display h-m">
              Five inputs, <em>one schema</em>
            </h2>
            <div className="prose" style={{ marginBottom: 32 }}>
              <p>
                <code>logstash/pipelines.yml</code> defines five independent pipelines, one per source, each with its own port. Separate pipelines
                keep a malformed firewall line from affecting DNS parsing, and let each source get its own pattern and rules. Every pipeline
                normalises into shared, dotted field names (<code>source.ip</code>, <code>destination.port</code>, <code>event_category</code>,{" "}
                <code>event_type</code>, <code>severity</code>) and writes to a daily index.
              </p>
            </div>
            <div className="diagram" data-reveal>
              <ThreatPipeline />
            </div>
            <p className="diagram-note">Ports, file names and index patterns are taken from the repository. Scroll sideways on small screens.</p>

            <div className="block">
              <h3 className="h-s display" style={{ marginBottom: 10 }}>
                Try it: how one line becomes a document
              </h3>
              <p className="prose" style={{ marginBottom: 20 }}>
                <span style={{ color: "var(--fg-dim)" }}>
                  The patterns and classification rules below are copied from each pipeline file. The raw lines are samples written in the format each
                  pattern expects.
                </span>
              </p>
              <ParseExplorer />
            </div>

            <div className="block cols">
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Classification at ingest
                </h3>
                <p>
                  Each pipeline adds a first-pass <code>event_type</code> and <code>severity</code> with simple, explainable rules. A denied firewall
                  connection, a failed Windows login, an HTTP error, or a DNS query containing a keyword like <code>c2</code> or{" "}
                  <code>malware</code> is marked medium. Everything else is low. This isn&apos;t threat intelligence; it&apos;s a consistent
                  starting point that detection rules can build on.
                </p>
              </div>
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Running it
                </h3>
                <p>
                  <code>docker-compose.yml</code> starts PostgreSQL 16, Elasticsearch 8.15, Logstash 8.15 (ports 5000–5004) and pgAdmin. The backend
                  talks to the index through <code>opensearch-py</code>: it was migrated from the Elasticsearch client so the same code can target a
                  hosted OpenSearch deployment.
                </p>
              </div>
            </div>
          </section>

          {/* C */}
          <section className="chapter" id="analyst" aria-labelledby="a-h">
            <p className="ch-label">C · Analyst experience &amp; UI/UX</p>
            <h2 id="a-h" className="display h-m">
              Designed around <em>the next action</em>
            </h2>
            <div className="prose" style={{ marginBottom: 32 }}>
              <p>
                The React frontend is organised the way an investigation flows: an <strong>overview</strong> of what needs attention, then lists of{" "}
                <strong>alerts</strong> and <strong>incidents</strong> with severity, status and event-type filters, then <strong>detail pages</strong>{" "}
                where work happens: status changes, assignment, investigation notes, IP reputation and the audit trail.
              </p>
            </div>
            <div className="cols">
              <Figure kind="sample" caption="Alert detail: rule description, MITRE ATT&CK tactic and technique, source index and linked incident.">
                <Browser url="localhost · /alerts/4" src="/work/th-alert-detail.webp" alt="Alert #4 detail page with event type, description, severity, status, assigned analyst, MITRE tactic TA0008 Lateral Movement and technique T1021 Remote Services" width={1600} height={1651} />
              </Figure>
              <Figure kind="sample" caption="Incident detail: two correlated alerts, an investigation note, and actions that require sign-in.">
                <Browser url="localhost · /incidents/1" src="/work/th-incident-detail.webp" alt="Incident #1 detail page with linked alerts, update status, assignment, investigation notes and audit trail sections" width={1600} height={1521} />
              </Figure>
            </div>
            <div className="block cols">
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Interface decisions in the build
                </h3>
                <ul>
                  <li>
                    <strong>Severity first.</strong> Every table leads with a colour-coded severity badge, and status uses a separate badge style, so
                    the two are never confused.
                  </li>
                  <li>
                    <strong>Read-only until signed in.</strong> Anyone can view alerts. Changing status, assigning, adding notes, checking reputation
                    and viewing the audit trail all show an inline “Log in to…” prompt rather than a dead button.
                  </li>
                  <li>
                    <strong>Guided lifecycle.</strong> Status can only move one step forward (or reopen), so the UI never offers a transition the API
                    would reject.
                  </li>
                  <li>
                    <strong>System health in view.</strong> The header and sidebar show API, PostgreSQL and search-index health from <code>/health</code>.
                  </li>
                  <li>
                    <strong>Explicit failure states.</strong> IP reputation reports “not configured”, “rate limited” or “unavailable” instead of
                    silently showing nothing.
                  </li>
                </ul>
              </div>
              <div>
                <div className="lifecycle" aria-label="Status lifecycles">
                  <div className="lc-row">
                    <span className="mono">Alert</span>
                    <span className="lc-state">open</span>
                    <span className="lc-arrow">→</span>
                    <span className="lc-state">acknowledged</span>
                    <span className="lc-arrow">→</span>
                    <span className="lc-state">closed</span>
                  </div>
                  <div className="lc-row">
                    <span className="mono">Incident</span>
                    <span className="lc-state">open</span>
                    <span className="lc-arrow">→</span>
                    <span className="lc-state">investigating</span>
                    <span className="lc-arrow">→</span>
                    <span className="lc-state">resolved</span>
                    <span className="lc-arrow">→</span>
                    <span className="lc-state">closed</span>
                  </div>
                  <p className="diagram-note" style={{ marginTop: 0 }}>
                    One step forward at a time; “open” is always reachable to reopen (<code className="inline-code">services/status_transitions.py</code>).
                  </p>
                </div>
                <div style={{ marginTop: 28, maxWidth: 260 }}>
                  <Figure kind="sample" caption="The dashboard reflows to a single column on phones.">
                    <Phone src="/work/th-mobile.webp" alt="Mobile view of the Security Overview dashboard" width={600} height={1298} />
                  </Figure>
                </div>
              </div>
            </div>
            <p className="note-honest">
              <b>About these screens</b>
              <span>
                The live demo on Vercel and Render couldn&apos;t be reached from my capture environment, so I ran the real frontend locally and served
                it sample alerts and incidents in the exact shape the FastAPI serialisers return. The alerts are built around the repository&apos;s
                actual lateral-movement rule. Users, hosts and timestamps are illustrative.
              </span>
            </p>
          </section>

          {/* D */}
          <section className="chapter" id="architecture" aria-labelledby="ar-h">
            <p className="ch-label">D · Technical architecture</p>
            <h2 id="ar-h" className="display h-m">
              Detection as <em>data,</em> not code
            </h2>
            <div className="diagram" data-reveal>
              <ThreatArchitecture />
            </div>
            <p className="diagram-note">Validated against backend/app (scheduler, detection, correlation, api, services). Scroll sideways on small screens.</p>
            <div className="block cols">
              <div className="code">
                <div className="code-head">
                  <span>threat_hunting_queries/templates/lateral_movement.yaml</span>
                  <span>excerpt</span>
                </div>
                <pre>
                  <code>{`name: "Lateral Movement - Multiple Host
       Logins by Single User"
mitre_tactic: "TA0008 - Lateral Movement"
mitre_technique: "T1021 - Remote Services"
severity: high
index: "events-windows-*"
query:
  bool:
    filter:
      - term: { event_type.keyword: "windows_login" }
      - range: { "@timestamp": { gte: "now-15m" } }
  aggs:
    by_user:
      terms: { field: "username.keyword" }
      aggs:
        distinct_hosts:
          cardinality: { field: "source_name.keyword" }
threshold:
  aggregation: "distinct_hosts"
  min_count: 3`}</code>
                </pre>
              </div>
              <div className="prose">
                <ul>
                  <li>
                    <strong>Logstash + Grok</strong> turn text into fields. <strong>The search index</strong> makes them queryable by time, source
                    and value. <strong>PostgreSQL</strong> holds everything analysts change: alerts, incidents, notes, users and audit logs.
                  </li>
                  <li>
                    <strong>Rules are YAML.</strong> Each one is validated for required fields, run as Query DSL with aggregations, and checked
                    against a threshold. The one shipped rule flags a user logging into 3+ distinct hosts within 15 minutes.
                  </li>
                  <li>
                    <strong>No duplicate alerts.</strong> Each alert description starts with an entity marker (<code>[entity=…]</code>) that
                    doubles as a dedupe key within the rule&apos;s window.
                  </li>
                  <li>
                    <strong>Correlation.</strong> Open, unlinked alerts that share a source IP or event type within 15 minutes are grouped
                    (transitively, using union-find) into one incident, which takes its worst alert&apos;s severity.
                  </li>
                  <li>
                    <strong>Scheduling.</strong> A plain asyncio loop runs detection then correlation, and only sleeps once a cycle finishes, so
                    cycles can never overlap.
                  </li>
                  <li>
                    <strong>Verified.</strong> The pytest suite (20 cases, covering rule execution and threat-intel failure handling) passes locally.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* E */}
          <section className="chapter" id="opportunities" aria-labelledby="o-h">
            <p className="ch-label">E · Design opportunities</p>
            <h2 id="o-h" className="display h-m">
              What exists, and <em>what I&apos;d design next</em>
            </h2>
            <div className="split-status">
              <div className="status-col">
                <h3 className="h-s display">
                  <Tag kind="build">Exists today</Tag>
                </h3>
                <ul>
                  <li>Five Logstash pipelines with Grok parsing, normalisation and first-pass severity</li>
                  <li>YAML hunting rules with MITRE ATT&amp;CK metadata, executed on a schedule</li>
                  <li>Deduplicated alerts and union-find incident correlation</li>
                  <li>Dashboard, alert and incident lists with severity / status / type filters</li>
                  <li>Status lifecycle, assignment, investigation notes and audit trail (JWT-protected)</li>
                  <li>AbuseIPDB reputation lookups with caching and explicit failure states</li>
                </ul>
              </div>
              <div className="status-col proposed">
                <h3 className="h-s display">
                  <Tag kind="concept">Proposed</Tag>
                </h3>
                <ul>
                  <li>Raw-event search in the UI. Today the UI works at alert and incident level, and raw events live in the search index.</li>
                  <li>A timeline per incident, so analysts can see sequence, not just a list.</li>
                  <li>An entity pivot (user → hosts → IPs) that explains why alerts were grouped.</li>
                  <li>Plain-language incident summaries generated from the correlation reason.</li>
                  <li>Triage by severity × age, so stale high-severity work rises to the top.</li>
                  <li>More rules: the firewall and DNS fields are already normalised for them.</li>
                </ul>
              </div>
            </div>
            <div className="block">
              <h3 className="h-s display" style={{ marginBottom: 10 }}>
                Concept: an investigation workspace
              </h3>
              <p className="prose" style={{ marginBottom: 20 }}>
                <span style={{ color: "var(--fg-dim)" }}>
                  A sketch of the proposed raw-event view. It uses the platform&apos;s real event types and field names, but the data is mock and none
                  of this is implemented.
                </span>
              </p>
              <SocConcept />
            </div>
          </section>

          {/* F */}
          <section className="chapter" id="demonstrates" aria-labelledby="d-h">
            <p className="ch-label">F · What this project demonstrates</p>
            <h2 id="d-h" className="display h-m">
              Making complex systems <em>legible</em>
            </h2>
            <div className="cols">
              <div className="prose">
                <ul>
                  <li>
                    <strong>Systems thinking:</strong> designing a multi-stage architecture where each stage has one job and a clear contract with
                    the next.
                  </li>
                  <li>
                    <strong>Structured data:</strong> turning five text formats into one consistent schema that rules and people can both rely on.
                  </li>
                  <li>
                    <strong>Troubleshooting:</strong> the history includes real fixes, such as rewriting the search call when moving from the
                    Elasticsearch to the OpenSearch client, and adding a test to stop that regression coming back.
                  </li>
                  <li>
                    <strong>Information design:</strong> severity-first tables, guided lifecycles, and honest empty and error states.
                  </li>
                </ul>
              </div>
              <p className="reflection">
                Security tools fail people when they&apos;re loud and unclear. This project is my practice at the opposite: <em>quiet, structured and
                explainable.</em>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Link className="next-case wrap" href="/work/konsa-pehnu/">
        <span className="mono">Back to case study · 01</span>
        <span className="display" style={{ display: "block" }}>
          Konsa Pehnu: AI Personal Stylist →
        </span>
      </Link>
    </article>
  );
}
