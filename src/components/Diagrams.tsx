// Architecture diagrams drawn from the repositories' actual code.
// Plain SVG: crisp at any size, themable with CSS, no runtime cost.

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  kind?: "hot" | "store" | "ext";
};

function Node({ x, y, w, h, title, lines = [], kind }: NodeProps) {
  return (
    <g className={`svg-node ${kind ?? ""}`}>
      <rect x={x} y={y} width={w} height={h} rx={6} strokeDasharray={kind === "ext" ? "4 4" : undefined} />
      <text className="svg-t" x={x + 14} y={y + 24}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} className="svg-s" x={x + 14} y={y + 44 + i * 16}>
          {l}
        </text>
      ))}
    </g>
  );
}

function Edge({ d, label, lx, ly, hot, dash }: { d: string; label?: string; lx?: number; ly?: number; hot?: boolean; dash?: boolean }) {
  return (
    <g>
      <path className={`svg-e ${hot ? "hot" : ""} ${dash ? "dash" : ""}`} d={d} markerEnd={`url(#${hot ? "arrH" : "arr"})`} />
      {label && lx !== undefined && ly !== undefined && (
        <text className="svg-lbl" x={lx} y={ly}>
          {label}
        </text>
      )}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-faint)" />
      </marker>
      <marker id="arrH" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

export function KonsaArchitecture() {
  return (
    <svg viewBox="0 0 1100 540" role="img" aria-labelledby="kpa-t kpa-d">
      <title id="kpa-t">Konsa Pehnu architecture</title>
      <desc id="kpa-d">
        A React app, also packaged for Android with Capacitor, signs users in with Auth0. Supabase trusts the Auth0 ID token through Third-Party Auth.
        The app reads and writes PostgreSQL tables and Storage under Row-Level Security policies keyed on the token&apos;s sub claim. AI requests go to
        Supabase Edge Functions, which verify the Auth0 token against its JWKS, load user-scoped data, call the Claude API with a forced tool, and
        re-validate returned wardrobe ids before responding.
      </desc>
      <Defs />
      <rect className="svg-zone" x="20" y="100" width="250" height="330" rx="10" />
      <text className="svg-zone-t" x="36" y="122">Client</text>
      <rect className="svg-zone" x="340" y="140" width="330" height="380" rx="10" />
      <text className="svg-zone-t" x="356" y="162">Supabase</text>

      <Node x={40} y={140} w={210} h={84} title="React 19 app" lines={["Vite · React Router", "wardrobe · outfits · chat"]} />
      <Node x={40} y={316} w={210} h={84} title="Capacitor Android" lines={["same build in a WebView", "custom-scheme login callback"]} />
      <Node x={380} y={20} w={250} h={78} title="Auth0" lines={["Google / Facebook login", "issues RS256 ID token"]} kind="ext" />
      <Node x={360} y={180} w={290} h={96} title="Edge Functions (Deno)" lines={["stylist-chat · outfits-recommend", "verify JWT · scoped reads", "validateItems()"]} kind="hot" />
      <Node x={360} y={316} w={290} h={96} title="PostgreSQL + RLS" lines={["profiles · wardrobe_items", "outfits · outfit_items", "policy: auth.jwt()->>'sub' = user_id"]} kind="store" />
      <Node x={360} y={436} w={290} h={68} title="Storage: wardrobe-images" lines={["writes limited to the user's own folder"]} kind="store" />
      <Node x={850} y={180} w={230} h={96} title="Claude API" lines={["Messages API", "forced tool_choice", "structured JSON back"]} kind="ext" />

      <Edge d="M145 224 L145 312" label="cap sync" lx={154} ly={272} />
      <Edge d="M250 160 C 310 160, 310 60, 376 60" label="login → ID token" lx={262} ly={98} />
      <Edge d="M250 200 L356 216" label="invoke + Bearer" lx={262} ly={196} hot />
      <Edge d="M250 214 C 300 214, 300 350, 356 350" label="CRUD" lx={300} ly={300} />
      <Edge d="M250 228 C 286 228, 286 470, 356 470" label="upload" lx={292} ly={444} />
      <Edge d="M650 228 L846 228" label="tool_use request" lx={690} ly={218} hot />
      <Edge d="M846 252 L654 252" label="validated ids only" lx={690} ly={270} />
      <Edge d="M505 276 L505 312" />
      <text className="svg-lbl" x="514" y="300">user-scoped reads</text>
      <Edge d="M600 180 L600 102" label="verify via JWKS" lx={610} ly={146} dash />
      <Edge d="M630 70 C 780 70, 780 360, 654 360" label="Third-Party Auth trusts token" lx={688} ly={330} dash />
    </svg>
  );
}

const SOURCES = [
  { s: "Firewall syslog", p: "UDP 5001", conf: "firewall_syslog.conf", how: "grok · classify allow/deny", idx: "events-firewall-*" },
  { s: "Windows security", p: "UDP 5002", conf: "windows.conf", how: "grok · login / failed", idx: "events-windows-*" },
  { s: "Web proxy", p: "UDP 5003", conf: "proxy.conf", how: "grok · status ≥ 400", idx: "events-proxy-*" },
  { s: "DNS queries", p: "UDP 5004", conf: "dns.conf", how: "grok · keyword flag", idx: "events-dns-*" },
  { s: "JSON events", p: "TCP 5000", conf: "logstash.config", how: "json codec · tag", idx: "security-events-*" },
];

export function ThreatPipeline() {
  const rowY = (n: number) => 56 + n * 80;
  return (
    <svg viewBox="0 0 1200 470" role="img" aria-labelledby="thp-t thp-d">
      <title id="thp-t">Security log pipeline</title>
      <desc id="thp-d">
        Five sources (firewall, Windows, proxy, DNS on UDP ports 5001 to 5004, and JSON over TCP 5000) each feed their own Logstash pipeline. Four use
        Grok to parse and classify; JSON is already structured. Each pipeline writes to its own daily index, which detection rules query with Query DSL.
      </desc>
      <Defs />
      <text className="svg-zone-t" x="20" y="28">Sources</text>
      <text className="svg-zone-t" x="300" y="28">Logstash 8.15 · pipelines.yml</text>
      <text className="svg-zone-t" x="650" y="28">Daily indices</text>
      <text className="svg-zone-t" x="960" y="28">Search &amp; detection</text>
      {SOURCES.map((r, n) => (
        <g key={r.s}>
          <Node x={20} y={rowY(n) - 12} w={210} h={58} title={r.s} lines={[r.p]} />
          <Node x={300} y={rowY(n) - 12} w={280} h={58} title={r.conf} lines={[r.how]} kind={n < 4 ? "hot" : undefined} />
          <Node x={650} y={rowY(n) - 12} w={240} h={58} title={r.idx} lines={["YYYY.MM.dd"]} kind="store" />
          <Edge d={`M230 ${rowY(n) + 17} L296 ${rowY(n) + 17}`} />
          <Edge d={`M580 ${rowY(n) + 17} L646 ${rowY(n) + 17}`} />
          <Edge d={`M890 ${rowY(n) + 17} C 925 ${rowY(n) + 17}, 925 225, 956 225`} />
        </g>
      ))}
      <Node x={960} y={160} w={220} h={130} title="Query DSL" lines={["YAML hunting rules", "filters + aggregations", "e.g. events-windows-*", "→ alerts in PostgreSQL"]} kind="hot" />
    </svg>
  );
}

export function ThreatArchitecture() {
  return (
    <svg viewBox="0 0 1200 560" role="img" aria-labelledby="tha-t tha-d">
      <title id="tha-t">Threat hunting platform architecture</title>
      <desc id="tha-d">
        Logstash writes normalised events to an OpenSearch-compatible search index. A FastAPI backend runs an asyncio scheduler that loads YAML rules,
        executes them as search queries, turns threshold matches into deduplicated alerts in PostgreSQL, and correlates related alerts into incidents.
        A React dashboard reads alerts and incidents through the REST API; authenticated analysts change status, assign work, add notes and request
        AbuseIPDB reputation lookups, all recorded in an audit log.
      </desc>
      <Defs />
      <rect className="svg-zone" x="20" y="40" width="560" height="150" rx="10" />
      <text className="svg-zone-t" x="36" y="62">Ingestion · Docker Compose</text>
      <rect className="svg-zone" x="20" y="220" width="1160" height="320" rx="10" />
      <text className="svg-zone-t" x="36" y="242">FastAPI backend · Python</text>

      <Node x={40} y={80} w={150} h={84} title="Log sources" lines={["5 inputs", "UDP / TCP"]} />
      <Node x={230} y={80} w={150} h={84} title="Logstash" lines={["Grok · mutate", "normalise · tag"]} kind="hot" />
      <Node x={420} y={80} w={140} h={84} title="Search index" lines={["OpenSearch /", "Elasticsearch"]} kind="store" />
      <Node x={660} y={70} w={240} h={96} title="React dashboard" lines={["Dashboard · Alerts · Incidents", "filters · detail pages", "JWT session"]} />
      <Node x={960} y={70} w={200} h={96} title="AbuseIPDB" lines={["IP reputation", "cached · failure-mapped"]} kind="ext" />

      <Node x={40} y={270} w={220} h={84} title="Scheduler" lines={["asyncio loop", "one cycle at a time"]} />
      <Node x={300} y={270} w={240} h={84} title="Rule loader + executor" lines={["YAML → validate", "search(body=…)"]} kind="hot" />
      <Node x={300} y={410} w={240} h={96} title="Alert generator" lines={["threshold on aggregations", "dedupe by entity marker", "MITRE tactic / technique"]} />
      <Node x={600} y={410} w={250} h={96} title="Correlation engine" lines={["union-find over open alerts", "same source_ip or event_type", "within 15 minutes"]} kind="hot" />
      <Node x={600} y={270} w={250} h={84} title="REST API · /api/v1" lines={["alerts · incidents · notes", "status · assignment · audit"]} />
      <Node x={910} y={340} w={250} h={130} title="PostgreSQL" lines={["alerts · incidents", "investigation_notes", "audit_logs · users", "bcrypt hashes"]} kind="store" />

      <Edge d="M190 122 L226 122" />
      <Edge d="M380 122 L416 122" />
      <Edge d="M260 312 L296 312" label="every N s" lx={226} ly={300} />
      <Edge d="M490 270 L490 168" label="Query DSL" lx={498} ly={226} hot />
      <Edge d="M420 354 L420 406" />
      <Edge d="M540 470 C 570 470, 570 470, 596 470" />
      <Edge d="M850 456 L906 432" />
      <Edge d="M540 440 C 720 400, 820 400, 906 390" label="alerts" lx={720} ly={392} />
      <Edge d="M780 166 L760 266" label="REST + Bearer" lx={780} ly={222} hot />
      <Edge d="M850 312 C 880 312, 880 380, 906 380" />
      <Edge d="M840 270 C 900 230, 980 220, 1040 170" label="reputation lookup" lx={930} ly={224} dash />
    </svg>
  );
}
