from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import math
import sqlite3
import json
import hashlib
import secrets

app = FastAPI(title="ThinQTrace API", description="Behavioral-Based Cognitive Detection System")

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, token TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS sessions
                 (session_id TEXT PRIMARY KEY, task_type TEXT, score TEXT, metrics TEXT, raw_events TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    try:
        c.execute('''ALTER TABLE sessions ADD COLUMN user_id INTEGER''')
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()

init_db()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KeystrokeData(BaseModel):
    key: str
    timestamp: float
    eventType: str  # "keydown", "keyup", "reaction_click", "attention_click"
    isCorrect: bool | None = None  # for attention tests

class SessionData(BaseModel):
    sessionId: str
    taskType: str
    events: List[KeystrokeData]
    token: str | None = None

class UserSignup(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"message": "Welcome to ThinQTrace API"}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@app.post("/api/signup")
def signup(user: UserSignup):
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE username = ?", (user.username,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    
    pwd_hash = hash_password(user.password)
    c.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (user.username, pwd_hash))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "User created successfully"}

@app.post("/api/login")
def login(user: UserLogin):
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    pwd_hash = hash_password(user.password)
    c.execute("SELECT id FROM users WHERE username = ? AND password_hash = ?", (user.username, pwd_hash))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    user_id = row[0]
    token = secrets.token_hex(16)
    c.execute("UPDATE users SET token = ? WHERE id = ?", (token, user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "token": token, "username": user.username}

@app.post("/api/submit-data")
def submit_data(session: SessionData):
    events = session.events
    metrics = {}
    score = "Unknown"

    if session.taskType == "typing-test":
        keydowns = [e for e in events if e.eventType == "keydown"]
        if len(keydowns) < 2:
            return {"status": "error", "message": "Not enough data"}

        ikis = [keydowns[i].timestamp - keydowns[i-1].timestamp for i in range(1, len(keydowns))]
        avg_iki = sum(ikis) / len(ikis)
        variance = sum((x - avg_iki) ** 2 for x in ikis) / len(ikis) if len(ikis) > 1 else 0

        if variance > 50000 or avg_iki > 400:
            score = "High"
        elif variance > 20000 or avg_iki > 250:
            score = "Medium"
        else:
            score = "Low"

        metrics = {
            "average_iki_ms": round(avg_iki, 2),
            "variance": round(variance, 2),
            "key_count": len(keydowns)
        }

    elif session.taskType == "reaction-test":
        if not events:
             return {"status": "error", "message": "No reaction data"}
        
        # In a generic reaction test, we just look at the raw timestamp as response latency
        rt = events[0].timestamp
        
        if rt > 400:
            score = "High"
        elif rt > 250:
            score = "Medium"
        else:
            score = "Low"
            
        metrics = {
            "reaction_time_ms": rt
        }

    elif session.taskType == "drawing-test":
        if not events:
            return {"status": "error", "message": "No drawing data"}
        
        # We will map deviation score to the timestamp field of the first event for simplicity
        deviation = events[0].timestamp
        
        if deviation > 50:
            score = "High"
        elif deviation > 20:
            score = "Medium"
        else:
            score = "Low"
            
        metrics = {
            "average_deviation_px": round(deviation, 2)
        }

    elif session.taskType == "attention-test":
        if not events:
            return {"status": "error", "message": "No attention data"}
        
        correct_clicks = sum(1 for e in events if e.isCorrect)
        accuracy = (correct_clicks / len(events)) * 100
        
        search_times = [e.timestamp for e in events]
        avg_search_time = sum(search_times) / len(search_times) if search_times else 0

        if accuracy < 80 or avg_search_time > 1500:
            score = "High"
        elif accuracy < 100 or avg_search_time > 1000:
            score = "Medium"
        else:
            score = "Low"
            
        metrics = {
            "accuracy": round(accuracy, 2),
            "avg_search_time_ms": round(avg_search_time, 2)
        }
    
    else:
        # Default behavior
        score = "Low"
        metrics = {}

    # Save session and score to SQLite database
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    
    user_id = None
    if session.token:
        c.execute("SELECT id FROM users WHERE token = ?", (session.token,))
        row = c.fetchone()
        if row:
            user_id = row[0]

    # Safely dump events to JSON
    events_json = json.dumps([{"key": e.key, "timestamp": e.timestamp, "eventType": e.eventType, "isCorrect": getattr(e, 'isCorrect', None)} for e in events])
    metrics_json = json.dumps(metrics)
    
    c.execute("INSERT OR REPLACE INTO sessions (session_id, user_id, task_type, score, metrics, raw_events) VALUES (?, ?, ?, ?, ?, ?)",
              (session.sessionId, user_id, session.taskType, score, metrics_json, events_json))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "sessionId": session.sessionId,
        "metrics": metrics,
        "cognitive_score": score
    }

