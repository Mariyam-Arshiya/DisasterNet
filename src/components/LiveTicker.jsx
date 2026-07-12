import React, { useEffect, useState, useRef } from "react";
import { Radio } from "lucide-react";
import { C } from "../theme";

export default function LiveTicker({ reports, connection }) {
  const [latest, setLatest] = useState(null);
  const [flash, setFlash] = useState(false);
  const lastIdRef = useRef(null);

  useEffect(() => {
    if (!reports.length) return;
    const top = reports[0];
    if (top.id !== lastIdRef.current) {
      lastIdRef.current = top.id;
      setLatest(top);
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 900);
      return () => clearTimeout(t);
    }
  }, [reports]);

  if (!latest) return null;

  return (
    <div style={{ ...styles.wrap, borderColor: flash ? C.red : C.line, background: flash ? "rgba(229,52,42,0.08)" : C.surface }}>
      <Radio size={13} className="dn-live-dot" color={C.red} />
      <span style={styles.label}>{connection === "live" ? "LIVE" : "SIMULATED LIVE FEED"}</span>
      <span style={styles.divider}>·</span>
      <span style={styles.text}>
        New <strong style={{ color: severityColor(latest.severity) }}>{latest.severity}</strong> report — {latest.text}
      </span>
      <span style={styles.loc}>{latest.location}</span>
    </div>
  );
}

function severityColor(level) {
  return { critical: C.red, high: C.amber, medium: "#D6A93B", unverified: C.fog }[level] || C.fog;
}

const styles = {
  wrap: {
    display: "flex", alignItems: "center", gap: 8, border: "1px solid", borderRadius: 10,
    padding: "8px 14px", fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden",
    transition: "background 0.4s ease, border-color 0.4s ease",
  },
  label: { fontFamily: "monospace", fontWeight: 800, color: "#E5342A", fontSize: 10.5, letterSpacing: 1 },
  divider: { color: "#A6928F" },
  text: { color: "#F5EEEC", overflow: "hidden", textOverflow: "ellipsis" },
  loc: { color: "#A6928F", marginLeft: "auto", flexShrink: 0, fontSize: 11 },
};
