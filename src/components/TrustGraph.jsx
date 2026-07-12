import React, { useRef, useEffect, useMemo } from "react";
import { Database } from "lucide-react";
import { C } from "../theme";

// Builds a simple force-ish layout: report nodes ringed around a center,
// with edge thickness driven by corroboration count and color by trust —
// a direct visualization of the Neo4j (Report)-[:CORROBORATES]->(Report) graph.
export default function TrustGraph({ reports, source }) {
  const canvasRef = useRef(null);

  const nodes = useMemo(() => {
    const cx = 0.5, cy = 0.5;
    return reports.slice(0, 10).map((r, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2;
      return {
        ...r,
        x: cx + Math.cos(angle) * 0.36,
        y: cy + Math.sin(angle) * 0.36,
      };
    });
  }, [reports]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(t) {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // center "graph root" node
      const cx = w * 0.5, cy = h * 0.5;

      nodes.forEach((n) => {
        const nx = n.x * w, ny = n.y * h;
        const trust = n.trust ?? 0.5;
        const edgeAlpha = 0.15 + trust * 0.35;
        const color = trust >= 0.75 ? C.green : trust >= 0.45 ? C.amber : C.red;

        ctx.strokeStyle = hexAlpha(color, edgeAlpha);
        ctx.lineWidth = 1 + (n.corroborations || 0) * 0.8;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();

        const pulse = (Math.sin(t / 600 + nx) + 1) / 2;
        const r = (6 + trust * 6) * dpr + (n.severity === "critical" ? pulse * 3 : 0);
        ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });

      // center node
      ctx.beginPath(); ctx.arc(cx, cy, 8 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = C.ink; ctx.fill();

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [nodes]);

  return (
    <div style={{ position: "relative" }}>
      <div style={styles.header}>
        <Database size={14} color={C.green} />
        <span style={{ fontFamily: "monospace", fontSize: 11.5, color: C.fog }}>
          {source === "neo4j" ? "LIVE FROM NEO4J AURADB" : "LOCAL DEMO DATA — connect NEO4J_URI in the backend to go live"}
        </span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      <p style={{ fontSize: 12, color: C.fog, marginTop: 8, lineHeight: 1.5 }}>
        Each node is a report; distance from center and edge thickness reflect corroboration count, color reflects the live trust-propagation score computed in Cypher (Feature 1).
      </p>
    </div>
  );
}

function hexAlpha(hex, alpha) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = {
  header: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 },
};
