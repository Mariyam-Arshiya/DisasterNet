import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ShieldAlert, GitBranch, Sparkles, ArrowRight } from "lucide-react";
import { C } from "../theme";
import { useCountUp } from "../hooks/useCountUp";

const STEP_MS = 4600;

const STEPS = [
  { id: "problem", kind: "problem" },
  { id: "unverified", kind: "trust", trust: 22, reportCount: 1 },
  { id: "corroborating", kind: "trust", trust: 58, reportCount: 2 },
  { id: "trusted", kind: "trust", trust: 91, reportCount: 4 },
  { id: "reorder", kind: "fairness" },
  { id: "explain", kind: "explain" },
  { id: "close", kind: "close" },
];

export default function ScenarioDemo({ onClose }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => setI((p) => Math.min(p + 1, STEPS.length - 1)), []);
  const back = useCallback(() => setI((p) => Math.max(p - 1, 0)), []);

  useEffect(() => {
    if (paused || i === STEPS.length - 1) return;
    timerRef.current = setTimeout(next, STEP_MS);
    return () => clearTimeout(timerRef.current);
  }, [i, paused, next]);

  const step = STEPS[i];

  return (
    <div style={styles.backdrop} className="dn-backdrop-in">
      <div style={styles.frame}>
        {/* story-style progress segments */}
        <div style={styles.progressRow}>
          {STEPS.map((s, idx) => (
            <div key={s.id} style={styles.segTrack}>
              <div style={{ ...styles.segFill, width: idx < i ? "100%" : idx === i ? "100%" : "0%", transition: idx === i ? `width ${STEP_MS}ms linear` : "none" }} />
            </div>
          ))}
        </div>

        <button onClick={onClose} style={styles.closeBtn}><X size={20} color={C.fog} /></button>

        <div style={styles.tapZones}>
          <div onClick={back} style={{ ...styles.tapZone, left: 0 }} />
          <div onClick={() => setPaused((p) => !p)} style={{ ...styles.tapZone, left: "30%", width: "40%" }} />
          <div onClick={next} style={{ ...styles.tapZone, right: 0 }} />
        </div>

        <div style={styles.content}>
          {step.kind === "problem" && <ProblemStep />}
          {step.kind === "trust" && <TrustStep trust={step.trust} reportCount={step.reportCount} />}
          {step.kind === "fairness" && <FairnessStep />}
          {step.kind === "explain" && <ExplainStep />}
          {step.kind === "close" && <CloseStep onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function ProblemStep() {
  return (
    <div className="dn-fadein-up" style={{ textAlign: "center", maxWidth: 420 }}>
      <ShieldAlert size={30} color={C.red} style={{ marginBottom: 18 }} />
      <h2 style={styles.h2}>Every disaster app collects reports.</h2>
      <p style={styles.body}>None of them know which ones are <em>true</em>, and almost none send help to whoever's waited longest instead of whoever's closest.</p>
      <p style={{ ...styles.body, color: C.fog, fontSize: 13, marginTop: 18 }}>Watch what DisasterNet does differently — 30 seconds, no clicking required.</p>
    </div>
  );
}

function TrustStep({ trust, reportCount }) {
  const animated = useCountUp(trust);
  const color = trust >= 75 ? C.green : trust >= 45 ? C.amber : C.red;
  const label = trust >= 75 ? "Trusted — routed to responders" : trust >= 45 ? "Corroborating — under review" : "Unverified — just submitted";

  return (
    <div className="dn-fadein-up" style={{ width: "100%", maxWidth: 420 }}>
      <div style={styles.tagRow}><GitBranch size={13} color={C.mesh || C.green} /> <span style={styles.tag}>TRUST-WEIGHTED REPORT GRAPH</span></div>
      <h2 style={styles.h2}>"Unverified: bridge collapse near OMR"</h2>
      <p style={{ ...styles.body, marginBottom: 22 }}>
        {reportCount === 1 && "A report just came in. No one else has seen this yet."}
        {reportCount === 2 && "A second, independent report just arrived nearby — the graph is recalculating trust live."}
        {reportCount >= 4 && "Four corroborating reports from different reporters near the same location. Trust score is no longer a guess."}
      </p>
      <div style={styles.trustBarTrack}>
        <div style={{ ...styles.trustBarFill, width: `${animated}%`, background: color, transition: "background 0.4s ease" }} />
      </div>
      <div style={styles.rowBetween}>
        <span style={{ fontSize: 26, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{Math.round(animated)}%</span>
        <span style={{ fontSize: 12.5, color: C.fog }}>{reportCount} corroborating report{reportCount > 1 ? "s" : ""}</span>
      </div>
      <p style={{ fontSize: 12, color, marginTop: 10, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 11.5, color: C.fog, marginTop: 14, lineHeight: 1.5 }}>
        This runs as a live graph query in Neo4j — not a spam filter checked once, a score that keeps updating as the graph grows.
      </p>
    </div>
  );
}

function FairnessStep() {
  const [reordered, setReordered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReordered(true), 900); return () => clearTimeout(t); }, []);

  const items = [
    { id: "d3", need: "Blankets — 50 units", wait: 1, fairness: 41 },
    { id: "d1", need: "Drinking water — 200L", wait: 6, fairness: 68 },
    { id: "d4", need: "Boat — evacuation", wait: 8, fairness: 97 },
  ];
  const ordered = reordered ? [...items].sort((a, b) => b.fairness - a.fairness) : items;

  return (
    <div className="dn-fadein-up" style={{ width: "100%", maxWidth: 420 }}>
      <div style={styles.tagRow}><Sparkles size={13} color={C.amber} /> <span style={{ ...styles.tag, color: C.amber }}>FAIRNESS-AWARE RESOURCE ROUTER</span></div>
      <h2 style={styles.h2}>Nearest-first would send help to Blankets first.</h2>
      <p style={{ ...styles.body, marginBottom: 18 }}>DisasterNet ranks by unmet need instead — the boat request has waited 8 hours and jumps to the top.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ordered.map((it, idx) => (
          <div key={it.id} style={{ ...styles.resourceRow, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", borderColor: idx === 0 && reordered ? C.amber : C.line }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: idx === 0 && reordered ? C.amber : C.fog, width: 20 }}>#{idx + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>{it.need}</div>
              <div style={{ fontSize: 11, color: C.fog }}>Waiting {it.wait}h</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{it.fairness}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExplainStep() {
  return (
    <div className="dn-fadein-up" style={{ width: "100%", maxWidth: 420 }}>
      <div style={styles.tagRow}><GitBranch size={13} color={C.fog} /> <span style={styles.tag}>EXPLAINABLE ALLOCATION TRAIL</span></div>
      <h2 style={styles.h2}>Coordinators see why, not just what.</h2>
      <div style={styles.explainCard}>
        <ExplainRow label="Severity" value="0.95" width={95} />
        <ExplainRow label="Unmet-need duration" value="8h waiting" width={80} />
        <ExplainRow label="Recent allocations to this cluster" value="0" width={5} />
        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 10, paddingTop: 10, fontSize: 13, color: C.ink, fontWeight: 700 }}>
          → Routed first. Not a black-box score — every factor is visible.
        </div>
      </div>
    </div>
  );
}

function ExplainRow({ label, value, width }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={styles.rowBetween}>
        <span style={{ fontSize: 11.5, color: C.fog }}>{label}</span>
        <span style={{ fontSize: 11.5, color: C.ink, fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 5, background: C.void, borderRadius: 4, marginTop: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: C.amber, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function CloseStep({ onClose }) {
  return (
    <div className="dn-fadein-up" style={{ textAlign: "center", maxWidth: 420 }}>
      <h2 style={styles.h2}>That's the part nobody else built.</h2>
      <p style={styles.body}>Trust that propagates, allocation that's fair, decisions that explain themselves — all live in the graph, all working offline when the network isn't.</p>
      <button onClick={onClose} className="dn-press" style={styles.enterBtn}>
        Explore the live app <ArrowRight size={16} />
      </button>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  frame: { position: "relative", width: "100%", maxWidth: 480, height: "min(680px, 88dvh)", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, display: "flex", flexDirection: "column", overflow: "hidden" },
  progressRow: { display: "flex", gap: 4, padding: "14px 14px 0" },
  segTrack: { flex: 1, height: 3, background: C.line, borderRadius: 3, overflow: "hidden" },
  segFill: { height: "100%", background: C.red, borderRadius: 3 },
  closeBtn: { position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 },
  tapZones: { position: "absolute", inset: 0, top: 30, display: "flex", zIndex: 5 },
  tapZone: { position: "absolute", top: 0, bottom: 0, cursor: "pointer" },
  content: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "left" },
  h2: { fontSize: "clamp(1.2rem, 4vw, 1.5rem)", color: C.ink, fontWeight: 800, lineHeight: 1.25, margin: "0 0 12px" },
  body: { fontSize: 14, color: C.fog, lineHeight: 1.6, margin: 0 },
  tagRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 14 },
  tag: { fontFamily: "monospace", fontSize: 10.5, letterSpacing: 1, color: C.green || "#3FBE7A" },
  trustBarTrack: { height: 10, background: C.void, borderRadius: 6, overflow: "hidden", marginBottom: 10 },
  trustBarFill: { height: "100%", borderRadius: 6 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  resourceRow: { display: "flex", alignItems: "center", gap: 10, background: C.void, border: "1px solid", borderRadius: 10, padding: "10px 12px" },
  explainCard: { background: C.void, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 },
  enterBtn: { marginTop: 22, background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: "14px 22px", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" },
};
