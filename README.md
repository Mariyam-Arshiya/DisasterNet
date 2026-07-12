
DisasterNet

DisasterNet — coordination doesn't stop when the signal does.

📌 Problem & Domain

In the first hours after a disaster, cellular networks and Wi-Fi infrastructure are often the first casualties — right when coordination matters most. Most disaster-response apps assume a live connection to a central server: if that connection drops, reporting, resource matching, and volunteer coordination all stop working at the exact moment they're needed most. Separately, when connectivity does exist, most tools treat every incoming report as equally trustworthy and allocate resources by raw proximity, which systematically starves remote or late-reporting communities and leaves coordinators unable to explain why a decision was made.

Themes Selected:


Infrastructure, Mobility & Smart Systems
Public Systems, Governance and Civic Tech
Trust, Identity & Security


🎯 Objective

DisasterNet is a graph-native, offline-first coordination platform for disaster response.


Target users: first responders and volunteers in the field, relief coordinators managing multiple agencies, and affected residents submitting reports or requests.
The pain point: existing tools collect reports but don't verify them, allocate resources by distance instead of fairness, and simply stop working when infrastructure goes down — the one condition every disaster guarantees.
The value: a shared coordination graph (Neo4j) that scores report trust live, routes resources by fairness rather than proximity, explains every allocation decision, and keeps working — via local queuing and device-to-device relay — even with zero network infrastructure.


🧠 Team & Approach

Team Name: Bug Smashers

Team Members:


