<<<<<<< HEAD
# DisasterNet

🚀 DisasterNet

Offline-first, graph-powered disaster coordination platform that works even when networks fail

📌 Problem & Domain

Disaster response systems today fail in the exact moment they are needed most — when connectivity breaks.

Most existing apps:

Depend on internet/cloud servers
Don’t handle misinformation
Allocate resources unfairly
Cannot coordinate offline

Research shows many disaster apps become inactive due to these limitations

🌍 Themes Selected

✅ Climate & Sustainability Systems

✅ Public Systems, Governance and Civic Tech

✅ Infrastructure, Mobility & Smart Systems

✅ HealthTech & Bio Platforms

✅ Developer Tools & Software Infrastructure


🎯 Objective

👥 Target Users
First responders
NGOs & volunteers
Disaster victims
Government coordination teams


⚠️ Pain Points
No communication during network failure
Duplicate or fake reports
Poor resource allocation
Lack of coordination between teams


Solution Value

DisasterNet provides:


📡 Offline-first communication

🧠 Graph-based intelligence using Neo4j

⚖️ Fair and explainable resource allocation

🤖 AI-assisted triage and coordination

🧠 Team & Approach

👥 Team Name: BugSmashers

GraphGuardians

👨‍💻 Team Members
Mariyam Arshiya – Full Stack / AI / Architecture


💡 Approach

We chose this problem because:

Disaster tech is underserved and critical
Existing systems fail in real-world conditions


🔥 Key Challenges Solved
Offline data sync (no internet)
Trust & misinformation handling
Fair distribution of resources
Multi-device coordination

🚀 Breakthrough

Instead of treating data as flat records, we modeled everything as a living graph:
Reports, people, resources, and trust are all connected nodes

🛠️ Tech Stack

💻 Core Technologies
Layer	Tech
Frontend	React (Vite), React Native (Expo)
Backend	Node.js, Express
Database	Neo4j AuraDB
APIs	REST, Socket.IO
Hosting	Render, Vercel

⚡ Additional Technologies

🤖 AI / ML (on-device triage + Sarvam AI fallback)
☁️
Cloud (Render deployment)

📶 Offline-first architecture

🔗 Graph Data Science (Neo4j)

🏆 Sponsored Track

🟢 Neo4j Track and Render


We used Neo4j AuraDB as the core system:

Graph-based report linking
Trust propagation using PageRank-style scoring
Resource allocation using graph relationships

🟣 Expo Track
Built mobile app using React Native Expo
Offline-first UI + real-time updates


✨ Key Features

✅ 1. Trust-Weighted Report Graph
Reports scored based on reliability
Uses graph relationships instead of static ML
Prevents misinformation spread

✅ 2. Fairness-Aware Resource Allocation
Prioritizes underserved areas
Avoids bias of “nearest-first” allocation
Uses graph-based scoring

✅ 3. Offline Graph Sync (CRDT-based)
Works without internet
Syncs data when connectivity returns
No data loss

✅ 4. AI Field Triage Assistant
Works offline
Guides responders step-by-step
Converts results into structured graph data

✅ 5. Duplicate & Ghost Request Detection
Detects repeated or outdated requests
Prevents wasted resources

✅ 6. Volunteer Assignment Engine
Matches volunteers based on skills
Balances workload intelligently

✅ 7. Mesh Network Fallback
Device-to-device communication
Works with zero infrastructure

✅ 8. Explainable Decisions
Shows why a resource was allocated
Builds trust with responders


📽️ Demo & Deliverables
🎥 Demo Video: 
🌐 Deployment: 


✅ Tasks & Bonus Checklist

✅ All team members completed social task

⬜ Bonus Task 1

⬜ Bonus Task 2

🧪 How to Run the Project

🔧 Requirements
Node.js
Neo4j AuraDB account
Expo CLI
🔑 Environment Variables

Create .env:

NEO4J_URI=your_uri
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

▶️ Backend
cd disasternet-backend
npm install
npm run dev

▶️ Frontend
cd disasternet-web
npm install
npm run dev

▶️ Mobile App
cd disasternet-mobile
npx expo start

🧬 Future Scope

📈 Integration with government APIs

🛡️ Stronger encryption for mesh network

🌐 Multi-language support

🧠 Advanced AI decision-making

📊 Real-time disaster prediction


📎 Resources / Credits

Neo4j Graph Data Science
Expo React Native
Disaster research studies (2024–2026)
Open-source libraries


🏁 Final Words

DisasterNet was built to solve a real-world critical problem  not just for a demo.

We learned:

