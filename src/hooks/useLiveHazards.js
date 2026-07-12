import { useState, useEffect } from "react";

// USGS Earthquake Hazards Program — public, free, no API key, no auth.
// This is real, independently verifiable data: whatever shows here is
// whatever actually happened in the real world in the last 24 hours.
// Docs: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
const POLL_MS = 5 * 60 * 1000; // USGS refreshes this feed roughly every 5 minutes

export function useLiveHazards() {
  const [quakes, setQuakes] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | live | unavailable

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(FEED_URL, { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error("USGS feed unavailable");
        const geo = await res.json();
        if (cancelled) return;
        const parsed = (geo.features || []).map((f) => ({
          id: f.id,
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          url: f.properties.url,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        })).filter((q) => q.mag != null && q.lat != null && q.lng != null);
        setQuakes(parsed);
        setStatus("live");
      } catch (e) {
        if (!cancelled) setStatus("unavailable"); // never throws into the UI — map just omits this layer
      }
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { quakes, status };
}
