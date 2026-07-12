import React, { useMemo } from "react";
import { Copy, Clock, TrendingUp } from "lucide-react";
import { C } from "../theme";

export default function ResourceQueue({ resources }) {
  const ranked = useMemo(() => [...resources].sort((a, b) => (b.fairness || 0) - (a.fairness || 0)), [resources]);

  return (
    <div>
      <div className="dn-fadein-up" style={styles.explainer}>
        <TrendingUp size={16} color={C.red} />
        <div>
          <strong style={{ color: C.ink }}>Most apps route resources to whoever's closest.</strong>{" "}
          <span style={{ color: C.fog }}>
            This queue is ranked by a fairness score — severity and how long a need has gone unmet — so a remote request
            that's waited 8 hours doesn't keep losing to a nearby one that just came in.
          </span>
        </div>
      </div>

      {ranked.map((r, i) => (
        <div key={r.id} className="dn-fadein-up" style={{ ...styles.card, animationDelay: `${i * 70}ms` }}>
          <div style={styles.rowBetween}>
            <span style={styles.rank}>#{i + 1} priority</span>
            <span style={styles.fairness}>{Math.round((r.fairness || 0) * 100)}% fairness score</span>
          </div>
          <div style={styles.need}>{r.need}</div>
          <div style={styles.location}>{r.location}</div>
          <div style={styles.rowBetween}>
            <span style={styles.wait}><Clock size={11} style={{ verticalAlign: -2 }} /> Unmet for {r.waitHours}h</span>
            {r.flag && (
              <span style={styles.flag}><Copy size={11} /> {r.flag}</span>
            )}
          </div>
          <div style={styles.barTrack}>
            <div style={{ ...styles.barFill, width: `${Math.round((r.fairness || 0) * 100)}%` }} />
          </div>
        </div>
      ))}
      {ranked.length === 0 && <p style={{ color: C.fog, fontSize: 13 }}>No open resource requests right now.</p>}
    </div>
  );
}

const styles = {
  explainer: { display: "flex", gap: 12, background: C.surface, border: `1px solid ${C.red}44`, borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 13, lineHeight: 1.6 },
  card: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, marginBottom: 10 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rank: { color: C.red, fontSize: 11, fontWeight: 800, fontFamily: "monospace" },
  fairness: { color: C.fog, fontSize: 11 },
  need: { color: C.ink, fontSize: 15, fontWeight: 700, marginTop: 8 },
  location: { color: C.fog, fontSize: 12, marginTop: 2 },
  wait: { color: C.fog, fontSize: 11.5, marginTop: 10 },
  flag: { color: C.amber, fontSize: 10.5, display: "flex", alignItems: "center", gap: 4, marginTop: 10 },
  barTrack: { height: 4, background: C.line, borderRadius: 4, marginTop: 10, overflow: "hidden" },
  barFill: { height: "100%", background: C.red, borderRadius: 4, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" },
};