Systems must work in worst-case scenarios
Data trust is as important as data itself
Graph thinking unlocks powerful coordination

“In disasters, communication is survival. DisasterNet ensures it never stops.”
=======
# DisasterNet — Unified Responsive App

One React codebase. Same code renders as a mobile app (bottom tab bar, full-screen SOS) below 860px width, and as a desktop command dashboard (sidebar nav) above it. No separate mobile project.

## Why this exists (read this before judging it as "just another disaster app")
Most disaster-coordination apps do two things: collect reports, show them on a map. They don't verify which reports are true, they route resources by whoever's closest instead of whoever's waited longest, and they stop working entirely the moment the network drops — which is exactly when disasters make that happen. DisasterNet closes those three gaps specifically. Every claim below has its own tab in the running app, not just a slide — open it and click **"Why DisasterNet"** in the sidebar, or **"Watch 30-sec demo"** for a guided walkthrough that shows the trust score propagating and the resource queue reordering live.

## What's real vs. simulated — stated plainly
- **Live seismic layer (Map + Dashboard tabs)** — genuinely real. Pulled live from the USGS Earthquake Hazards Program public feed (`earthquake.usgs.gov`, no API key, refreshes every 5 min). Whatever count you see is whatever actually happened in the real world in the last 24 hours — independently checkable against usgs.gov directly.
- **Incident reports (Map/Alerts/Trust Graph tabs)** — runs on local seed data plus a live simulation engine that generates a new incident every ~7s, clearly labeled "SIMULATED LIVE FEED" in the ticker. This is intentional and honest: it's standing in for the Neo4j backend feed until you connect it (see below) — connect the backend and the same UI switches to "LIVE — connected to Neo4j backend" with zero code changes.
- **Trust scores, fairness ranking, AI tagging** — all real, working logic (Cypher-style scoring, keyword classifier, haversine distance), not hardcoded numbers. See `src/data/aiTagging.js` and `src/components/TrustGraph.jsx`.

## What's working right now, no setup required
- **Live map** — OpenStreetMap dark tiles (free, no API key), incident markers, safe zones, heatmap toggle, **and a real live earthquake layer from USGS**
- **Send SOS** — one tap or voice ("Speak your report" — browser's built-in Web Speech API, Chrome/Edge)
- **Report an incident** — fast bottom-sheet UI, live AI tagging as you type
- **Resources tab** — fairness-ranked queue with a visible explanation for why each request is ordered where it is (not a black box)
- **Smart nearby alerts** — sorts the live feed by real distance from your browser's geolocation
- **Offline fallback** — turn off your network, submit a report, it queues in localStorage; comes back online, it's ready to sync
- **Trust graph (Neo4j)** — force-style visualization of the report/corroboration graph, labeled live vs. local depending on whether your backend is reachable
- **Guided 30-second demo** (`ScenarioDemo.jsx`) — story-style walkthrough auto-plays on first login, tap to pause/replay
- **"Why DisasterNet" panel** — the problem statement and the three gaps, one tap away, always in the sidebar
- **Role-based UI** — Resident / Volunteer / Responder / Coordinator at login
- **Dashboard** — live-computed stats, not hardcoded numbers

## Run it
```bash
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5173`. Resize your browser below 860px (or open dev tools device mode) to see it switch to the mobile layout — same code, no reload.

## Connect Neo4j (this is the `disasternet-backend` project from earlier)
Point `.env`'s `VITE_API_BASE` at wherever that backend is running (`http://localhost:4000` locally, or your Render URL once deployed):
1. `npm run seed` in the backend to populate Neo4j
2. `npm run dev` in the backend
3. Reload this app — Dashboard switches to "Live — connected to Neo4j backend", Trust Graph tab says "LIVE FROM NEO4J AURADB"

Until you do that, the app runs on local seed data plus the simulation engine — it will never crash or show a hard error either way; every network call in this app is wrapped and degrades silently.

## Deploy
- **Vercel** (recommended): push to GitHub, import at vercel.com — auto-detects Vite. Add `VITE_API_BASE` as an environment variable pointing at your deployed backend.
- **Netlify**: `npm run build`, publish directory `dist`.

## Push to GitHub
```bash
git init
git add .
git commit -m "DisasterNet unified responsive app"
git branch -M main
git remote add origin https://github.com/Mariyam-Arshiya/DisasterNet.git
git push -u origin main --force
```
`--force` is there because this replaces whatever's currently in the repo. Drop it if you want to merge instead of overwrite.
>>>>>>> b44f3c7 (Initial commit)
