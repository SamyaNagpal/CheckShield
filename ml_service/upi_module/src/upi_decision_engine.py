# upi_decision_engine.py

import re
from upi_parser import parse_upi_uri
from vpa_risk_engine import analyze_vpa
from text_rule_engine import analyze_text_rules


def extract_upi_uri_from_text(message: str):
    """
    Extracts UPI URI from message if present.
    """
    pattern = r"upi://[^\s]+"
    match = re.search(pattern, message)
    return match.group(0) if match else None


def analyze_upi_message(message: str):

    explanations = []

    # ---------------- 1️⃣ TEXT RISK ----------------
    text_result = analyze_text_rules(message)
    text_risk = text_result["text_rule_risk"]
    explanations.extend(text_result["scam_patterns_detected"])

    # ---------------- 2️⃣ URI + VPA ANALYSIS ----------------
    upi_uri = extract_upi_uri_from_text(message)
    uri_present = False
    vpa_risk = 0

    if upi_uri:
        uri_present = True

        uri_data = parse_upi_uri(upi_uri)

        if uri_data["valid_upi"]:
            vpa = uri_data.get("payee_address")

            if vpa:
                vpa_result = analyze_vpa(vpa)
                vpa_risk = vpa_result["vpa_risk_score"]
                explanations.extend(vpa_result["reasons"])

            # High amount detection
            amount = uri_data.get("amount")
            if amount and amount.isdigit():
                if int(amount) > 10000:
                    explanations.append("High transaction amount detected")
                    vpa_risk += 10

    # ---------------- 3️⃣ RISK AGGREGATION ----------------

    # Base additive model
    total_risk = text_risk + vpa_risk

    # Synergy escalation (very important)
    if text_risk >= 40 and vpa_risk >= 20:
        total_risk += 20
        explanations.append("Multiple scam layers detected (Text + VPA)")

    # URI presence boost
    if uri_present:
        total_risk += 10

    # Cap risk
    final_risk = min(total_risk, 100)

    # ---------------- 4️⃣ RISK LEVEL ----------------
    if final_risk >= 80:
        level = "CRITICAL"
    elif final_risk >= 60:
        level = "HIGH RISK"
    elif final_risk >= 30:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"

    return {
        "final_risk": final_risk,
        "risk_level": level,
        "text_risk": text_risk,
        "vpa_risk": vpa_risk,
        "uri_present": uri_present,
        "explanations": explanations
    }