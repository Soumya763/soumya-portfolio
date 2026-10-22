import type { Metadata } from "next";
import Link from "next/link";
import CaseToc from "@/components/CaseToc";
import { KonsaArchitecture } from "@/components/Diagrams";
import { Browser, Figure, Img, Phone, Tag } from "@/components/Media";
import { OG_IMAGE, SITE_URL, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Konsa Pehnu — AI Personal Stylist · Case study",
  description:
    "Case study: Konsa Pehnu, a Claude-powered personal stylist app built with React, Capacitor, Supabase (PostgreSQL, Storage, Edge Functions) and Auth0, with Row-Level Security and server-side validation of AI output.",
  alternates: SITE_URL ? { canonical: "/work/konsa-pehnu/" } : undefined,
  openGraph: { title: "Konsa Pehnu — AI Personal Stylist · Soumya Singh", type: "article", images: [OG_IMAGE] },
};

const TOC = [
  { id: "intro", label: "Introduction" },
  { id: "problem", label: "The user problem" },
  { id: "experience", label: "Product & UI/UX" },
  { id: "ai", label: "AI styling" },
  { id: "showcase", label: "Visual showcase" },
  { id: "architecture", label: "Architecture" },
  { id: "security", label: "Security & privacy" },
  { id: "learning", label: "Rationale & learning" },
];

