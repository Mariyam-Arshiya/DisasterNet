import React from "react";
import { X, ShieldOff, Scale, WifiOff, ArrowRight } from "lucide-react";
import { C } from "../theme";

const GAPS = [
  { icon: ShieldOff, title: "No trust model", desc: "Every report is treated as equally credible — misinformation spreads as fast as real alerts.", tab: "Trust Graph" },
  { icon: Scale, title: "No fairness model", desc: "Resources go to whoever's closest, not whoever's waited longest or needs it most.", tab: "Resources" },
  { icon: WifiOff, title: "No offline model", desc: "The moment the network drops, most apps simply stop working.", tab: "Map" },
];

export default function IntroOverlay({ onClose }) {
  return (
    <div style={styles.backdrop} className="dn-backdrop-in">
      <div style={styles.card} className="dn-fadein-up">
        <button onClick={onClose} style={styles.closeBtn}><X size={18} color={C.fog} /></button>
        <div style={styles.eyebrow}>THE PROBLEM</div>
        <h2 style={styles.h2}>Disaster apps assume the thing disasters destroy first: connectivity.</h2>
        <p style={styles.sub}>DisasterNet closes three gaps most tools don't touch. Each one has its own tab in this app — not just a slide.</p>

        <div style={styles.gaps}>
          {GAPS.map((g, i) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="dn-fadein-up" style={{ ...styles.gapCard, animationDelay: `${100 + i * 90}ms` }}>
                <Icon size={18} color={C.red} />
                <div style={{ fontWeight: 700, color: C.ink, fontSize: 13.5, marginTop: 8 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: C.fog, marginTop: 5, lineHeight: 1.5 }}>{g.desc}</div>
                <div style={styles.gapTag}>see: {g.tab} tab</div>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="dn-press" style={styles.enterBtn}>
          Show me <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { position: "relative", width: "100%", maxWidth: 520, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 26, maxHeight: "90vh", overflowY: "auto" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" },
  eyebrow: { fontFamily: "monospace", fontSize: 11, color: C.red, letterSpacing: 2, marginBottom: 10 },
  h2: { color: C.ink, fontSize: "clamp(1.2rem, 4vw, 1.5rem)", lineHeight: 1.25, margin: 0, fontWeight: 800 },
  sub: { color: C.fog, fontSize: 13, marginTop: 12, lineHeight: 1.6 },
  gaps: { display: "grid", gridTemplateColumns: "1fr", gap: 10, marginTop: 20 },
  gapCard: { border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, background: C.void },
  gapTag: { marginTop: 8, fontSize: 10, fontFamily: "monospace", color: C.red, letterSpacing: 0.5 },
  enterBtn: { width: "100%", marginTop: 22, background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: "13px 16px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" },
};
