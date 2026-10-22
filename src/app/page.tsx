import Link from "next/link";
import HeroStack from "@/components/HeroStack";
import StyleLab from "@/components/StyleLab";
import RequestFlow from "@/components/RequestFlow";
import { Browser, Img, Phone, Tag } from "@/components/Media";
import { asset, site } from "@/lib/site";

const PROCESS = [
  {
    t: "Understand the problem",
    p: "Name the decision the user is actually stuck on, and what would make it easier, before choosing any technology.",
    ev: "Konsa Pehnu started from one everyday question: “what do I wear, from what I already own?”. That framing is why every recommendation is tied to the user’s real wardrobe.",
  },
  {
    t: "Explore approaches",
    p: "Try several directions cheaply, including AI-generated ones, and keep what holds up.",
    ev: "Explored screen directions with Google Stitch, then built the chosen ones as React components with AI coding assistants, reviewing and testing each change myself. On the security side, I chose YAML rule files over hard-coded queries so detections stay readable and reviewable.",
  },
  {
    t: "Structure the experience",
    p: "Decide the routes, the hierarchy and what each screen is responsible for before polishing any of them.",
    ev: "Konsa Pehnu: 11-step onboarding → five-tab app (Home, Wardrobe, Stylist, Outfits, Profile), with a side nav on desktop. Security platform: Dashboard → Alerts → Incidents, with detail pages for each.",
  },
  {
    t: "Design & prototype",
    p: "Get something clickable early, even if the intelligence behind it is temporary.",
    ev: "The stylist chat first ran on a local, wardrobe-aware rule engine. That let me test the conversation design before any API existed, and it stayed on as the honest fallback.",
  },
  {
    t: "Implement & validate",
    p: "Ship in small phases and verify each one: build, browser, data access.",
    ev: "The backend landed in five phases (auth, profile, wardrobe, outfits, AI). I checked cross-user isolation with two separate accounts. The security platform's backend has a 20-case pytest suite.",
  },
  {
    t: "Iterate on evidence",
    p: "Let real failures drive the next change, and write down why.",
    ev: "A real failed upload showed Storage rejects “|” in Auth0 ids, so the fix had to land on both the app and the policy side. On real phones the chat input sat behind the bottom nav; that was fixed too.",
  },
];

