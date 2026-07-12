export const mockReports = [
  { id: "r1", text: "Water level rising fast near Adyar bridge, 3 families stranded on roof", location: "Adyar, Chennai", lat: 13.0012, lng: 80.2565, severity: "critical", trust: 0.91, corroborations: 4, tags: ["flood", "rescue"], time: "6m ago" },
  { id: "r2", text: "Relief camp at govt school running low on drinking water", location: "Velachery, Chennai", lat: 12.9791, lng: 80.2183, severity: "high", trust: 0.78, corroborations: 2, tags: ["supply-shortage"], time: "18m ago" },
  { id: "r3", text: "Road blocked by fallen tree, ambulance rerouted", location: "Mylapore, Chennai", lat: 13.0339, lng: 80.2619, severity: "medium", trust: 0.64, corroborations: 1, tags: ["structural"], time: "31m ago" },
  { id: "r4", text: "Unverified: bridge collapse near OMR", location: "OMR, Chennai", lat: 12.9010, lng: 80.2279, severity: "unverified", trust: 0.22, corroborations: 0, tags: ["structural"], time: "40m ago" },
  { id: "r5", text: "Fire reported near market complex, smoke visible", location: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341, severity: "critical", trust: 0.85, corroborations: 3, tags: ["fire"], time: "3m ago" },
];

export const mockResources = [
  { id: "d1", need: "Drinking water — 200L", location: "Velachery relief camp", lat: 12.9791, lng: 80.2183, waitHours: 6, fairness: 0.88, flag: null },
  { id: "d2", need: "Medical team — trauma", location: "Adyar bridge area", lat: 13.0012, lng: 80.2565, waitHours: 2, fairness: 0.95, flag: null },
  { id: "d3", need: "Blankets — 50 units", location: "Mylapore shelter", lat: 13.0339, lng: 80.2619, waitHours: 1, fairness: 0.41, flag: "possible duplicate of d5" },
  { id: "d4", need: "Boat — evacuation", location: "Adyar, near bridge", lat: 13.0022, lng: 80.2551, waitHours: 8, fairness: 0.97, flag: null },
];

export const mockSafeZones = [
  { id: "s1", name: "Govt Higher Secondary School — Velachery", lat: 12.9816, lng: 80.2209, capacity: 400, occupied: 260 },
  { id: "s2", name: "Community Hall — Mylapore", lat: 13.0350, lng: 80.2680, capacity: 150, occupied: 90 },
  { id: "s3", name: "Sports Complex — Adyar", lat: 13.0067, lng: 80.2500, capacity: 300, occupied: 120 },
];

export const MAP_CENTER = [13.0012, 80.2400];
