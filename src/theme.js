export const C = {
  void: "#0B0A0C",
  surface: "#171012",
  surface2: "#1F1517",
  line: "#2E1D1F",
  ink: "#F5EEEC",
  fog: "#A6928F",
  red: "#E5342A",
  redDim: "#7A211C",
  amber: "#F2A93B",
  green: "#3FBE7A",
};

// Point this at your deployed backend once you have one; falls back to
// mock data automatically if the backend isn't reachable (see api.js).
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