@app.get("/api/user/scores")
def get_user_scores(token: str):
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE token = ?", (token,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = row[0]

    c.execute("SELECT task_type, score, metrics, timestamp FROM sessions WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    rows = c.fetchall()
    conn.close()
    
    scores = []
    for r in rows:
        scores.append({
            "task_type": r[0],
            "score": r[1],
            "metrics": json.loads(r[2]) if r[2] else {},
            "timestamp": r[3]
        })
    return {"status": "success", "scores": scores}

@app.get("/api/predict-mental-health")
def predict_mental_health(token: str):
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE token = ?", (token,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = row[0]

    c.execute("SELECT task_type, score FROM sessions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10", (user_id,))
    rows = c.fetchall()
    conn.close()

    insights = []
    if not rows:
        insights = [
            "Your cognitive telemetry is currently empty.",
            "Complete assessments to unlock AI-driven insights.",
            "Start with a Reaction or Attention test to build your baseline."
        ]
        return {"status": "success", "predictions": insights}

    high_count = sum(1 for r in rows if r[1] == "High")
    low_count = sum(1 for r in rows if r[1] == "Low")
    
    if high_count > low_count and high_count > len(rows) * 0.4:
        insights.append("High cognitive load detected. You are experiencing mental fatigue.")
        insights.append("Your performance typically drops under sustained pressure.")
        insights.append("Recommended action: Step away for 10-15 minutes to restore bandwidth.")
    elif low_count >= len(rows) * 0.5:
        insights.append("Optimal cognitive state. Your mental bandwidth is clear.")
        insights.append("Best performance recorded during these recent sessions.")
        insights.append("You are ready for deep, focused work.")
    else:
        insights.append("Moderate cognitive friction detected.")
        insights.append("You are maintaining focus, but managing distractions will help.")
        insights.append("Consistent cadence is good. Avoid task-switching.")

    return {"status": "success", "predictions": insights}

@app.get("/api/research-summary")
def research_summary(token: str):
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute("SELECT id, username FROM users WHERE token = ?", (token,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id, username = row
    
    c.execute("SELECT task_type, score, metrics, timestamp FROM sessions WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    rows = c.fetchall()
    conn.close()
    
    if not rows:
        return {"status": "success", "summary": {"overall": "Not enough data collected yet.", "strengths": [], "improvements": [], "total_assessments": 0, "radar_data": []}}
        
    tests_taken = len(rows)
    
    # Categorical scoring
    scores = {"Focus": [], "Agility": [], "Control": [], "Cadence": []}
    
    for r in rows:
        task_type, _, metrics_json, _ = r
        metrics = json.loads(metrics_json) if metrics_json else {}
        
        if task_type == "attention-test":
            scores["Focus"].append(metrics.get("accuracy", 0))
        elif task_type == "reaction-test":
            rt = metrics.get("reaction_time_ms", 500)
            agility = max(0, min(100, 100 - (rt - 150) / 4)) # 150ms is pro, 550ms is bad
            scores["Agility"].append(agility)
        elif task_type == "drawing-test":
            dev = metrics.get("average_deviation_px", 50)
            control = max(0, min(100, 100 - dev * 1.5))
            scores["Control"].append(control)
        elif task_type == "typing-test":
            iki = metrics.get("average_iki_ms", 400)
            cadence = max(0, min(100, 100 - (iki - 100) / 5))
            scores["Cadence"].append(cadence)

    avg_scores = {k: round(sum(v)/len(v)) if v else 50 for k, v in scores.items()}
    radar_data = [
        {"subject": "Focus", "A": avg_scores["Focus"], "fullMark": 100},
        {"subject": "Agility", "A": avg_scores["Agility"], "fullMark": 100},
        {"subject": "Control", "A": avg_scores["Control"], "fullMark": 100},
        {"subject": "Cadence", "A": avg_scores["Cadence"], "fullMark": 100},
    ]

    # Threshold-based Insights Engine
    strengths = []
    improvements = []
    
    if avg_scores["Focus"] > 80: strengths.append("Exceptional selective attention and visual filtering accuracy.")
    if avg_scores["Agility"] > 75: strengths.append("Superior neural processing speed and reaction velocity.")
    if avg_scores["Control"] > 80: strengths.append("High precision in visual-motor synchronization and stability.")
    if avg_scores["Cadence"] > 80: strengths.append("Fluent digital behavioral rhythm with minimal cognitive friction.")
    
    if avg_scores["Focus"] < 65: improvements.append("Attentional filtering load detected; minimize environmental noise.")
    if avg_scores["Agility"] < 55: improvements.append("Sensory processing latency identified; check for ocular fatigue.")
    if avg_scores["Control"] < 60: improvements.append("Motor control fluctuations detected; ensure stable input ergonomics.")
    if avg_scores["Cadence"] < 60: improvements.append("Behavioral hesitation detected; prioritize bandwidth rest intervals.")

    high_stress = sum(1 for r in rows if r[1] == "High")
    
    if high_stress > tests_taken * 0.4:
        overall = f"Telemetric signals for {username} indicate significant cognitive fatigue. Your processing speed is fluctuating, suggesting high neuro-behavioral load requiring immediate bandwidth restoration."
    elif avg_scores["Focus"] > 80 and avg_scores["Agility"] > 70:
        overall = f"Optimal neuro-behavioral state detected for {username}. Your visual processing and response speed are currently aligned for high-complexity analytical tasks."
    else:
        overall = f"Moderate cognitive friction detected for {username}. Performance is stable but shows intermittent fluctuations in focus and motor precision."
        
    return {
        "status": "success", 
        "summary": {
            "overall": overall,
            "strengths": strengths if strengths else ["Baseline stability established"],
            "improvements": improvements if improvements else ["No critical optimizations detected"],
            "total_assessments": tests_taken,
            "radar_data": radar_data,
            "category_scores": avg_scores
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