Mariyam Arshiya — [https://www.linkedin.com/in/mariyam-arshiya-0a4ab9300 / https://github.com/Mariyam-Arshiya] — Full-stack, architecture, Neo4j graph design, ai developer
Kirshipathi B - [https://github.com/kirishipathi/https://www.linkedin.com/in/kirishipathi-b-03250b328/]- development, Design architech, game developer, app developer


Your Approach:


Why this problem: 
most hackathon disaster-tech submissions optimize for reporting and mapping — a crowded, largely solved space. Research into current academic work (graph-attention resource allocation, VGI trust scoring, off-grid mesh usability studies) surfaced three gaps almost nobody addresses: trust of crowd-sourced data, fairness of allocation, and survival of the coordination system itself once the network is gone. We built for those gaps specifically.
Key challenges addressed: representing evolving trust and fairness as live graph properties instead of static scores; designing an offline-write model that doesn't silently lose or overwrite data when multiple devices reconnect; keeping the AI assistant multilingual and voice-first so it's usable by volunteers who aren't comfortable typing in English.
Pivots/iterations: the resource allocation logic started as simple nearest-match, then moved to a fairness-weighted model after research showed proximity-only allocation reliably starves under-served clusters — a documented failure mode we designed around rather than discovered in testing.


🛠️ Tech Stack

Core Technologies Used:


Frontend (Web): React, Vite, custom CSS (no UI framework — hand-built design system)

Frontend (Mobile): React Native, Expo, React Navigation

Backend: Node.js, Express, Socket.IO

Database: Neo4j AuraDB (graph-native trust scoring, fairness routing, and allocation metadata)

APIs: Anthropic Claude (Field Assistant), Sarvam AI (voice, translation, triage reasoning)

Hosting: Render (backend), Vercel (web), Expo Go / EAS (mobile)/netfliy


Additional Technologies Used:


AI / ML: Sarvam AI (Saaras v3 speech-to-text, Bulbul v3 text-to-speech, Mayura translation, Sarvam-30B/105B reasoning), 
Claude (conversational field assistant)

Offline-first data: AsyncStorage + NetInfo (mobile local queue), vector-clock-based conflict resolution (CRDT sync design)


🏆 Sponsored Track


☑ Neo4j Track — Uses AuraDB as primary database
☑ Expo Track — Built using Expo


Neo4j implementation note: Neo4j isn't used as a generic data store — it's structural to three of the platform's core features. Reports and reporters form a graph where trust propagates through corroboration and geographic clustering (a lightweight PageRank-style score, recomputed as new reports arrive). Resources and demand clusters form a bipartite graph matched by a fairness-weighted function instead of nearest-distance. Every allocation decision writes its contributing factors as edge metadata, so coordinators can see why a decision was made, not just what it was.

Expo implementation note: the field app is built entirely on Expo/React Native, using React Navigation for the tab structure and Expo's managed workflow for fast iteration without native build tooling — critical for hackathon timelines.

✨ Key Features



✅ Trust-Weighted Report Graph — misinformation resistance as a live, propagating graph score, not a static classifier

✅ Fairness-Aware Resource Router — allocation scored by severity and unmet-need duration, preventing remote clusters from being starved by nearest-first logic

✅ Offline-First Field App — reports queue locally the instant signal drops and sync automatically when it returns (real device behavior, not simulated)

✅ Explainable Allocation Trail — every routing decision stores a human-readable "why," not a black-box score

✅ Multilingual Voice Reporting — Sarvam AI enables incident reporting and alerts in regional Indian languages, not just English

✅ Live Field Assistant — a working conversational assistant embedded in both the web and mobile app


📽️ Demo & Deliverables


Demo Video Link (Mandatory): [screen-capture (3).webm](https://github.com/user-attachments/assets/f2c764ff-a01a-4c16-ada1-707553f89e6a)

Deployment Link (Recommended): https://marvelous-mermaid-ab9552.netlify.app/
Pitch Deck / PPT (Optional): [DisasterNet_Pitch_Deck.pptx](https://github.com/user-attachments/files/29942246/DisasterNet_Pitch_Deck.pptx)



✅ Tasks & Bonus Checklist


☐ All team members completed the mandatory social task

☐ Bonus Task 1 – Badge sharing<img width="800" height="1000" alt="HACKHAZARDS-BADGE (3)" src="https://github.com/user-attachments/assets/bc10a081-a3eb-4eb5-8812-5a5a75aa6b5c" />,<img width="800" height="1000" alt="HACKHAZARDS-BADGE (2)" src="https://github.com/user-attachments/assets/2f24c003-3ee1-4f16-99bb-bb57399f9676" />,<img width="800" height="1000" alt="HACKHAZARDS-BADGE (1)" src="https://github.com/user-attachments/assets/93a65457-848c-4324-ad46-978d07e5e1b5" />,<img width="800" height="1000" alt="HACKHAZARDS-BADGE" src="https://github.com/user-attachments/assets/53bc93cf-2486-492b-8a4d-bfbbd895def4" />

☐ Bonus Task 2 – Blog/article


🧪 How to Run the Project

Requirements:


Node.js 18+
 
  Neo4j AuraDB instance (neo4j.com/cloud/aura-free)
   
   Sarvam AI API key 


Local Setup:

Backend:

bashcd disasternet-backend
npm install
copy .env.example .env
# fill in NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD in .env
npm run seed
npm run dev

Web app:

bashcd disasternet-web
npm install
npm run dev

Mobile app:

bashcd disasternet-mobile
npm install
npx expo start

# scan the QR code with Expo Go

🧬 Future Scope


📡 Resilient mesh fallback (BLE / Wi-Fi Direct relay) for true zero-infrastructure operation

📈 Spontaneous volunteer assignment engine using published scheduling heuristics for large volunteer pools

🛡️ End-to-end encryption on all relayed offline messages

🌐 Expansion of Sarvam AI language coverage and offline quantized model fallback for triage

🔁 Duplicate/ghost-request detection across multiple agencies operating on the same incident


📎 Resources / Credits


Neo4j AuraDB and Neo4j Graph Data Science library

Sarvam AI (Saaras, Bulbul, Mayura, Sarvam-M model family)

Research referenced: GAT_HRL (graph-attention + hierarchical RL for emergency resource allocation), VGI credibility scoring studies, CYREN off-grid communication usability research, ERTRIAGE on-device triage systems


🏁 Final Words

Disasters, minutes matter. DisasterNet enables real-time, community-driven reporting and alerting to save lives.

Systems must work in worst-case scenarios

Data trust is as important as data itself

Graph thinking unlocks powerful coordination

In disasters, communication is survival. DisasterNet ensures it never stops.
