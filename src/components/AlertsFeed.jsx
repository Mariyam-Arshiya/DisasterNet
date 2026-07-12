import React, { useMemo } from "react";
import { ShieldAlert, MapPin, Users } from "lucide-react";
import { C } from "../theme";
import { suggestionsFor } from "../data/aiTagging";

const SEVERITY_COLOR = { critical: C.red, high: C.amber, medium: "#D6A93B", unverified: C.fog };

export default function AlertsFeed({ reports, distanceTo }) {
  const sorted = useMemo(() => {
    return [...reports]
      .map((r) => ({ ...r, dist: distanceTo(r.lat, r.lng) }))
      .sort((a, b) => a.dist - b.dist);
  }, [reports, distanceTo]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sorted.map((r, i) => (
        <div key={r.id} className="dn-fadein-up" style={{ ...styles.card, animationDelay: `${Math.min(i, 8) * 60}ms` }}>
          <div style={styles.rowBetween}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldAlert size={14} color={SEVERITY_COLOR[r.severity] || C.fog} />
              <span style={{ ...styles.sev, color: SEVERITY_COLOR[r.severity] || C.fog }}>{r.severity}</span>
            </div>
            <span style={styles.dist}>{r.dist < 1 ? `${Math.round(r.dist * 1000)}m away` : `${r.dist.toFixed(1)}km away`}</span>
          </div>
          <p style={styles.text}>{r.text}</p>
          <div style={styles.rowBetween}>
            <span style={styles.loc}><MapPin size={11} /> {r.location}</span>
            <span style={styles.trust}>{Math.round((r.trust || 0) * 100)}% trust · <Users size={11} style={{ verticalAlign: -2 }} /> {r.corroborations || 0}</span>
          </div>
          {r.tags?.length > 0 && (
            <div style={styles.suggestBox}>
              {suggestionsFor(r.tags).slice(0, 1).map((s, i) => <span key={i}>{s}</span>)}
            </div>
          )}
        </div>
      ))}
      {sorted.length === 0 && <p style={{ color: C.fog, fontSize: 13 }}>No active reports right now.</p>}
    </div>
  );
}

const styles = {
  card: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sev: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 },
  dist: { fontSize: 11, color: "#A6928F" },
  text: { color: "#F5EEEC", fontSize: 13.5, margin: "8px 0", lineHeight: 1.5 },
  loc: { fontSize: 11.5, color: "#A6928F", display: "flex", alignItems: "center", gap: 4 },
  trust: { fontSize: 11.5, color: "#A6928F" },
  suggestBox: { marginTop: 10, fontSize: 12, color: "#F2A93B", background: "rgba(242,169,59,0.08)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.4 },
};