const CAPS = [
  {
    h: "AI & product",
    items: [
      ["Claude API integration", "Konsa Pehnu", true],
      ["Structured output via forced tool use", "Konsa Pehnu", true],
      ["Prompt design & injection-aware framing", "Konsa Pehnu", true],
      ["AI-powered app workflows with fallbacks", "Konsa Pehnu", true],
      ["Generative AI · Gemini API", "Also worked with", false],
    ],
  },
  {
    h: "UI/UX & frontend",
    items: [
      ["React (web + Capacitor Android)", "Both projects", true],
      ["Responsive interface development", "Both projects", true],
      ["Interaction & information design", "Both projects", true],
      ["HTML · CSS · JavaScript", "Both projects", true],
      ["Next.js · TypeScript", "This site", true],
    ],
  },
  {
    h: "Engineering",
    items: [
      ["Supabase · PostgreSQL · Storage", "Konsa Pehnu", true],
      ["Authentication & access control (Auth0, JWT, RLS)", "Both projects", true],
      ["REST APIs · FastAPI", "Threat platform", true],
      ["Python", "Threat platform", true],
      ["Java", "Also worked with", false],
    ],
  },
  {
    h: "Data & security",
    items: [
      ["Logstash · Grok parsing", "Threat platform", true],
      ["OpenSearch / Elasticsearch Query DSL", "Threat platform", true],
      ["Log analysis & normalisation", "Threat platform", true],
      ["Detection rules · alert correlation", "Threat platform", true],
      ["Docker Compose", "Threat platform", true],
    ],
  },
] as const;

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div>
            <p className="hero-name">
              <strong>Soumya Singh</strong>
              <span>AI Generalist · Creative Technologist</span>
            </p>
            <h1 id="hero-title" className="display">
              <span className="line">I build AI products</span>
              <span className="line">
                from the <em>interface</em>
              </span>
              <span className="line">
                down to the <em>access policy.</em>
              </span>
            </h1>
            <p className="lede hero-intro">
              I&apos;m a computer science (cyber security) student at SRM University who designs and builds AI-powered products end to end. That means
              the screens people touch, the model integration behind them, and the security that keeps each person&apos;s data their own.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#work">
                Selected work <span className="arr" aria-hidden="true">→</span>
              </a>
              <a className="btn" href="#about">
                About &amp; contact
              </a>
            </div>
            <p className="hero-roles" aria-label="Focus areas">
              <span>AI product design</span>
              <span>UI/UX</span>
              <span>Full-stack</span>
              <span>Security-aware engineering</span>
            </p>
          </div>
          <HeroStack />
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <header className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title" className="display h-l">
                Two projects, <em>one habit:</em> make complex things understandable.
              </h2>
            </div>
            <p className="lede">
              A consumer AI product and a security monitoring system. Both are documented from their actual source code, with every screen labelled by
              where it came from.
            </p>
          </header>

          <article className="work-item work-kp" data-reveal aria-labelledby="kp-title">
            <div className="work-copy">
              <p className="work-index">
                <b>01</b> Featured · AI product · UI/UX
              </p>
              <h3 id="kp-title" className="display work-title">
                Konsa Pehnu
              </h3>
              <p className="lede">
                An AI personal stylist for Indian men&apos;s wardrobes. Catalogue what you own, plan outfits by occasion, and ask a Claude-powered stylist
                that is only allowed to recommend pieces you actually have.
              </p>
              <dl className="work-meta">
                <div>
                  <dt>Role</dt>
                  <dd>Product design &amp; full-stack build</dd>
                </div>
                <div>
                  <dt>Platforms</dt>
                  <dd>Web · Android (Capacitor)</dd>
                </div>
              </dl>
              <ul className="chips" aria-label="Technologies">
                {["React", "Capacitor", "Supabase", "PostgreSQL RLS", "Auth0", "Claude API", "Edge Functions"].map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <Link className="btn btn-primary" href="/work/konsa-pehnu/">
                Read the case study <span className="arr" aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="kp-comp">
              <Browser
                url="konsapehnu.com"
                src="/work/kp-home-hero.webp"
                alt="Konsa Pehnu marketing homepage hero: “Your wardrobe. Your personal stylist.”"
                width={1600}
                height={1000}
              />
              <Phone
                className="p2"
                src="/work/kp-design-wardrobe.webp"
                alt="Konsa Pehnu digital wardrobe screen with clothing items in a grid"
                width={539}
                height={1600}
              />
              <Phone
                className="p1"
                src="/work/kp-design-chat.webp"
                alt="Konsa Pehnu AI stylist chat screen"
                width={600}
                height={1360}
              />
              <div className="comp-tags">
                <Tag kind="site">Homepage · captured locally</Tag>
                <Tag kind="design">App screens · design export</Tag>
              </div>
            </div>
          </article>

          <article className="work-item work-th" data-reveal aria-labelledby="th-title">
            <div className="work-copy">
              <p className="work-index">
                <b>02</b> Systems · Data · Security
              </p>
              <h3 id="th-title" className="display work-title">
                Threat Hunting &amp; Security Monitoring Platform
              </h3>
              <p className="lede">
                A multi-pipeline log platform. Logstash parses DNS, firewall, Windows, proxy and JSON events with Grok and normalises them into
                OpenSearch indices. Detection rules then turn them into alerts and correlated incidents that analysts can investigate.
              </p>
              <dl className="work-meta">
                <div>
                  <dt>Focus</dt>
                  <dd>Pipeline architecture &amp; analyst UX</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>Logstash · OpenSearch · FastAPI · React</dd>
                </div>
              </dl>
              <ul className="chips" aria-label="Technologies">
                {["Logstash", "Grok", "OpenSearch", "Docker Compose", "FastAPI", "PostgreSQL", "React"].map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <Link className="btn" href="/work/threat-hunting/">
                Read the case study <span className="arr" aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="th-comp">
              <Browser
                url="localhost · threat-hunting dashboard"
                src="/work/th-dashboard.webp"
                alt="Security Overview dashboard with alert and incident counts, a recent alerts table and an active incidents table"
                width={1600}
                height={1223}
              />
              <ol className="pipe-mini" aria-label="Pipeline stages">
                <li>
                  <b>5</b>sources
                </li>
                <li>
                  <b>Logstash</b>ingest
                </li>
                <li>
                  <b>Grok</b>parse
                </li>
                <li>
                  <b>Index</b>OpenSearch
                </li>
                <li>
                  <b>Rules</b>detect
                </li>
              </ol>
              <div>
                <Tag kind="sample">Real UI · sample data · run locally</Tag>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* AI LAB */}
      <section className="section lab" id="lab" aria-labelledby="lab-title">
        <div className="wrap">
          <header className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">AI Lab · interactive prototype</p>
              <h2 id="lab-title" className="display h-l">
                A stylist that <em>can&apos;t</em> invent your clothes
              </h2>
            </div>
            <div className="lab-note">
              <p>
                <strong>What this is:</strong> a small, rule-based prototype of Konsa Pehnu&apos;s outfit workflow. It runs entirely in your browser
                and <strong>does not call Claude or any other model</strong>.
              </p>
              <p>
                <strong>What it mirrors from the real app:</strong> recommendations come only from the wardrobe you own, the answer uses the same
                response shape, every returned ID is re-checked, and when nothing fits it says so instead of making something up.
              </p>
            </div>
          </header>
          <div data-reveal>
            <StyleLab />
          </div>
        </div>
      </section>

      {/* TECHNICAL THINKING */}
      <section className="section" id="thinking" aria-labelledby="thinking-title">
        <div className="wrap">
          <header className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Technical thinking</p>
              <h2 id="thinking-title" className="display h-l">
                Where design decisions <em>become</em> engineering ones
              </h2>
            </div>
            <p className="lede">
              One stylist request in Konsa Pehnu, step by step. Each choice is about trust: the UI never shows something the server hasn&apos;t
              checked, and the model only ever sees what it needs.
            </p>
          </header>
          <div data-reveal>
            <RequestFlow />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process" aria-labelledby="process-title">
        <div className="wrap">
          <header className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Design process</p>
              <h2 id="process-title" className="display h-l">
                How I work, <em>with receipts</em>
              </h2>
            </div>
            <p className="lede">
              Six steps I try to follow. Each one is paired with something that actually happened in these projects. I haven&apos;t run formal
              usability studies yet; the evidence here is build history and real bugs.
            </p>
          </header>
          <ol className="process" data-reveal>
            {PROCESS.map((s, n) => (
              <li key={s.t}>
                <span className="num" aria-hidden="true">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
                <p className="ev">
                  <b>In practice</b>
                  {s.ev}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section" id="capabilities" aria-labelledby="caps-title">
        <div className="wrap">
          <header className="sec-head" data-reveal>
            <div>
              <p className="eyebrow">Skills &amp; capabilities</p>
              <h2 id="caps-title" className="display h-l">
                What I build with, and <em>where you can see it</em>
              </h2>
            </div>
            <p className="legend">
              <span>
                <i>Project name</i> · used in a project shown on this site
              </span>
              <span>“Also worked with” · used outside these case studies</span>
            </p>
          </header>
          <div className="caps" data-reveal>
            {CAPS.map((c) => (
              <div className="cap" key={c.h}>
                <h3>{c.h}</h3>
                <ul>
                  {c.items.map(([name, where, used]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <small className={used ? "used" : undefined}>{where}</small>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about" aria-labelledby="about-title">
        <div className="wrap about">
          <figure className="portrait" data-reveal>
            <Img src="/soumya-singh.webp" alt="Portrait of Soumya Singh outdoors, smiling, wearing a purple top and a university ID lanyard." width={394} height={550} />
            <figcaption>Soumya Singh · SRM University</figcaption>
          </figure>
          <div data-reveal>
            <p className="eyebrow">About</p>
            <h2 id="about-title" className="display h-l">
              Hi, I&apos;m Soumya.
            </h2>
            <div className="prose" style={{ marginTop: 28 }}>
              <p>
                I study Computer Science Engineering with a specialisation in Cyber Security at SRM University. I like products where technology
                disappears into something useful: a quick answer to “what should I wear?”, or a clear incident view instead of thousands of log lines.
              </p>
              <p>
                I&apos;m happiest moving between layers. I design and build the interface, connect an AI model so it behaves predictably, shape the
                backend and data model, and think through who is allowed to see what. My security background shapes how I design: I treat access
                control and data minimisation as part of the user experience, not an afterthought.
              </p>
              <p>
                Right now I&apos;m looking for an AI generalist or AI product design role where I can keep doing all of that on a team.
              </p>
            </div>
            <dl className="facts">
              <div>
                <dt>Education</dt>
                <dd>
                  {site.education.degree}
                  <br />
                  {site.education.school} · {site.education.years}
                </dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>AI product experiences · UI/UX · full-stack · security-aware engineering</dd>
              </div>
              <div>
                <dt>Hackathons</dt>
                <dd>Smart India Hackathon 2025 (front-end developer) · 24-hour Cyberthon 2025</dd>
              </div>
              <div>
                <dt>Programs</dt>
                <dd>Quantumease Technology internship (cyber security fundamentals) · PwC Launchpad virtual program (generative AI, data systems)</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact" aria-labelledby="contact-title">
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            Contact
          </p>
          <h2 id="contact-title" className="display contact-title" data-reveal>
            Let&apos;s build something
            <br />
            <em>people can trust.</em>
          </h2>
          <ul className="contact-rows" data-reveal>
            <li>
              <a href={`mailto:${site.email}`}>
                <span className="k">Email</span>
                <span className="v">{site.email}</span>
                <span className="go" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                <span className="k">LinkedIn</span>
                <span className="v">linkedin.com/in/soumya04</span>
                <span className="go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                <span className="k">GitHub</span>
                <span className="v">github.com/Soumya763</span>
                <span className="go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href={asset(site.links.resume)} target="_blank" rel="noopener noreferrer">
                <span className="k">Resume · PDF</span>
                <span className="v">View résumé</span>
                <span className="go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
