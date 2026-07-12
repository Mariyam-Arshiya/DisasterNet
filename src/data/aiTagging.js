const TAG_RULES = [
  { tag: "flood", words: ["water", "flood", "rising", "drown", "submerge", "boat"] },
  { tag: "fire", words: ["fire", "smoke", "burn", "flame"] },
  { tag: "medical", words: ["injured", "medical", "trauma", "bleeding", "ambulance", "hurt", "sick"] },
  { tag: "structural", words: ["collapse", "blocked", "building", "bridge", "wall", "roof"] },
  { tag: "rescue", words: ["stranded", "trapped", "stuck", "rescue", "roof"] },
  { tag: "supply-shortage", words: ["water shortage", "food", "supply", "low on", "running low", "blankets"] },
];

export function autoTag(text) {
  const lower = (text || "").toLowerCase();
  const matched = TAG_RULES.filter((r) => r.words.some((w) => lower.includes(w))).map((r) => r.tag);
  return matched.length ? matched : ["unclassified"];
}

// Simple, transparent severity scoring — not a black box. Weighted by
// keyword urgency and corroboration count so it stays explainable (Feature 8).
export function scoreSeverity(text, corroborations = 0) {
  const lower = (text || "").toLowerCase();
  let score = 0.3;
  if (/stranded|trapped|collapse|drown|fire/.test(lower)) score += 0.4;
  if (/urgent|now|immediately|dying|critical/.test(lower)) score += 0.2;
  score += Math.min(corroborations * 0.08, 0.3);
  score = Math.min(score, 0.98);
  if (score >= 0.75) return { level: "critical", score };
  if (score >= 0.55) return { level: "high", score };
  if (score >= 0.35) return { level: "medium", score };
  return { level: "unverified", score };
}

const SUGGESTIONS = {
  flood: "Move to higher ground immediately. Avoid walking or driving through moving water — 15cm can knock over an adult.",
  fire: "Stay low under smoke, cover nose and mouth, and move upwind. Do not re-enter a building for belongings.",
  medical: "Apply pressure to visible bleeding, keep the person still, and flag the nearest medical resource on the map.",
  structural: "Avoid the reported area entirely until a structural clearance is confirmed by a coordinator.",
  rescue: "Signal your location clearly (light, cloth, sound) and conserve phone battery until rescue arrives.",
  "supply-shortage": "Ration remaining supplies and report the shortage so it appears in the fairness-ranked resource queue.",
};

export function suggestionsFor(tags = []) {
  const found = tags.map((t) => SUGGESTIONS[t]).filter(Boolean);
  return found.length ? found : ["No specific hazard detected yet — stay alert and check the live map for nearby updates."];
}
