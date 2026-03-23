# src/app.py

from fastapi import FastAPI, HTTPException, UploadFile, File
import shutil
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import Counter
import sys
import os

# ==========================================================
# PATH SETUP
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

URL_PATH   = os.path.join(BASE_DIR, "url_phishing", "src")
EMAIL_PATH = os.path.join(BASE_DIR, "email_spam", "src")
UPI_PATH   = os.path.join(BASE_DIR, "upi_module", "src")

sys.path.append(URL_PATH)
sys.path.append(EMAIL_PATH)
sys.path.append(UPI_PATH)

# ==========================================================
# IMPORT MODULES
# ==========================================================

from final_decision_engine import analyze_url
from email_decision_engine import analyze_email
from upi_decision_engine import analyze_upi_message
from qr_analyzer import analyze_qr_image


# ==========================================================
# FASTAPI INIT
# ==========================================================

app = FastAPI(
    title="CheckShield Security API",
    description="Hybrid ML Cyber Fraud Detection Engine",
    version="3.0.0"
)

# ==========================================================
# ENABLE CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# REQUEST SCHEMAS
# ==========================================================

class URLRequest(BaseModel):
    url: str


class EmailRequest(BaseModel):
    email_text: str


class UPIRequest(BaseModel):
    message: str


class QRRequest(BaseModel):
    image_path: str


# ==========================================================
# IN-MEMORY ANALYTICS
# ==========================================================

url_scan_history = []
email_scan_history = []
upi_scan_history = []


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/")
def root():
    return {
        "message": "CheckShield Security API is running.",
        "modules": [
            "URL Phishing Detection",
            "Email Scam Detection",
            "UPI Scam Detection",
            "QR Scam Detection"
        ]
    }


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


# ==========================================================
# 💰 UPI SCAM MODULE
# ==========================================================

@app.post("/analyze-upi")
def analyze_upi_endpoint(request: UPIRequest):

    try:

        result = analyze_upi_message(request.message)

        upi_scan_history.append(result)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics-upi")
def get_upi_analytics():

    if not upi_scan_history:
        return {
            "total_upi_scans": 0,
            "message": "No UPI scans yet."
        }

    total_scans = len(upi_scan_history)

    avg_risk = sum(scan["final_risk"] for scan in upi_scan_history) / total_scans

    risk_levels = [scan["risk_level"] for scan in upi_scan_history]
    risk_distribution = Counter(risk_levels)

    return {
        "total_upi_scans": total_scans,
        "average_upi_risk": round(avg_risk, 2),
        "risk_distribution": risk_distribution
    }


# ==========================================================
# 📷 QR SCAM MODULE
# ==========================================================

@app.post("/analyze-qr")
async def analyze_qr_endpoint(file: UploadFile = File(...)):

    try:

        temp_file_path = f"temp_{file.filename}"

        # Save uploaded image
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run QR analyzer
        result = analyze_qr_image(temp_file_path)

        # Delete temporary file
        os.remove(temp_file_path)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================================
# 📊 DASHBOARD STATS
# ==========================================================

@app.get("/dashboard-stats")
def get_dashboard_stats():

    total_url = len(url_scan_history)
    total_email = len(email_scan_history)
    total_upi = len(upi_scan_history)

    total_scans = total_url + total_email + total_upi

    high_risk = 0
    medium_risk = 0
    low_risk = 0

    # URL
    for scan in url_scan_history:
        if scan["risk_level"] == "HIGH RISK":
            high_risk += 1
        elif scan["risk_level"] == "MEDIUM RISK":
            medium_risk += 1
        else:
            low_risk += 1

    # EMAIL
    for scan in email_scan_history:
        if scan["risk_level"] == "HIGH RISK":
            high_risk += 1
        elif scan["risk_level"] == "MEDIUM RISK":
            medium_risk += 1
        else:
            low_risk += 1

    # UPI
    for scan in upi_scan_history:
        if scan["risk_level"] == "HIGH RISK":
            high_risk += 1
        elif scan["risk_level"] == "MEDIUM RISK":
            medium_risk += 1
        else:
            low_risk += 1

    threats_detected = high_risk + medium_risk

    return {
        "total_scans": total_scans,
        "threats_detected": threats_detected,
        "high_risk_alerts": high_risk,
        "safe_verified": low_risk
    }

# ==========================================================
# 📊 THREAT DISTRIBUTION
# ==========================================================

@app.get("/threat-distribution")
def get_threat_distribution():

    url_count = len(url_scan_history)
    email_count = len(email_scan_history)
    upi_count = len(upi_scan_history)

    total = url_count + email_count + upi_count

    if total == 0:
        return {
            "phishing": 0,
            "email": 0,
            "upi": 0,
            "qr": 0
        }

    phishing = round((url_count / total) * 100)
    email = round((email_count / total) * 100)
    upi = round((upi_count / total) * 100)

    # QR scans currently come from UPI module
    qr = 0

    return {
        "phishing": phishing,
        "email": email,
        "upi": upi,
        "qr": qr
    }

# ---- ADD THESE BELOW YOUR EXISTING ROUTES ----

@app.post("/ml/analyze-url")
def ml_analyze_url(request: URLRequest):
    try:
        result = analyze_url(request.url)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ml/analyze-email")
def ml_analyze_email(request: EmailRequest):
    try:
        result = analyze_email(request.email_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ml/analyze-upi")
def ml_analyze_upi(request: UPIRequest):
    try:
        result = analyze_upi_message(request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ml/analyze-qr")
async def ml_analyze_qr(file: UploadFile = File(...)):
    try:
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = analyze_qr_image(temp_file_path)
        os.remove(temp_file_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))