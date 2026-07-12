import React, { useState, useEffect, useCallback } from "react";
import { Map, Radio, LayoutDashboard, GitBranch, Plus, Boxes, Info, Sparkles } from "lucide-react";
import { C } from "./theme";
import Login from "./components/Login";
import MapView from "./components/MapView";
import ReportModal from "./components/ReportModal";
import SOSButton from "./components/SOSButton";
import AlertsFeed from "./components/AlertsFeed";
import StatsDashboard from "./components/StatsDashboard";
import TrustGraph from "./components/TrustGraph";
import ResourceQueue from "./components/ResourceQueue";
import LiveTicker from "./components/LiveTicker";
import IntroOverlay from "./components/IntroOverlay";
import ScenarioDemo from "./components/ScenarioDemo";
import { useOffline } from "./hooks/useOffline";
import { useLiveFeed } from "./hooks/useLiveFeed";
import { useGeolocation } from "./hooks/useGeolocation";
import { fetchReports, fetchResources, submitReport } from "./data/api";

const INTRO_SEEN_KEY = "disasternet.intro_seen.v1";

const TABS = [
  { id: "map", label: "Map", icon: Map, tagline: "Live incidents, not just pins — each one carries a trust score." },
  { id: "alerts", label: "Alerts", icon: Radio, tagline: "Sorted by real distance from you, with an action suggestion for each." },
  { id: "resources", label: "Resources", icon: Boxes, tagline: "Ranked by fairness, not proximity — see why that matters." },
  { id: "graph", label: "Trust Graph", icon: GitBranch, tagline: "How misinformation gets filtered out before it reaches a responder." },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, tagline: "The whole picture, computed live from what's on the ground." },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("map");
  const [showReport, setShowReport] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [initialReports, setInitialReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [source, setSource] = useState("local");
  const [loaded, setLoaded] = useState(false);

  const { isOnline, queue, enqueue } = useOffline();
  const { position, distanceTo } = useGeolocation();
  const { reports, connection, pushSimulated } = useLiveFeed(initialReports);

  useEffect(() => {
    (async () => {
      const r = await fetchReports();
      const d = await fetchResources();
      setInitialReports(r.data);
      setResources(d.data);
      setSource(r.source);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (user && !localStorage.getItem(INTRO_SEEN_KEY)) setShowDemo(true);
  }, [user]);

  const closeIntro = useCallback(() => {
    setShowIntro(false);
    setShowDemo(false);
    try { localStorage.setItem(INTRO_SEEN_KEY, "1"); } catch {}
  }, []);

  const handleSubmit = useCallback(async (report) => {
    if (!isOnline) {
      enqueue(report);
      return;
    }
    const res = await submitReport(report);
    if (!res.ok) enqueue(report); // backend unreachable even though browser thinks it's online
    pushSimulated(); // reflect it in the live view immediately for the demo
  }, [isOnline, enqueue, pushSimulated]);

  if (!user) return <Login onEnter={setUser} />;
  if (!loaded) return (
    <div style={{ minHeight: "100dvh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <span className="dn-live-dot" style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, display: "inline-block" }} />
      <span style={{ color: C.fog, fontFamily: "monospace", fontSize: 12, letterSpacing: 1 }}>CONNECTING TO DISASTERNET…</span>
    </div>
  );

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div style={styles.shell}>
      <style>{`
        .dn-sidebar { display: flex; }
        .dn-bottomnav { display: none; }
        @media (max-width: 860px) {
          .dn-sidebar { display: none; }
          .dn-bottomnav { display: flex; }
        }
      `}</style>

      {/* Sidebar — desktop only (hidden on mobile via CSS below) */}
      <nav className="dn-sidebar" style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, display: "inline-block" }} />
          DISASTERNET
        </div>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} className="dn-nav-item dn-press" onClick={() => setTab(t.id)} style={{ ...styles.navItem, background: active ? C.surface2 : "transparent", color: active ? C.ink : C.fog }}>
              <Icon size={18} /> {t.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowDemo(true)} className="dn-press" style={styles.demoBtn}>
          <Sparkles size={14} /> Watch 30-sec demo
        </button>
        <button onClick={() => setShowIntro(true)} className="dn-press" style={styles.whyBtn}>
          <Info size={14} /> Why DisasterNet
        </button>
        <div style={styles.userBox}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{user.name}</div>
          <div style={{ fontSize: 11, color: C.fog, textTransform: "capitalize" }}>{user.role}</div>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.topBar}>
          <div style={styles.connBadge}>
            <span className="dn-live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: isOnline ? C.green : C.amber, display: "inline-block" }} />
            {isOnline ? "Online" : `Offline — ${queue.length} queued`}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setShowDemo(true)} className="dn-press" style={styles.mobileDemoBtn}>
              <Sparkles size={13} /> Demo
            </button>
            <SOSButton onTrigger={handleSubmit} />
          </div>
        </header>

        <div style={styles.tickerRow}>
          <LiveTicker reports={reports} connection={connection} />
        </div>

        <div style={styles.content}>
          <div key={tab} className="dn-tab-content" style={{ height: "100%" }}>
            <p style={styles.tagline}>{activeTab.tagline}</p>
            {tab === "map" && (
              <div style={{ height: "calc(100% - 30px)", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}` }}>
                <MapView reports={reports} userPos={position} showHeatmap={showHeatmap} onToggleHeatmap={() => setShowHeatmap((v) => !v)} />
              </div>
            )}
            {tab === "alerts" && <AlertsFeed reports={reports} distanceTo={distanceTo} />}
            {tab === "resources" && <ResourceQueue resources={resources} />}
            {tab === "dashboard" && <StatsDashboard reports={reports} resources={resources} connection={connection} />}
            {tab === "graph" && <TrustGraph reports={reports} source={source} />}
          </div>
        </div>
      </main>

      {/* Floating report button */}
      <button onClick={() => setShowReport(true)} className="dn-press" style={styles.fab}>
        <Plus size={22} color="#fff" />
      </button>

      {/* Bottom tab bar — mobile only (hidden on desktop via CSS below) */}
      <nav className="dn-bottomnav" style={styles.bottomNav}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} className="dn-press" onClick={() => setTab(t.id)} style={{ ...styles.bottomItem, color: active ? C.red : C.fog, transition: "color 0.2s ease" }}>
              <Icon size={19} style={{ transform: active ? "translateY(-2px)" : "none", transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
              <span style={{ fontSize: 9.5 }}>{t.label}</span>
              {active && <span style={{ position: "absolute", bottom: 2, width: 4, height: 4, borderRadius: "50%", background: C.red }} />}
            </button>
          );
        })}
      </nav>

      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={handleSubmit} isOnline={isOnline} />}
      {showIntro && <IntroOverlay onClose={() => setShowIntro(false)} />}
      {showDemo && <ScenarioDemo onClose={closeIntro} />}
    </div>
  );
}

const styles = {
  shell: { display: "flex", minHeight: "100dvh", background: C.void, fontFamily: "-apple-system, Inter, sans-serif" },
  sidebar: { width: 220, borderRight: `1px solid ${C.line}`, padding: 20, flexDirection: "column", gap: 4 },
  brand: { display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontWeight: 700, color: C.ink, fontSize: 13, letterSpacing: 1, marginBottom: 24 },
  navItem: { display: "flex", alignItems: "center", gap: 10, border: "none", borderRadius: 10, padding: "10px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left" },
  whyBtn: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 12px", color: C.fog, fontSize: 12, cursor: "pointer", marginBottom: 12 },
  demoBtn: { display: "flex", alignItems: "center", gap: 8, background: C.red, border: "none", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginBottom: 8 },
  mobileDemoBtn: { display: "flex", alignItems: "center", gap: 5, background: C.surface2, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 10px", color: C.ink, fontSize: 11.5, fontWeight: 600, cursor: "pointer" },
  userBox: { borderTop: `1px solid ${C.line}`, paddingTop: 14 },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, paddingBottom: 70 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.line}` },
  connBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.fog, fontFamily: "monospace" },
  tickerRow: { padding: "12px 20px 0" },
  tagline: { color: C.fog, fontSize: 12.5, margin: "0 0 12px 0", fontStyle: "italic" },
  content: { flex: 1, padding: 20, minHeight: 0, height: "calc(100dvh - 190px)", overflowY: "auto" },
  fab: { position: "fixed", bottom: 84, right: 20, width: 54, height: 54, borderRadius: "50%", background: C.red, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 20px rgba(229,52,42,0.4)", zIndex: 1500 },
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.line}`, justifyContent: "space-around", padding: "8px 0 max(8px, env(safe-area-inset-bottom))", zIndex: 1400 },
  bottomItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px 6px" },
};
