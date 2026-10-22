"use client";

import { useId, useState } from "react";

// Each step corresponds to real code in Soumya763/konsapehnu-app.
const STEPS = [
  {
    t: "Ask from the app",
    w: "React · Capacitor (web + Android)",
    file: "src/lib/stylist.js",
    body: "The chat calls supabase.functions.invoke('stylist-chat', { body: { message } }). If Supabase isn't configured or the call fails, the app falls back to its local rule-based replies, so the screen never breaks and never pretends real AI ran.",
    code: `const { data, error } = await supabase.functions
  .invoke('stylist-chat', { body: { message } })
if (error || typeof data?.reply !== 'string')
  throw error            // → generateReply(message)`,
  },
  {
    t: "Attach identity",
    w: "Auth0 ID token",
    file: "src/lib/supabaseClient.js",
    body: "Sign-in is Auth0 (Google / Facebook via Universal Login, with a custom-scheme callback on Android). supabase-js is given an accessToken callback that returns the Auth0 ID token, the token that carries the role claim Supabase's Third-Party Auth requires.",
    code: `createClient(url, anonKey, {
  accessToken: async () =>
    (await auth0Client.getIdTokenClaims())?.__raw
})`,
  },
  {
    t: "Verify on the server",
    w: "Supabase Edge Function · jose + JWKS",
    file: "supabase/functions/_shared/stylistData.ts",
    body: "Supabase's own auth.getUser() rejects Auth0's RS256 tokens, so the function verifies the JWT itself against Auth0's public JWKS (signature, issuer, audience, expiry) and uses the sub claim as the user id. Nothing in the request body is trusted for identity.",
    code: `const { payload } = await jwtVerify(token, AUTH0_JWKS,
  { issuer: AUTH0_ISSUER, audience: AUTH0_AUDIENCE })
return { id: payload.sub }`,
  },
  {
    t: "Load only what's needed",
    w: "PostgreSQL with Row-Level Security",
    file: "stylistData.ts · loadProfileSummary / loadWardrobe",
    body: "Queries run through a client carrying the caller's own JWT (not the service-role key), so RLS still applies. The model gets style identity and goals plus wardrobe id, name, category and colour. Email, height, weight, birthday and image URLs are deliberately left out.",
    code: `supabase.from('wardrobe_items')
  .select('id, name, category, color')
  .eq('user_id', userId)`,
  },
  {
    t: "Ask Claude for a contract",
    w: "Claude API · forced tool use",
    file: "supabase/functions/stylist-chat/index.ts",
    body: "Profile, wardrobe and message are wrapped in <profile>, <wardrobe> and <user_message> tags, and the system prompt says to treat them as data, never instructions. tool_choice forces provide_style_recommendation, so the reply always comes back as structured { reply, items, suggestions }.",
    code: `tools: [RECOMMENDATION_TOOL],
tool_choice: { type: 'tool',
  name: 'provide_style_recommendation' }`,
  },
  {
    t: "Re-validate every id",
    w: "validateItems()",
    file: "stylistData.ts · validateItems",
    body: "The model's answer is not trusted either. Roles are checked against an allow-list, lists are capped, and every wardrobe_item_id is looked up again, scoped to this user. A hallucinated or injected id that isn't theirs is dropped before anything reaches the UI.",
    code: `.from('wardrobe_items').select('id')
  .eq('user_id', userId).in('id', ids)
// keep only ids that came back`,
  },
  {
    t: "Render the look",
    w: "Chat reply + look cards",
    file: "src/pages/main/AiStylistChat.jsx",
    body: "The app joins the validated ids with the user's wardrobe to render look cards with real names and photos. Suggestions for things the user doesn't own stay plain text, so the app never implies they already own them.",
    code: `items: [{ wardrobe_item_id, role }]   // owned
suggestions: [{ description }]       // to buy`,
  },
];

export default function RequestFlow() {
  const [i, setI] = useState(0);
  const uid = useId();
  const s = STEPS[i];
  return (
    <div className="flow">
      <div role="tablist" aria-label="Request steps" aria-orientation="vertical">
        <ol className="flow-steps">
          {STEPS.map((step, n) => (
            <li key={step.t}>
              <button
                role="tab"
                type="button"
                id={`${uid}-t${n}`}
                aria-selected={i === n}
                aria-controls={`${uid}-panel`}
                onClick={() => setI(n)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const nx = Math.min(n + 1, STEPS.length - 1);
                    setI(nx);
                    document.getElementById(`${uid}-t${nx}`)?.focus();
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const nx = Math.max(n - 1, 0);
                    setI(nx);
                    document.getElementById(`${uid}-t${nx}`)?.focus();
                  }
                }}
              >
                <span className="n">{String(n + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t">{step.t}</span>
                  <span className="w">{step.w}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="flow-detail" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-t${i}`}>
        <p className="mono" style={{ color: "var(--fg-faint)" }}>
          Step {i + 1} of {STEPS.length} · {s.file}
        </p>
        <h3 className="h-s display">{s.t}</h3>
        <div className="prose">
          <p>{s.body}</p>
        </div>
        <div className="code">
          <div className="code-head">
            <span>{s.file}</span>
            <span>simplified excerpt</span>
          </div>
          <pre>
            <code>{s.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
