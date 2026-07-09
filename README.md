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
