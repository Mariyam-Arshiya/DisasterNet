import { API_BASE } from "../theme";
import { mockReports, mockResources, mockSafeZones } from "./mock";

async function safeFetch(path, opts) {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(`${API_BASE}${path}`, { ...opts, signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    return await res.json();
  } catch (e) {
    return null; // caller decides the fallback — never throws into the UI
  }
}

export async function fetchReports() {
  const live = await safeFetch("/api/reports");
  return live && Array.isArray(live) && live.length ? { data: live, source: "neo4j" } : { data: mockReports, source: "local" };
}

export async function fetchResources() {
  const live = await safeFetch("/api/resources");
  return live && Array.isArray(live) && live.length ? { data: live, source: "neo4j" } : { data: mockResources, source: "local" };
}

export async function submitReport(report) {
  const live = await safeFetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  return live ? { ok: true, source: "neo4j" } : { ok: false, source: "queued-local" };
}

export function fetchSafeZones() {
  // Safe zones are relatively static reference data — served locally,
  // swap for a /api/safe-zones endpoint once you seed that label in Neo4j.
  return mockSafeZones;
}
