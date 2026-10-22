"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ------------------------------------------------------------------------
   A deterministic, in-browser re-creation of the *shape* of Konsa Pehnu's
   outfits-recommend flow. No model is called. What it mirrors from the real
   Edge Function: recommend only from the user's own wardrobe, answer in a
   fixed {outfits:[{name, items:[{wardrobe_item_id, role}], reason}]}
   contract, re-validate every id before showing it, and return an honest
   empty result instead of inventing pieces.
   ------------------------------------------------------------------------ */

type Role = "top" | "bottom" | "shoes" | "other";
type Occasion = "office" | "wedding" | "festival" | "date" | "casual";
type Vibe = "minimal" | "indo" | "relaxed";
type Palette = "any" | "neutrals" | "earthy" | "jewel";
type Weather = "mild" | "hot" | "cold" | "rain";

type Item = {
  id: string;
  name: string;
  role: Role;
  color: string;
  palette: Exclude<Palette, "any">;
  formality: number; // 1 relaxed … 5 ceremonial
  occasions: Occasion[];
  vibes: Vibe[];
  warmth: "light" | "mid" | "heavy";
  delicate?: boolean;
  rainproof?: boolean;
};

const WARDROBE: Item[] = [
  { id: "w_01", name: "White linen shirt", role: "top", color: "#f4f1ea", palette: "neutrals", formality: 3, occasions: ["office", "casual", "date"], vibes: ["minimal", "relaxed"], warmth: "light" },
  { id: "w_02", name: "Indigo embroidered kurta", role: "top", color: "#33427a", palette: "jewel", formality: 4, occasions: ["wedding", "festival"], vibes: ["indo"], warmth: "mid" },
  { id: "w_03", name: "Unbleached linen kurta", role: "top", color: "#e6dcc8", palette: "neutrals", formality: 3, occasions: ["festival", "casual"], vibes: ["indo", "minimal"], warmth: "light" },
  { id: "w_04", name: "Sage knit tee", role: "top", color: "#9fae8f", palette: "earthy", formality: 1, occasions: ["casual", "date"], vibes: ["relaxed", "minimal"], warmth: "light" },
  { id: "w_05", name: "Navy velvet bandhgala", role: "top", color: "#1f2a4a", palette: "jewel", formality: 5, occasions: ["wedding", "date"], vibes: ["indo"], warmth: "heavy" },
  { id: "w_06", name: "Navy tailored trousers", role: "bottom", color: "#25304a", palette: "neutrals", formality: 4, occasions: ["office", "date", "wedding"], vibes: ["minimal"], warmth: "mid" },
  { id: "w_07", name: "Sandstone churidar", role: "bottom", color: "#d2bf9c", palette: "earthy", formality: 4, occasions: ["wedding", "festival"], vibes: ["indo"], warmth: "light" },
  { id: "w_08", name: "Olive linen trousers", role: "bottom", color: "#6f7350", palette: "earthy", formality: 2, occasions: ["casual", "festival", "date"], vibes: ["relaxed", "indo"], warmth: "light" },
  { id: "w_09", name: "Dark selvedge denim", role: "bottom", color: "#273246", palette: "neutrals", formality: 2, occasions: ["casual", "date"], vibes: ["relaxed", "minimal"], warmth: "mid" },
  { id: "w_10", name: "Tan leather oxfords", role: "shoes", color: "#a86b3c", palette: "earthy", formality: 4, occasions: ["office", "wedding", "date"], vibes: ["minimal", "indo"], warmth: "mid" },
  { id: "w_11", name: "White leather sneakers", role: "shoes", color: "#f2f0ec", palette: "neutrals", formality: 1, occasions: ["casual", "date"], vibes: ["relaxed", "minimal"], warmth: "mid", rainproof: true },
  { id: "w_12", name: "Brown kolhapuris", role: "shoes", color: "#7a4a2a", palette: "earthy", formality: 3, occasions: ["festival", "wedding", "casual"], vibes: ["indo", "relaxed"], warmth: "light", delicate: true },
  { id: "w_13", name: "Ivory silk pocket square", role: "other", color: "#efe6d2", palette: "neutrals", formality: 5, occasions: ["wedding", "date"], vibes: ["indo", "minimal"], warmth: "light" },
  { id: "w_14", name: "Charcoal rain shell", role: "other", color: "#3b3d40", palette: "neutrals", formality: 1, occasions: ["office", "casual", "date"], vibes: ["minimal", "relaxed"], warmth: "mid", rainproof: true },
];

