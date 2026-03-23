# vpa_risk_engine.py

import re


SUSPICIOUS_KEYWORDS = [
    "refund", "cashback", "reward", "rbi",
    "bank", "support", "helpdesk", "care",
    "kyc", "verify", "update", "blocked"
]

COMMON_BANK_HANDLES = [
    "oksbi", "okaxis", "okicici", "ybl", "ibl", "axl"
]


def analyze_vpa(vpa: str):
    """
    Analyze UPI ID (VPA) for suspicious patterns.
    Returns risk score and reasons.
    """

    risk = 0
    reasons = []

    if not vpa or "@" not in vpa:
        return {
            "vpa_valid": False,
            "vpa_risk_score": 50,
            "risk_level": "MEDIUM RISK",
            "reasons": ["Invalid UPI ID format"]
        }

    prefix, handle = vpa.lower().split("@", 1)

    # 1️⃣ Suspicious Keywords
    for word in SUSPICIOUS_KEYWORDS:
        if word in prefix:
            risk += 20
            reasons.append(f"Suspicious keyword detected: '{word}'")

    # 2️⃣ Too Many Digits
    digit_count = sum(c.isdigit() for c in prefix)
    if digit_count >= 4:
        risk += 15
        reasons.append("High number of digits in UPI ID")

    # 3️⃣ Random Pattern Check
    if len(prefix) > 15:
        risk += 10
        reasons.append("Unusually long UPI prefix")

    # 4️⃣ Handle Check
    if handle not in COMMON_BANK_HANDLES:
        risk += 10
        reasons.append("Uncommon or suspicious UPI handle")

    # Cap risk
    risk = min(risk, 100)

    # Risk level
    if risk >= 70:
        level = "HIGH RISK"
    elif risk >= 40:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"

    return {
        "vpa_valid": True,
        "vpa_risk_score": risk,
        "risk_level": level,
        "reasons": reasons
    }