# src/app.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import Counter
import sys
import os

# ---------------- IMPORT URL MODULE ----------------
from final_decision_engine import analyze_url

# ---------------- IMPORT EMAIL MODULE ----------------
EMAIL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../email_spam/src")
)
sys.path.append(EMAIL_PATH)

from email_decision_engine import analyze_email

# ---------------- APP INIT ----------------
app = FastAPI(
    title="CheckShield Security API",
    description="Hybrid ML Security Engine (URL + Email)",
    version="2.0.0"
)

# ---------------- ENABLE CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- REQUEST SCHEMAS ----------------
class URLRequest(BaseModel):
    url: str


class EmailRequest(BaseModel):
    email_text: str


# ---------------- IN-MEMORY ANALYTICS ----------------
url_scan_history = []
email_scan_history = []


# ---------------- HEALTH CHECK ----------------
@app.get("/")
def root():
    return {"message": "CheckShield Security API is running."}


# ==========================================================
# 🛡️ URL MODULE
# ==========================================================

@app.post("/analyze")
def analyze_url_endpoint(request: URLRequest):
    try:
        result = analyze_url(request.url)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        url_scan_history.append(result)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics")
def get_url_analytics():

    if not url_scan_history:
        return {
            "total_url_scans": 0,
            "message": "No URL scans yet."
        }

    total_scans = len(url_scan_history)
    avg_risk = sum(scan["risk_score"] for scan in url_scan_history) / total_scans

    risk_levels = [scan["risk_level"] for scan in url_scan_history]
    risk_distribution = Counter(risk_levels)

    return {
        "total_url_scans": total_scans,
        "average_url_risk": round(avg_risk, 2),
        "risk_distribution": risk_distribution
    }


# ==========================================================
# 📧 EMAIL MODULE
# ==========================================================

@app.post("/analyze-email")
def analyze_email_endpoint(request: EmailRequest):
    try:
        result = analyze_email(request.email_text)

        email_scan_history.append(result)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics-email")
def get_email_analytics():

    if not email_scan_history:
        return {
            "total_email_scans": 0,
            "message": "No email scans yet."
        }

    total_scans = len(email_scan_history)
    avg_risk = sum(scan["email_risk_score"] for scan in email_scan_history) / total_scans

    risk_levels = [scan["risk_level"] for scan in email_scan_history]
    risk_distribution = Counter(risk_levels)

    return {
        "total_email_scans": total_scans,
        "average_email_risk": round(avg_risk, 2),
        "risk_distribution": risk_distribution
    }
