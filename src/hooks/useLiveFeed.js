import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../theme";
import { autoTag, scoreSeverity } from "../data/aiTagging";

const SIM_LOCATIONS = [
  { location: "Adyar, Chennai", lat: 13.0012, lng: 80.2565 },
  { location: "Velachery, Chennai", lat: 12.9791, lng: 80.2183 },
  { location: "Mylapore, Chennai", lat: 13.0339, lng: 80.2619 },
  { location: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341 },
  { location: "OMR, Chennai", lat: 12.9010, lng: 80.2279 },
];
const SIM_TEXTS = [
  "Water rising near the main road, residents moving to rooftops",
  "Family trapped on second floor, need urgent rescue",
  "Fire spreading near market stalls, smoke visible from a distance",
  "Ambulance blocked by debris, alternate route needed",
  "Shelter reporting low food supply for tonight",
];

export function useLiveFeed(initialReports) {
  const [reports, setReports] = useState(initialReports);
  const [connection, setConnection] = useState("connecting"); // connecting | live | simulated
  const [event, setEvent] = useState(null); // { id, message } — surfaced as a toast so trust changes are provable, not just claimed
  const simRef = useRef(null);

  useEffect(() => { setReports(initialReports); }, [initialReports]);

  const emitEvent = useCallback((message) => {
    setEvent({ id: Date.now(), message });
  }, []);

  const pushSimulated = useCallback(() => {
    setReports((prev) => {
      // ~40% of the time, corroborate an existing report instead of creating a new one —
      // this is what actually demonstrates the trust-propagation graph (Feature 1) live,
      // rather than only ever showing brand-new incidents.
      const corroboratable = prev.filter((r) => (r.trust ?? 0) < 0.95);
      if (corroboratable.length && Math.random() < 0.4) {
        const target = corroboratable[Math.floor(Math.random() * corroboratable.length)];
        const oldTrust = target.trust ?? 0.5;
        const newTrust = Math.min(oldTrust + 0.08 + Math.random() * 0.07, 0.97);
        emitEvent(`Trust score updated — "${target.text.slice(0, 38)}…" ${Math.round(oldTrust * 100)}% → ${Math.round(newTrust * 100)}% (new corroboration nearby)`);
        return prev.map((r) => r.id === target.id ? { ...r, trust: newTrust, corroborations: (r.corroborations || 0) + 1 } : r);
      }
      const loc = SIM_LOCATIONS[Math.floor(Math.random() * SIM_LOCATIONS.length)];
      const text = SIM_TEXTS[Math.floor(Math.random() * SIM_TEXTS.length)];
      const corroborations = Math.floor(Math.random() * 3);
      const { level, score } = scoreSeverity(text, corroborations);
      const entry = {
        id: `sim_${Date.now()}`,
        text, ...loc,
        severity: level,
        trust: Math.round(score * 100) / 100,
        corroborations,
        tags: autoTag(text),
        time: "just now",
      };
      emitEvent(`New report — ${text.slice(0, 42)}… (auto-tagged: ${entry.tags.join(", ")})`);
      return [entry, ...prev].slice(0, 40);
    });
  }, [emitEvent]);

  useEffect(() => {
    let socket;
    try {
      socket = io(API_BASE, { timeout: 2500, reconnection: false });
      socket.on("connect", () => setConnection("live"));
      socket.on("report:new", (r) => setReports((prev) => [r, ...prev].slice(0, 40)));
      socket.on("connect_error", () => {
        setConnection("simulated");
        socket.disconnect();
      });
      const failSafe = setTimeout(() => setConnection((c) => (c === "connecting" ? "simulated" : c)), 3000);
      return () => { clearTimeout(failSafe); socket.disconnect(); };
    } catch {
      setConnection("simulated");
    }
  }, []);

  useEffect(() => {
    if (connection !== "simulated") return;
    // First event fires fast so the demo proves "live" within a couple seconds, not a slow trickle.
    const kick = setTimeout(pushSimulated, 1800);
    simRef.current = setInterval(pushSimulated, 5000);
    return () => { clearTimeout(kick); clearInterval(simRef.current); };
  }, [connection, pushSimulated]);

  return { reports, connection, pushSimulated, event };
}
