import React, { useState } from "react";
import { Shield, Radio, HeartHandshake, User, ArrowRight } from "lucide-react";
import { C } from "../theme";
import AmbientNetwork from "./AmbientNetwork";

const ROLES = [
  { id: "resident", label: "Resident", icon: User, desc: "Report incidents, get nearby alerts, find safe zones" },
  { id: "volunteer", label: "Volunteer", icon: HeartHandshake, desc: "Respond to nearby SOS calls and assigned tasks" },
  { id: "responder", label: "First Responder", icon: Radio, desc: "Field triage, resource requests, live map" },
  { id: "coordinator", label: "Coordinator", icon: Shield, desc: "Full dashboard, trust graph, fairness routing" },
];

export default function Login({ onEnter }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("resident");

  return (
    <div style={styles.wrap}>
      <AmbientNetwork />
      <div className="dn-fadein-up" style={{ ...styles.card, position: "relative", zIndex: 1 }}>
        <div style={styles.brand}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, display: "inline-block" }} />
          DISASTERNET
        </div>
        <h1 style={styles.h1}>Signal drops.<br />Coordination doesn't.</h1>
        <p style={styles.sub}>Pick how you'll use it — this changes what's on your home screen.</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          style={styles.input}
        />

        <div style={styles.roleGrid}>
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            const active = role === r.id;
            return (
              <button
                key={r.id}
                className="dn-press dn-fadein-up"
                onClick={() => setRole(r.id)}
                style={{ ...styles.roleCard, borderColor: active ? C.red : C.line, background: active ? C.surface2 : C.surface, animationDelay: `${80 + i * 70}ms`, transition: "border-color 0.25s ease, background 0.25s ease, transform 0.15s ease" }}
              >
                <Icon size={20} color={active ? C.red : C.fog} style={{ transition: "color 0.25s ease" }} />
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, color: C.ink }}>{r.label}</div>
                <div style={{ fontSize: 11.5, color: C.fog, marginTop: 4, lineHeight: 1.4 }}>{r.desc}</div>
              </button>
            );
          })}
        </div>

        <button className="dn-press" style={styles.enterBtn} onClick={() => onEnter({ name: name.trim() || "Guest", role })}>
          Enter DisasterNet <ArrowRight size={16} />
        </button>
        <p style={styles.footnote}>No signup required for this demo — role only changes your default view.</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100dvh", background: C.void, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 460 },
  brand: { display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontWeight: 700, color: C.ink, letterSpacing: 1, fontSize: 14, marginBottom: 28 },
  h1: { fontSize: "clamp(1.8rem, 6vw, 2.4rem)", color: C.ink, lineHeight: 1.08, margin: 0, fontWeight: 800, letterSpacing: -0.5 },
  sub: { color: C.fog, fontSize: 14, marginTop: 14, marginBottom: 22, lineHeight: 1.5 },
  input: { width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink, padding: "13px 14px", fontSize: 14, marginBottom: 18, boxSizing: "border-box" },
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 },
  roleCard: { textAlign: "left", border: "1px solid", borderRadius: 12, padding: 14, cursor: "pointer" },
  enterBtn: { width: "100%", background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: "15px 18px", fontSize: 14.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" },
  footnote: { color: C.fog, fontSize: 11.5, textAlign: "center", marginTop: 14 },
};