const OCCASIONS: { v: Occasion; label: string; target: number; edit: string }[] = [
  { v: "office", label: "Office", target: 4, edit: "The Boardroom Edit" },
  { v: "wedding", label: "Wedding", target: 5, edit: "The Shaadi Edit" },
  { v: "festival", label: "Festival", target: 3, edit: "The Festive Edit" },
  { v: "date", label: "Date night", target: 3, edit: "The Evening Edit" },
  { v: "casual", label: "Weekend", target: 1, edit: "The Weekend Edit" },
];
const VIBES: { v: Vibe; label: string }[] = [
  { v: "minimal", label: "Minimal" },
  { v: "indo", label: "Indo-western" },
  { v: "relaxed", label: "Relaxed" },
];
const PALETTES: { v: Palette; label: string }[] = [
  { v: "any", label: "No preference" },
  { v: "neutrals", label: "Neutrals" },
  { v: "earthy", label: "Earthy" },
  { v: "jewel", label: "Jewel tones" },
];
const WEATHER: { v: Weather; label: string }[] = [
  { v: "mild", label: "Mild" },
  { v: "hot", label: "Hot" },
  { v: "cold", label: "Cold" },
  { v: "rain", label: "Rain" },
];

const GAP_TEXT: Record<Role, Record<Occasion, string>> = {
  top: { office: "a pressed shirt in a quiet neutral", wedding: "a kurta or bandhgala with some texture", festival: "a light kurta", date: "a well-fitting shirt or knit", casual: "an easy tee or overshirt" },
  bottom: { office: "tailored trousers", wedding: "a churidar or tailored trousers", festival: "relaxed linen trousers", date: "dark trousers or denim", casual: "chinos or denim" },
  shoes: { office: "leather oxfords or loafers", wedding: "juttis or polished leather shoes", festival: "kolhapuris or juttis", date: "clean leather shoes", casual: "simple sneakers" },
  other: { office: "", wedding: "", festival: "", date: "", casual: "" },
};

type Picked = { item: Item; score: number };
type Result = {
  name: string;
  picked: Picked[];
  reason: string;
  gaps: string[];
  log: { id: string; role: Role; ok: boolean; note: string }[];
  contract: string;
} | { empty: "wardrobe" | "nomatch"; message: string };

function scoreItem(it: Item, occ: Occasion, vibe: Vibe | null, pal: Palette, w: Weather) {
  if (!it.occasions.includes(occ)) return -Infinity; // never force an off-occasion piece
  const target = OCCASIONS.find((o) => o.v === occ)!.target;
  let s = 3 - Math.abs(it.formality - target) * 0.8;
  if (vibe && it.vibes.includes(vibe)) s += 1.5;
  if (pal !== "any" && it.palette === pal) s += 1;
  if (w === "hot") s += it.warmth === "light" ? 1 : it.warmth === "heavy" ? -2.5 : 0;
  if (w === "cold") s += it.warmth === "heavy" ? 1.5 : it.warmth === "light" ? -0.5 : 0;
  if (w === "rain") s += it.delicate ? -3 : it.rainproof ? 1 : 0;
  return s;
}

function recommend(owned: Item[], occ: Occasion, vibe: Vibe | null, pal: Palette, w: Weather, hallucinate: boolean): Result {
  if (!owned.length) {
    return { empty: "wardrobe", message: "Your wardrobe is empty, so there is nothing to recommend from. The real function returns { outfits: [] } here rather than inventing pieces." };
  }
  const roles: Role[] = ["top", "bottom", "shoes", "other"];
  const picked: Picked[] = [];
  const gaps: string[] = [];
  for (const role of roles) {
    const best = owned
      .filter((i) => i.role === role)
      .map((item) => ({ item, score: scoreItem(item, occ, vibe, pal, w) }))
      .filter((p) => p.score > (role === "other" ? 2.5 : 0.5))
      .sort((a, b) => b.score - a.score)[0];
    if (best) picked.push(best);
    else if (GAP_TEXT[role][occ]) gaps.push(GAP_TEXT[role][occ]);
  }
  // Rain shell is only worth adding when it actually rains.
  const filtered = picked.filter((p) => !(p.item.id === "w_14" && w !== "rain"));

  // What the "model" hands back, before validation.
  const proposed: { wardrobe_item_id: string; role: Role; label?: string }[] = filtered.map((p) => ({ wardrobe_item_id: p.item.id, role: p.item.role }));
  if (hallucinate) proposed.push({ wardrobe_item_id: "w_77", role: "shoes", label: "suede chelsea boots" });

  const ownedIds = new Set(owned.map((i) => i.id));
  const log = proposed.map((p) => ({
    id: p.wardrobe_item_id,
    role: p.role,
    ok: ownedIds.has(p.wardrobe_item_id),
    note: ownedIds.has(p.wardrobe_item_id)
      ? WARDROBE.find((i) => i.id === p.wardrobe_item_id)!.name
      : `not in your wardrobe${p.label ? ` (“${p.label}”)` : ""}, dropped`,
  }));

  if (!filtered.length) {
    return { empty: "nomatch", message: "Nothing you own suits this occasion well enough. Rather than forcing a poor match, the stylist says so, and suggests what to add." + (gaps.length ? ` Consider ${gaps.join(", ")}.` : "") };
  }

  const occMeta = OCCASIONS.find((o) => o.v === occ)!;
  const palNote = pal === "any" ? "" : ` kept within your ${PALETTES.find((p) => p.v === pal)!.label.toLowerCase()} preference where your wardrobe allowed`;
  const weatherNote = { mild: "", hot: " Lighter fabrics come first because of the heat.", cold: " Heavier pieces are favoured for the cold.", rain: " Delicate leather is avoided for the rain." }[w];
  const vibeNote = vibe ? `, leaning ${VIBES.find((v) => v.v === vibe)!.label.toLowerCase()}` : "";
  const reason = `Pitched at the formality a ${occMeta.label.toLowerCase()} calls for${vibeNote}${palNote}.${weatherNote}`;

  const contract = JSON.stringify(
    { outfits: [{ name: occMeta.edit, items: proposed.filter((p) => ownedIds.has(p.wardrobe_item_id)).map(({ wardrobe_item_id, role }) => ({ wardrobe_item_id, role })), reason }] },
    null,
    2
  );
  return { name: occMeta.edit, picked: filtered, reason, gaps, log, contract };
}

