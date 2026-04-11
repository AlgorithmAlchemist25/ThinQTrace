🧠 ThinQTrace – Behavioral-Based Cognitive Load Detection System

ThinQTrace is a privacy-first cognitive load detection system that estimates a user's mental workload using natural behavioral signals such as typing patterns, reaction time, and attention performance.

Instead of relying on expensive sensors or biometric devices, ThinQTrace analyzes everyday digital interactions to infer cognitive load levels and provide meaningful insights.

🚀 Project Overview

Modern digital environments require constant interaction with computers, which can lead to mental fatigue and cognitive overload.

ThinQTrace addresses this problem by measuring cognitive load through three behavioral tasks:

⌨️ Typing Test – analyzes typing speed, key errors, and typing rhythm

⚡ Reaction Test – measures response time and reflex degradation

🎯 Attention Test – evaluates focus and visual discrimination ability

Using these signals, the system estimates a Cognitive Load Score:

Low  |  Medium  |  High

This helps identify mental strain early and encourages healthier digital habits.

✨ Key Features

• Non-intrusive detection – no cameras, sensors, or biometrics
• Behavior-based analysis – uses natural user interactions
• Privacy-first design – only anonymous interaction data collected
• Explainable AI – predictions based on interpretable behavioral features
• Lightweight architecture – runs in browser + simple backend

🧩 System Workflow
User Interaction
      ↓
Behavioral Data Collection
(typing speed, errors, reaction time)
      ↓
Feature Engineering
      ↓
Machine Learning Model
      ↓
Cognitive Load Score
(Low / Medium / High)
      ↓
Actionable Insights
🛠️ Tech Stack
Frontend

React.js

Vite

CSS

Backend

Python

FastAPI

Database

SQLite / MongoDB

Machine Learning

Scikit-learn

Pandas

NumPy

📂 Project Structure
ThinQTrace
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── thinktrace.db
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   └── tests
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/AlgorithmAlchemist25/ThinQTrace.git
cd ThinQTrace
2️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python main.py

Backend will run on:

http://localhost:8000
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:5173
📊 Dataset Strategy

The dataset is collected through controlled micro-tasks:

Typing rhythm

Error frequency

Reaction latency

Task accuracy

Labels are derived using validated cognitive load self-report scales.

🔐 Ethics & Privacy

ThinQTrace is designed with responsible AI principles.

✔ No biometric data
✔ No camera or microphone access
✔ Anonymous behavioral signals only
✔ User consent and transparency

🎯 Future Improvements

• Real-time cognitive load visualization
• Adaptive workload recommendation system
• Advanced ML models for behavioral pattern detection
• Integration with productivity tools
• Research dataset publication

Contributers
Isha Katiyar
Janavi Arora
