# text_rule_engine.py

import re


SCAM_PATTERNS = {
    "collect_request": [
        "approve to receive",
        "collect request",
        "accept to get",
        "receive money approve",
        "request pending"
    ],
    "refund_trap": [
        "refund pending",
        "cashback",
        "reward credited",
        "refund failed",
        "reversal"
    ],
    "kyc_threat": [
        "account blocked",
        "update kyc",
        "pan verification",
        "aadhaar update",
        "rbi notice"
    ],
    "urgency": [
        "urgent",
        "immediately",
        "act now",
        "limited time",
        "within"
    ],
    "otp_scam": [
        "share otp",
        "send otp",
        "provide pin",
        "enter pin",
        "never share otp"
    ],
    "qr_receive_trap": [
        "scan to receive",
        "scan qr to get",
        "scan to get refund"
    ]
}


def analyze_text_rules(message: str):
    """
    Analyze UPI-related scam message using rule patterns.
    """

    message_lower = message.lower()
    risk = 0
    reasons = []

    for category, phrases in SCAM_PATTERNS.items():
        for phrase in phrases:
            if phrase in message_lower:
                risk += 10
                reasons.append(f"{category.replace('_', ' ').title()} detected: '{phrase}'")

    # Extra logic: detect contradiction
    if "receive" in message_lower and "approve" in message_lower:
        risk += 15
        reasons.append("Collect request deception pattern detected")

    # Cap risk
    risk = min(risk, 100)

    # Risk level
    if risk >= 60:
        level = "HIGH RISK"
    elif risk >= 30:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"

    return {
        "text_rule_risk": risk,
        "risk_level": level,
        "scam_patterns_detected": reasons
    }