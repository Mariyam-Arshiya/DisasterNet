import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Flame, Globe } from "lucide-react";
import { C } from "../theme";
import { MAP_CENTER, mockSafeZones } from "../data/mock";
import { useLiveHazards } from "../hooks/useLiveHazards";

// Fix Leaflet's default marker icons breaking under bundlers — load from CDN instead.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const SEVERITY_COLOR = { critical: C.red, high: C.amber, medium: "#D6A93B", unverified: C.fog };

function Recenter({ lat, lng }) {
  const map = useMap();
  React.useEffect(() => { map.setView([lat, lng], map.getZoom()); }, [lat, lng]); // eslint-disable-line
  return null;
}

export default function MapView({ reports, userPos, showHeatmap, onToggleHeatmap }) {
  const [showQuakes, setShowQuakes] = useState(true);
  const { quakes, status: hazardStatus } = useLiveHazards();
  const center = useMemo(() => MAP_CENTER, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer center={center} zoom={12} style={{ width: "100%", height: "100%", background: C.void }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {showHeatmap && reports.map((r) => (
          <Circle
            key={`heat_${r.id}`}
            center={[r.lat, r.lng]}
            radius={r.severity === "critical" ? 900 : r.severity === "high" ? 650 : 400}
            pathOptions={{
              color: SEVERITY_COLOR[r.severity] || C.fog,
              fillColor: SEVERITY_COLOR[r.severity] || C.fog,
              fillOpacity: 0.18, weight: 0,
            }}
          />
        ))}

        {reports.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]}>
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, maxWidth: 200 }}>
                <strong style={{ textTransform: "capitalize" }}>{r.severity}</strong> — {Math.round((r.trust || 0) * 100)}% trust
                <p style={{ margin: "6px 0" }}>{r.text}</p>
                <span style={{ color: "#888" }}>{r.location}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {showQuakes && quakes.map((q) => (
          <CircleMarker
            key={q.id}
            center={[q.lat, q.lng]}
            radius={Math.max(4, q.mag * 2.2)}
            pathOptions={{ color: "#3FA9E5", fillColor: "#3FA9E5", fillOpacity: 0.35, weight: 1.5 }}
          >
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, maxWidth: 210 }}>
                <strong>M{q.mag.toFixed(1)} earthquake</strong>
                <p style={{ margin: "4px 0" }}>{q.place}</p>
                <span style={{ color: "#888", fontSize: 11 }}>{new Date(q.time).toLocaleString()} · Live from USGS</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {mockSafeZones.map((z) => (
          <Circle key={z.id} center={[z.lat, z.lng]} radius={220} pathOptions={{ color: C.green, fillColor: C.green, fillOpacity: 0.25, weight: 2 }}>
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13 }}>
                <strong>{z.name}</strong>
                <p style={{ margin: "4px 0" }}>Safe zone · {z.occupied}/{z.capacity} occupied</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {!userPos.isDefault && <Recenter lat={userPos.lat} lng={userPos.lng} />}
      </MapContainer>

      <div style={{ position: "absolute", top: 14, right: 14, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onToggleHeatmap} className="dn-press" style={mapBtnStyle(showHeatmap)}>
          <Flame size={15} /> Heatmap
        </button>
        <button onClick={() => setShowQuakes((v) => !v)} className="dn-press" style={mapBtnStyle(showQuakes, "#3FA9E5")}>
          <Globe size={15} /> Live seismic {hazardStatus === "live" && <span className="dn-live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#3FA9E5", display: "inline-block", marginLeft: 2 }} />}
        </button>
      </div>

      <div style={{ position: "absolute", bottom: 14, left: 14, zIndex: 1000, display: "flex", gap: 14, background: "rgba(11,10,12,0.85)", border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 11, color: C.fog, alignItems: "center", flexWrap: "wrap" }}>
        <LegendDot color={C.red} label="Critical" />
        <LegendDot color={C.amber} label="High" />
        <LegendDot color={C.green} label="Safe zone" />
        <LegendDot color="#3FA9E5" label="Live seismic (USGS)" />
      </div>

      {hazardStatus === "live" && (
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 1000, background: "rgba(11,10,12,0.85)", border: "1px solid #3FA9E544", borderRadius: 10, padding: "6px 12px", fontSize: 10.5, color: "#3FA9E5", fontFamily: "monospace" }}>
          {quakes.length} real earthquakes worldwide, last 24h — live from USGS
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

function mapBtnStyle(active, activeColor = C.red) {
  return {
    display: "flex", alignItems: "center", gap: 6, background: active ? activeColor : "rgba(23,16,18,0.9)",
    color: active ? "#fff" : C.ink, border: `1px solid ${active ? activeColor : C.line}`, borderRadius: 8,
    padding: "8px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
  };
}