export default function KonsaPehnu() {
  return (
    <article className="case-kp">
      <header className="case-hero">
        <div className="wrap">
          <p className="crumbs">
            <Link href="/#work">Selected work</Link>
            <span aria-hidden="true">/</span>
            <span>01</span>
          </p>
          <p className="eyebrow">Case study 01 · AI personal stylist</p>
          <h1 className="display case-title">Konsa Pehnu</h1>
          <p className="case-headline">
            A personal stylist that only recommends <em>what you already own.</em>
          </p>
          <dl className="case-meta">
            <div>
              <dt>Role</dt>
              <dd>Product design, UI/UX and full-stack development</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>Web (Vite + React) · Android via Capacitor</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>React 19 · Capacitor 8 · Supabase (PostgreSQL, Storage, Edge Functions) · Auth0 · Claude API</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <a className="link" href={site.repos.konsaApp} target="_blank" rel="noopener noreferrer">
                  konsapehnu-app
                </a>
                <a className="link" href={site.repos.konsaHome} target="_blank" rel="noopener noreferrer">
                  konsapehnu-homepage
                </a>
              </dd>
            </div>
          </dl>
          <div className="case-hero-media kp-hero-media" data-reveal>
            <Phone src="/work/kp-design-today.webp" alt="Today's Look screen with a curated outfit and outfit elements list" width={439} height={1600} priority />
            <Phone src="/work/kp-design-chat.webp" alt="AI stylist chat screen" width={600} height={1360} priority />
            <Phone src="/work/kp-design-wardrobe.webp" alt="Digital wardrobe grid with category filters" width={539} height={1600} priority />
            <Phone className="hide-sm" src="/work/kp-design-occasion.webp" alt="Styling by occasion screen: wedding, office, date night, festival" width={460} height={1600} />
            <Phone className="hide-sm" src="/work/kp-design-builder.webp" alt="Outfit builder canvas with wardrobe tray and AI Complete button" width={600} height={1360} />
          </div>
          <p style={{ marginTop: 16 }}>
            <Tag kind="design">Design exports · implemented as the React app</Tag>
          </p>
        </div>
      </header>

      <div className="wrap case-body">
        <CaseToc items={TOC} />
        <div>
          {/* A */}
          <section className="chapter" id="intro" aria-labelledby="intro-h">
            <p className="ch-label">A · Introduction</p>
            <h2 id="intro-h" className="display h-m">
              Your wardrobe, <em>understood</em>
            </h2>
            <div className="cols wide-left">
              <div className="prose">
                <p>
                  Konsa Pehnu (Hindi for “what should I wear?”) is a personal styling app built around Indian men&apos;s wardrobes, from office
                  wear and weekend clothes to weddings and festivals. You photograph and catalogue what you own, build and save outfits, browse styling
                  by occasion, and talk to <strong>Konsa</strong>, an AI stylist powered by Claude.
                </p>
                <p>
                  The idea I kept returning to: <strong>a stylist is only useful if it works with what you have.</strong> So the AI is constrained
                  by design. It only receives your wardrobe as data, it must answer in a fixed structure, and the server checks every item it names
                  before the app shows it.
                </p>
                <p>
                  I designed and built the product across two repositories: the app itself (web + Android) and its marketing homepage.
                </p>
              </div>
              <div className="callout">
                <strong>What exists today:</strong> social sign-in, an 11-step style onboarding, wardrobe and outfit CRUD backed by Supabase, image
                upload to Storage, Claude-powered chat and outfit recommendations through Edge Functions, and an Android build.
                <br />
                <br />
                <strong>What doesn&apos;t:</strong> no AI image generation, virtual try-on or body simulation. The homepage lists some of those as
                “coming soon”.
              </div>
            </div>
          </section>

          {/* B */}
          <section className="chapter" id="problem" aria-labelledby="problem-h">
            <p className="ch-label">B · The user problem</p>
            <h2 id="problem-h" className="display h-m">
              A full wardrobe and <em>nothing to wear</em>
            </h2>
            <div className="cols">
              <div className="prose">
                <p>
                  Most people own more combinations than they use. The bottleneck isn&apos;t clothes. It&apos;s the daily decision, made under
                  time pressure, with the whole wardrobe held in memory.
                </p>
                <ul>
                  <li>
                    <strong>Recall:</strong> it&apos;s hard to remember everything you own, so the same few pieces get worn.
                  </li>
                  <li>
                    <strong>Context:</strong> the right outfit depends on the occasion, formality and weather. Indian occasions add range: a
                    mehendi, a sangeet and a client meeting can fall in the same week.
                  </li>
                  <li>
                    <strong>Confidence:</strong> generic advice (“wear a navy blazer”) doesn&apos;t help if you don&apos;t own one.
                  </li>
                </ul>
              </div>
              <div className="prose">
                <p>
                  That framing led to three product principles: <strong>catalogue first</strong> (the wardrobe is the source of truth),{" "}
                  <strong>occasion-led entry points</strong> (start from where you&apos;re going, not from a blank chat), and{" "}
                  <strong>grounded AI</strong> (recommendations are references to your own items, and gaps are clearly marked as suggestions).
                </p>
              </div>
            </div>
            <p className="note-honest">
              <b>Honest note</b>
              <span>
                This is problem framing, not research findings. I haven&apos;t run formal interviews, surveys or usability tests for Konsa Pehnu yet.
                Validating these assumptions with real users is the next step (see H).
              </span>
            </p>
          </section>

          {/* C */}
          <section className="chapter" id="experience" aria-labelledby="exp-h">
            <p className="ch-label">C · Product experience &amp; UI/UX</p>
            <h2 id="exp-h" className="display h-m">
              From first sign-in to a <em>saved look</em>
            </h2>
            <div className="prose">
              <p>
                The app is organised as onboarding, then five main destinations. On phones they sit in a bottom tab bar (Home, Wardrobe, Stylist,
                Outfits, Profile); on desktop the same destinations move into a side nav (<code>DesktopSideNav.jsx</code>). Routes come from{" "}
                <code>src/router.jsx</code>.
              </p>
            </div>
            <div className="block">
              <ol className="journey" aria-label="User journey">
                <li>
                  <b>Sign in</b>Google or Facebook through Auth0. Unconfigured providers say so instead of failing silently.
                  <code>/login</code>
                </li>
                <li>
                  <b>Style profile</b>11 short steps: goals, style identity, closet size, body type, height and weight, and more.
                  <code>/onboarding … /height_weight_profile</code>
                </li>
                <li>
                  <b>Today&apos;s look</b>A daily outfit with its pieces listed, plus “Wear this” and “Shuffle”.
                  <code>/today_s_look</code>
                </li>
                <li>
                  <b>Wardrobe</b>Category filters, item grid, and an add-item flow with photo upload.
                  <code>/digital_wardrobe · /wardrobe_setup</code>
                </li>
                <li>
                  <b>Stylist</b>Chat with quick-reply chips, look cards, regenerate and thumbs up / down.
                  <code>/ai_stylist_chat</code>
                </li>
                <li>
                  <b>Outfits</b>Occasion entry points, an outfit builder canvas, and saved outfits.
                  <code>/styling_by_occasion · /outfit_builder</code>
                </li>
              </ol>
            </div>

            <div className="block screens">
              <Figure kind="build" caption="Social sign-in, the only entry point.">
                <Phone src="/work/kp-app-login.webp" alt="Login screen with Continue with Google, Facebook and Instagram buttons" width={600} height={1298} />
              </Figure>
              <Figure kind="build" caption="Onboarding step 4 of 11: style identity.">
                <Phone src="/work/kp-app-style-identity.webp" alt="Onboarding step asking which style feels most like you, with options like Casual, Minimal, Chic" width={600} height={1298} />
              </Figure>
              <Figure kind="build" caption="Onboarding step 10 of 11: body type, with illustrated choices.">
                <Phone src="/work/kp-app-body-type.webp" alt="Onboarding step asking which body type is closest, with illustrated silhouettes" width={600} height={1298} />
              </Figure>
              <Figure kind="build" caption="Menu: account, wardrobe and app settings in two groups.">
                <Phone src="/work/kp-app-menu.webp" alt="Menu screen listing Style Insights, My Wardrobe, Add New Item, Saved Outfits, Notifications, Settings" width={600} height={1298} />
              </Figure>
            </div>

            <div className="block cols">
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Decisions visible in the build
                </h3>
                <ul>
                  <li>
                    <strong>Hierarchy:</strong> each main screen leads with one question or decision (“Where are you heading today?”, “Today&apos;s
                    Look”), with supporting detail below it.
                  </li>
                  <li>
                    <strong>Feedback:</strong> look cards have Regenerate and thumbs up / down. Login errors show inline. Image uploads show a
                    processing state.
                  </li>
                  <li>
                    <strong>Transparency:</strong> the chat header says <em>“AI stylist · not a human stylist”</em>, so nobody mistakes Konsa for a
                    person.
                  </li>
                  <li>
                    <strong>Consistency:</strong> one shared header across main screens, and the brand gold was aligned with the marketing site
                    (<code>#8b5007 → #b8752e</code>).
                  </li>
                  <li>
                    <strong>Real-device fixes:</strong> the chat input was hidden behind the bottom nav and below the fold on mobile browsers. Both
                    were fixed after testing on actual phones.
                  </li>
                </ul>
              </div>
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Design opportunities <span className="mono" style={{ color: "var(--warn)" }}>proposed</span>
                </h3>
                <ul>
                  <li>
                    <strong>Remove unearned numbers.</strong> Some screens still show placeholder figures from the design stage, such as a
                    “98% match” badge and an estimated wardrobe value. I&apos;d remove them or compute them for real. A confidence score that
                    isn&apos;t calculated undermines trust in the AI.
                  </li>
                  <li>
                    <strong>Shorter onboarding.</strong> 11 steps is a lot before the first value moment. I&apos;d ask only for occasion and style
                    first, and collect the rest progressively when it improves a recommendation.
                  </li>
                  <li>
                    <strong>Contrast audit.</strong> Gold-on-cream labels look elegant but should be checked against WCAG AA at small sizes.
                  </li>
                  <li>
                    <strong>Show grounding in the UI.</strong> Mark which pieces are “from your wardrobe” and which are “suggested to add”. The data
                    already distinguishes them.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* D */}
          <section className="chapter" id="ai" aria-labelledby="ai-h">
            <p className="ch-label">D · AI-powered styling experience</p>
            <h2 id="ai-h" className="display h-m">
              Conversational, but <em>constrained</em>
            </h2>
            <div className="cols wide-left">
              <div className="prose">
                <p>
                  You can start with a quick-reply chip (“What to wear for a Mehendi?”, “Style my blue blazer”) or type freely. Two Supabase Edge
                  Functions power the AI: <code>stylist-chat</code> for conversation and <code>outfits-recommend</code> for complete outfits on Today&apos;s
                  Look and alternates. Both follow the same pattern:
                </p>
                <ul>
                  <li>
                    <strong>Minimal context.</strong> The model receives only style identity, goals and wardrobe items (id, name, category, colour).
                    Email, height, weight, birthday and image URLs are never sent.
                  </li>
                  <li>
                    <strong>Data, not instructions.</strong> Profile, wardrobe and the user&apos;s message are wrapped in tags, and the system prompt
                    says to treat everything inside them as data. This is a guard against prompt injection through an item name or a message.
                  </li>
                  <li>
                    <strong>A fixed output contract.</strong> <code>tool_choice</code> forces a tool call, so the app always gets structured data
                    instead of free text it would have to parse.
                  </li>
                  <li>
                    <strong>Owned vs. suggested.</strong> Pieces the user owns go in <code>items</code> by exact id. Things worth buying go in{" "}
                    <code>suggestions</code> as plain descriptions, never as ids.
                  </li>
                  <li>
                    <strong>Bounded and validated.</strong> Messages are capped at 2,000 characters, items at 6 per answer and outfits at 5. Every
                    returned id is re-checked against the user&apos;s own rows.
                  </li>
                  <li>
                    <strong>Honest failure.</strong> With an empty wardrobe, <code>outfits-recommend</code> returns no outfits instead of inventing
                    one. If the AI is unreachable, chat falls back to the local rule-based engine.
                  </li>
                </ul>
              </div>
              <div style={{ display: "grid", gap: 18 }}>
                <div className="code">
                  <div className="code-head">
                    <span>stylist-chat · system prompt rules</span>
                    <span>excerpt</span>
                  </div>
                  <pre>
                    <code>{`- Only ever reference a wardrobe item by
  its exact "id" field from the <wardrobe>
  list, in the "items" array.
- Never invent, guess, or reuse an id that
  is not present in the <wardrobe> list.
- If the wardrobe has nothing suitable, say
  so plainly in "reply" rather than forcing
  a recommendation.`}</code>
                  </pre>
                </div>
                <Figure kind="build" caption="A real exchange in the running app. With no Supabase keys locally, the reply comes from the built-in rule-based fallback, not Claude.">
                  <div className="phone" style={{ borderRadius: 24 }}>
                    <div className="phone-screen" style={{ aspectRatio: "780 / 908", borderRadius: 18 }}>
                      <Img
                        src="/work/kp-app-chat-live.webp"
                        alt="Chat: the user asks what to wear to a wedding when it might be hot; Konsa suggests an embroidered kurta, sandstone tailored trousers and leather oxfords, noting breathable fabrics for the heat."
                        width={600}
                        height={698}
                      />
                    </div>
                  </div>
                </Figure>
              </div>
            </div>
          </section>

          {/* E */}
          <section className="chapter" id="showcase" aria-labelledby="show-h">
            <p className="ch-label">E · Visual product showcase</p>
            <h2 id="show-h" className="display h-m">
              An editorial, <em>warm</em> visual language
            </h2>
            <div className="prose" style={{ marginBottom: 36 }}>
              <p>
                Cream surfaces, deep maroon actions, and gold accents set in Playfair Display italics. The palette feels like a tailor&apos;s journal
                rather than a tech dashboard. The marketing homepage, a separate React site, carries the same language and introduces the product
                with a video hero.
              </p>
            </div>
            <Figure kind="site" caption="Marketing homepage hero (konsapehnu-homepage), captured from a local run.">
              <Browser url="konsapehnu.com" src="/work/kp-home-hero.webp" alt="Konsa Pehnu homepage: “Your wardrobe. Your personal stylist.” with a man thinking in front of a wardrobe" width={1600} height={1000} />
            </Figure>
            <div className="block">
              <Figure kind="site" caption="Homepage feature carousel presenting the app's screens in device frames.">
                <Browser url="konsapehnu.com/#features" src="/work/kp-home-features.webp" alt="Homepage section “More than a wardrobe” with four phone mockups: AI Wardrobe, Personalized Styling, Indian Occasion Styling, Weather Aware" width={1600} height={1107} />
              </Figure>
            </div>
            <div className="block screens three">
              <Figure kind="design" caption="Styling by occasion: start from where you're going.">
                <Phone src="/work/kp-design-occasion.webp" alt="Where are you heading today? Occasion cards for wedding, office and more" width={460} height={1600} />
              </Figure>
              <Figure kind="design" caption="Outfit builder: drag items onto a canvas, or let the AI complete it.">
                <Phone src="/work/kp-design-builder.webp" alt="Curate Look canvas with a wardrobe tray below and an AI Complete button" width={600} height={1360} />
              </Figure>
              <Figure kind="design" caption="Add to wardrobe: photo upload with processing feedback.">
                <Phone src="/work/kp-design-add.webp" alt="Add to Wardrobe screen with tap to snap or upload and a processing item card" width={600} height={1360} />
              </Figure>
            </div>
            <p className="note-honest">
              <b>About these images</b>
              <span>
                “Design export” screens come from the project&apos;s Google Stitch exports, which the React app was built from. The app&apos;s product
                photos are hosted remotely and couldn&apos;t load in my capture environment, so photo-heavy screens are shown from the exports and
                text-led screens from the running build.
              </span>
            </p>
          </section>

          {/* F */}
          <section className="chapter" id="architecture" aria-labelledby="arch-h">
            <p className="ch-label">F · Technical architecture</p>
            <h2 id="arch-h" className="display h-m">
              Five services, <em>one identity</em>
            </h2>
            <div className="diagram" data-reveal>
              <KonsaArchitecture />
            </div>
            <p className="diagram-note">Drawn from the code in konsapehnu-app. Scroll sideways on small screens.</p>
            <ul className="block cards">
              <li>
                <h3>React + Capacitor</h3>
                <p>One Vite build serves the web and is wrapped as an Android app. Native sign-in opens the system browser and returns via a custom scheme.</p>
                <code>capacitor.config.json · AndroidManifest.xml</code>
              </li>
              <li>
                <h3>Auth0 → Supabase</h3>
                <p>Auth0 handles sign-in. Supabase Third-Party Auth trusts its ID token, so the Auth0 sub is the user id across tables, policies and storage paths.</p>
                <code>src/lib/supabaseClient.js · auth0Client.js</code>
              </li>
              <li>
                <h3>PostgreSQL + Storage</h3>
                <p>Four tables (profiles, wardrobe_items, outfits, outfit_items) and a wardrobe-images bucket, each with ownership policies.</p>
                <code>supabase/schema.sql · migrations/</code>
              </li>
              <li>
                <h3>Edge Functions + Claude</h3>
                <p>Server-side only: the Anthropic key never reaches the client. Functions verify identity, load scoped data, call Claude and validate the answer.</p>
                <code>supabase/functions/stylist-chat · outfits-recommend</code>
              </li>
            </ul>
          </section>

          {/* G */}
          <section className="chapter" id="security" aria-labelledby="sec-h">
            <p className="ch-label">G · Security &amp; privacy</p>
            <h2 id="sec-h" className="display h-m">
              A wardrobe is <em>personal data</em>
            </h2>
            <div className="prose" style={{ marginBottom: 32 }}>
              <p>
                Photos of your clothes, your body type and your height are personal. In an AI product there&apos;s an extra risk: a model that can
                be talked into referencing someone else&apos;s data. I treated access control as a product requirement and enforced it in layers,
                so no single bug exposes another user.
              </p>
            </div>
            <ul className="cards three">
              <li>
                <h3>Authentication</h3>
                <p>Auth0 social login on web and Android. The Edge Functions verify the RS256 token against Auth0&apos;s JWKS: signature, issuer, audience and expiry.</p>
              </li>
              <li>
                <h3>Row-Level Security</h3>
                <p>RLS is enabled on every table. Each policy compares the row owner with the verified token&apos;s sub claim.</p>
                <code>using ((auth.jwt() -&gt;&gt; &apos;sub&apos;) = user_id)</code>
              </li>
              <li>
                <h3>Ownership-scoped CRUD</h3>
                <p>Separate select / insert / update / delete policies. Linking a piece to an outfit requires owning both the outfit and the wardrobe item.</p>
              </li>
              <li>
                <h3>Server-side AI</h3>
                <p>Claude is only called from Edge Functions, using a client scoped to the caller&apos;s token rather than the service role, so RLS stays the backstop.</p>
              </li>
              <li>
                <h3>Wardrobe-ID validation</h3>
                <p>Every id the model returns is re-queried with <code>user_id = caller</code>. Hallucinated or cross-user ids are dropped before the UI sees them.</p>
              </li>
              <li>
                <h3>Isolation verified</h3>
                <p>I signed in as two independent identities and confirmed neither could read or modify the other&apos;s wardrobe or outfits.</p>
              </li>
            </ul>
            <div className="block cols">
              <div className="code">
                <div className="code-head">
                  <span>supabase/schema.sql</span>
                  <span>outfit_items insert policy</span>
                </div>
                <pre>
                  <code>{`create policy "Users can insert own outfit items"
  on public.outfit_items for insert
  with check (
    exists (select 1 from public.outfits o
      where o.id = outfit_id
        and o.user_id = (auth.jwt() ->> 'sub'))
    and exists (select 1 from public.wardrobe_items w
      where w.id = wardrobe_item_id
        and w.user_id = (auth.jwt() ->> 'sub'))
  );`}</code>
                </pre>
              </div>
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  A bug that improved the design
                </h3>
                <p>
                  Auth0 ids look like <code>google-oauth2|1082…</code>, and Supabase Storage rejects <code>|</code> in object keys. A real failed
                  upload showed that every user would have hit this. The fix had to be two-sided: the app writes to a sanitised folder name, and the
                  three storage policies apply the identical <code>replace()</code>, so ownership checks still match. Fixing only the client would
                  have broken the security check.
                </p>
              </div>
            </div>
          </section>

          {/* H */}
          <section className="chapter" id="learning" aria-labelledby="learn-h">
            <p className="ch-label">H · Design rationale &amp; learning</p>
            <h2 id="learn-h" className="display h-m">
              Trade-offs I&apos;d <em>make again</em>, and ones I wouldn&apos;t
            </h2>
            <div className="cols">
              <div className="prose">
                <ul>
                  <li>
                    <strong>Auth0 + Supabase instead of one provider.</strong> It gave reliable social login on Android. The cost was integration
                    work: migrating owner columns from uuid to text, rewriting every policy, and verifying JWTs inside the functions.
                  </li>
                  <li>
                    <strong>Forced tool use over free text.</strong> It costs some conversational flexibility, but buys a UI that can always render
                    the answer, plus a place to validate it.
                  </li>
                  <li>
                    <strong>A rule-based fallback.</strong> It meant writing logic twice, but the app never shows a broken screen and never claims AI
                    ran when it didn&apos;t.
                  </li>
                  <li>
                    <strong>A public-read image bucket.</strong> This was simple and consistent with the other images, but anyone with an image URL
                    can view it. I&apos;d move to a private bucket with signed URLs next.
                  </li>
                </ul>
              </div>
              <div className="prose">
                <h3 className="h-s display" style={{ marginBottom: 14 }}>
                  Next, as recommendations
                </h3>
                <ul>
                  <li>Run short usability sessions on onboarding and the stylist chat before adding features.</li>
                  <li>Show “from your wardrobe” vs. “suggested” directly on look cards.</li>
                  <li>Replace placeholder metrics with computed ones, or remove them.</li>
                  <li>Private storage with signed URLs; automated tests for the RLS policies.</li>
                  <li>Let feedback (thumbs up / down) inform future recommendations.</li>
                </ul>
              </div>
            </div>
            <div className="block">
              <p className="reflection">
                Konsa Pehnu is where I learned that good AI UX is mostly about <em>constraints</em>: what the model sees, what shape it answers in,
                and what the product refuses to show.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Link className="next-case wrap" href="/work/threat-hunting/">
        <span className="mono">Next case study · 02</span>
        <span className="display" style={{ display: "block" }}>
          Threat Hunting &amp; Security Monitoring →
        </span>
      </Link>
    </article>
  );
}
