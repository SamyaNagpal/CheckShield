import os
import re
import joblib
import pandas as pd
from urllib.parse import urlparse

# Import URL analyzer
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../url_phishing/src")))
from final_decision_engine import analyze_url

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# ---------------- LOAD MODELS ----------------
vectorizer = joblib.load(os.path.join(MODEL_DIR, "email_tfidf.pkl"))
model = joblib.load(os.path.join(MODEL_DIR, "email_lr.pkl"))

# ---------------- RULE KEYWORDS ----------------
SUSPICIOUS_PHRASES = [
    "urgent", "verify", "account suspended", "click here",
    "immediately", "bank", "password", "crypto",
    "limited time", "act now"
]

FINANCIAL_WORDS = [
    "bank", "payment", "invoice", "credit", "debit",
    "transaction", "refund"
]

# ---------------- CLEAN FUNCTION ----------------
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ---------------- RULE ENGINE ----------------
def rule_based_risk(email_text):

    risk = 0
    reasons = []

    text_lower = email_text.lower()

    for phrase in SUSPICIOUS_PHRASES:
        if phrase in text_lower:
            risk += 5
            reasons.append(f"Suspicious phrase detected: '{phrase}'")

    for word in FINANCIAL_WORDS:
        if word in text_lower:
            risk += 3
            reasons.append(f"Financial keyword detected: '{word}'")

    # Excessive exclamation marks
    if email_text.count("!") > 5:
        risk += 5
        reasons.append("Excessive exclamation marks")

    # ALL CAPS detection
    words = email_text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 3]
    if len(caps_words) > 3:
        risk += 5
        reasons.append("Multiple ALL-CAPS words")

    return risk, reasons


# ---------------- URL EXTRACTION ----------------
def extract_urls(text):
    return re.findall(r'https?://\S+', text)


# ---------------- FINAL ANALYSIS ----------------
def analyze_email(email_text):

    # 1️⃣ ML Spam Probability
    cleaned = clean_text(email_text)
    tfidf_vector = vectorizer.transform([cleaned])

    proba = model.predict_proba(tfidf_vector)[0]
    spam_index = list(model.classes_).index(1)
    spam_probability = proba[spam_index] * 100

    # 2️⃣ Rule-based scoring
    rule_risk, rule_reasons = rule_based_risk(email_text)

    # 3️⃣ URL Risk
    urls = extract_urls(email_text)
    max_url_risk = 0
    url_results = []

    for url in urls:
        url_result = analyze_url(url)
        max_url_risk = max(max_url_risk, url_result["risk_score"])
        url_results.append(url_result)

    # 4️⃣ Weighted Aggregation
    ML_WEIGHT = 0.6
    RULE_WEIGHT = 0.2
    URL_WEIGHT = 0.2

    final_risk = (
        (spam_probability * ML_WEIGHT) +
        (rule_risk * RULE_WEIGHT) +
        (max_url_risk * URL_WEIGHT)
    )

    final_risk = min(100, final_risk)

    # 5️⃣ Risk Level
    if final_risk >= 80:
        level = "CRITICAL RISK"
    elif final_risk >= 60:
        level = "HIGH RISK"
    elif final_risk >= 35:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"

    return {
        "email_risk_score": round(final_risk, 2),
        "risk_level": level,
        "ml_spam_probability": round(spam_probability, 2),
        "rule_risk": rule_risk,
        "max_url_risk": max_url_risk,
        "urls_analyzed": url_results,
        "reasons": rule_reasons
    }