const STEPS = ["Load your wardrobe (id, name, category, colour only)", "Score each piece against occasion, style, palette, weather", "Shape the answer into the outfits contract", "Re-check every wardrobe_item_id against what you own"];

export default function StyleLab() {
  const uid = useId();
  const [occ, setOcc] = useState<Occasion | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [pal, setPal] = useState<Palette>("any");
  const [weather, setWeather] = useState<Weather>("mild");
  const [owned, setOwned] = useState<Set<string>>(() => new Set(WARDROBE.map((i) => i.id)));
  const [hallucinate, setHallucinate] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(-1);
  const [tab, setTab] = useState<"outfit" | "contract" | "validation">("outfit");
  const outRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState<{ occ: Occasion; vibe: Vibe | null; pal: Palette; weather: Weather; owned: Set<string>; hallucinate: boolean } | null>(null);

  const result = useMemo(() => {
    if (!submitted) return null;
    const items = WARDROBE.filter((i) => submitted.owned.has(i.id));
    return recommend(items, submitted.occ, submitted.vibe, submitted.pal, submitted.weather, submitted.hallucinate);
  }, [submitted]);

  const reduce = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  // Steps light up one by one (instantly with reduced motion).
  const animateSteps = () => {
    window.clearInterval(timer.current);
    if (reduce) {
      setPhase(STEPS.length);
      return;
    }
    setPhase(0);
    let p = 0;
    timer.current = window.setInterval(() => {
      p += 1;
      setPhase(p);
      if (p >= STEPS.length) window.clearInterval(timer.current);
    }, 280);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occ) {
      setError("Choose an occasion first. It sets how formal the outfit needs to be.");
      return;
    }
    setError("");
    setSubmitted({ occ, vibe, pal, weather, owned: new Set(owned), hallucinate });
    setTab(hallucinate ? "validation" : "outfit");
    animateSteps();
    outRef.current?.focus({ preventScroll: true });
  };

  const toggleOwned = (id: string) =>
    setOwned((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const done = phase >= STEPS.length;

  return (
    <div className="lab-grid">
      <form className="panel" onSubmit={submit} noValidate aria-describedby={`${uid}-hint`}>
        <p id={`${uid}-hint`} className="sr-only">
          Choose an occasion and optional preferences, then request an outfit. Results are produced by rules in your browser, not by an AI model.
        </p>
        <fieldset className="field">
          <legend>
            Occasion <span>required</span>
          </legend>
          <div className="seg" role="radiogroup" aria-invalid={!!error} aria-describedby={error ? `${uid}-err` : undefined}>
            {OCCASIONS.map((o) => (
              <label key={o.v}>
                <input type="radio" name={`${uid}-occ`} value={o.v} checked={occ === o.v} onChange={() => { setOcc(o.v); setError(""); }} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="error" id={`${uid}-err`} role="alert">
              {error}
            </p>
          )}
        </fieldset>

        <fieldset className="field">
          <legend>Style direction</legend>
          <div className="seg">
            {VIBES.map((o) => (
              <label key={o.v}>
                <input type="radio" name={`${uid}-vibe`} value={o.v} checked={vibe === o.v} onChange={() => setVibe(o.v)} />
                <span>{o.label}</span>
              </label>
            ))}
            <label>
              <input type="radio" name={`${uid}-vibe`} value="" checked={vibe === null} onChange={() => setVibe(null)} />
              <span>Surprise me</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Colour preference</legend>
          <div className="seg">
            {PALETTES.map((o) => (
              <label key={o.v}>
                <input type="radio" name={`${uid}-pal`} value={o.v} checked={pal === o.v} onChange={() => setPal(o.v)} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Weather</legend>
          <div className="seg">
            {WEATHER.map((o) => (
              <label key={o.v}>
                <input type="radio" name={`${uid}-w`} value={o.v} checked={weather === o.v} onChange={() => setWeather(o.v)} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>
            Sample wardrobe <span>{owned.size} / {WARDROBE.length} owned · tap to remove</span>
          </legend>
          <div className="seg wardrobe">
            {WARDROBE.map((i) => (
              <label key={i.id}>
                <input type="checkbox" checked={owned.has(i.id)} onChange={() => toggleOwned(i.id)} />
                <span>
                  <i className="swatch" style={{ background: i.color }} aria-hidden="true" />
                  {i.name}
                </span>
              </label>
            ))}
          </div>
          {owned.size < WARDROBE.length && (
            <button type="button" className="btn" style={{ marginTop: 12, minHeight: 36 }} onClick={() => setOwned(new Set(WARDROBE.map((i) => i.id)))}>
              Restore all items
            </button>
          )}
        </fieldset>

        <div className="lab-actions">
          <button type="submit" className="btn btn-primary">
            Style me <span className="arr" aria-hidden="true">→</span>
          </button>
          <label className="toggle">
            <input type="checkbox" checked={hallucinate} onChange={(e) => setHallucinate(e.target.checked)} />
            Simulate a model inventing an item
          </label>
        </div>
      </form>

      <div className="panel" ref={outRef} tabIndex={-1} aria-live="polite" aria-busy={!!result && !done}>
        {!result && (
          <div className="empty">
            <strong>No outfit yet</strong>
            Pick an occasion and press <em>Style me</em>. The prototype only ever picks from the sample wardrobe on the left. Remove pieces to see how it copes when the right item is missing.
          </div>
        )}

        {result && (
          <>
            <ol className="steps-run" aria-label="Request steps">
              {STEPS.map((s, n) => (
                <li key={s} className={phase > n ? "done" : ""}>
                  {s}
                </li>
              ))}
            </ol>

            {done && "empty" in result && (
              <div className="empty">
                <strong>{result.empty === "wardrobe" ? "Nothing to style from" : "No honest match"}</strong>
                {result.message}
              </div>
            )}

            {done && !("empty" in result) && (
              <div style={{ marginTop: 24 }}>
                <div className="result-tabs" role="tablist" aria-label="Result views">
                  {(["outfit", "contract", "validation"] as const).map((t) => (
                    <button key={t} role="tab" type="button" aria-selected={tab === t} aria-controls={`${uid}-${t}`} id={`${uid}-tab-${t}`} onClick={() => setTab(t)}>
                      {t === "outfit" ? "Outfit" : t === "contract" ? "Response JSON" : "Validation"}
                    </button>
                  ))}
                </div>

                {tab === "outfit" && (
                  <div className="outfit" role="tabpanel" id={`${uid}-outfit`} aria-labelledby={`${uid}-tab-outfit`}>
                    <p className="outfit-name">{result.name}</p>
                    <ul className="pieces">
                      {result.picked.map(({ item }) => (
                        <li key={item.id}>
                          <span className="role">{item.role}</span>
                          <span>{item.name}</span>
                          <span className="id">{item.id}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="why">{result.reason}</p>
                    {result.gaps.length > 0 && (
                      <p className="gaps">
                        <strong>Not in your wardrobe:</strong> {result.gaps.join("; ")}. Suggested as additions, never presented as pieces you own.
                      </p>
                    )}
                  </div>
                )}

                {tab === "contract" && (
                  <div role="tabpanel" id={`${uid}-contract`} aria-labelledby={`${uid}-tab-contract`}>
                    <div className="code">
                      <div className="code-head">
                        <span>validated response</span>
                        <span>same shape as outfits-recommend</span>
                      </div>
                      <pre>
                        <code>{result.contract}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {tab === "validation" && (
                  <div role="tabpanel" id={`${uid}-validation`} aria-labelledby={`${uid}-tab-validation`}>
                    <ul className="vlog">
                      {result.log.map((l) => (
                        <li key={l.id} className={l.ok ? "ok" : "drop"}>
                          {l.ok ? "✓" : "✕"} {l.id} · {l.role} · {l.note}
                        </li>
                      ))}
                    </ul>
                    <p className="why" style={{ marginTop: 16 }}>
                      In the real app this is <code className="inline-code">validateItems()</code>: every id the model returns is looked up again in the signed-in user&apos;s own rows. Anything not owned, whether hallucinated or injected, is silently dropped.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
