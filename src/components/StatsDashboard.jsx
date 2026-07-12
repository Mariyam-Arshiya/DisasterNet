import React, { useMemo } from "react";
import { Activity, AlertTriangle, ShieldCheck, Clock, Globe } from "lucide-react";
import { C } from "../theme";
import { useCountUp } from "../hooks/useCountUp";
import { useLiveHazards } from "../hooks/useLiveHazards";

export default function StatsDashboard({ reports, resources, connection }) {
  const { quakes, status: hazardStatus } = useLiveHazards();

  const stats = useMemo(() => {
    const critical = reports.filter((r) => r.severity === "critical").length;
    const avgTrust = reports.length ? reports.reduce((a, r) => a + (r.trust || 0), 0) / reports.length : 0;
    const openNeeds = resources.length;
    const flagged = resources.filter((r) => r.flag).length;
    return { critical, avgTrust, openNeeds, flagged };
  }, [reports, resources]);

  const cards = [
    { icon: AlertTriangle, label: "Critical reports", value: stats.critical, color: C.red, suffix: "" },
    { icon: ShieldCheck, label: "Avg. trust score", value: Math.round(stats.avgTrust * 100), color: C.green, suffix: "%" },
    { icon: Clock, label: "Open resource needs", value: stats.openNeeds, color: C.amber, suffix: "" },
    { icon: Activity, label: "Duplicates flagged", value: stats.flagged, color: C.fog, suffix: "" },
  ];

  return (
    <div>
      <div style={styles.connectionRow}>
        <span className="dn-live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: connection === "live" ? C.green : C.amber, display: "inline-block" }} />
        {connection === "live" ? "Live — connected to Neo4j backend" : "Incident graph: live simulation — connect the Neo4j backend to go fully live"}
      </div>

      {hazardStatus === "live" && (
        <div className="dn-fadein-up" style={styles.hazardBanner}>
          <Globe size={16} color="#3FA9E5" />
          <span>
            <strong style={{ color: "#3FA9E5" }}>{quakes.length} real earthquakes</strong> recorded worldwide in the last 24 hours —
            live from the USGS Earthquake Hazards Program, not simulated. This is the same data pipeline the trust graph and
            resource router would run against in a real deployment.
          </span>
        </div>
      )}

      <div style={styles.grid}>
        {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 80} />)}
        {hazardStatus === "live" && (
          <StatCard icon={Globe} label="Live seismic events (USGS, 24h)" value={quakes.length} color="#3FA9E5" suffix="" delay={cards.length * 80} />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, suffix, delay }) {
  const animated = useCountUp(value);
  return (
    <div className="dn-fadein-up" style={{ ...styles.card, animationDelay: `${delay}ms` }}>
      <Icon size={18} color={color} />
      <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(animated)}{suffix}
      </div>
      <div style={{ fontSize: 11.5, color: C.fog, marginTop: 4 }}>{label}</div>
    </div>
  );
}

const styles = {
  connectionRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.fog, marginBottom: 16, fontFamily: "monospace" },
  hazardBanner: { display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(63,169,229,0.08)", border: "1px solid #3FA9E544", borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 12.5, color: C.fog, lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 },
  card: { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 },
};
