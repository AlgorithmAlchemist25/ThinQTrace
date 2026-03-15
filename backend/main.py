from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import math
import sqlite3
import json

app = FastAPI(title="ThinQTrace API", description="Behavioral-Based Cognitive Detection System")

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('thinktrace.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS sessions
                 (session_id TEXT PRIMARY KEY, task_type TEXT, score TEXT, metrics TEXT, raw_events TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
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

@app.get("/")
def read_root():
    return {"message": "Welcome to ThinQTrace API"}

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
    
    # Safely dump events to JSON
    events_json = json.dumps([{"key": e.key, "timestamp": e.timestamp, "eventType": e.eventType, "isCorrect": getattr(e, 'isCorrect', None)} for e in events])
    metrics_json = json.dumps(metrics)
    
    c.execute("INSERT OR REPLACE INTO sessions (session_id, task_type, score, metrics, raw_events) VALUES (?, ?, ?, ?, ?)",
              (session.sessionId, session.taskType, score, metrics_json, events_json))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "sessionId": session.sessionId,
        "metrics": metrics,
        "cognitive_score": score
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
