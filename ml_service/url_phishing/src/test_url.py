import joblib
import pandas as pd
from urllib.parse import unquote, urlparse
import re
import tldextract
from risk_engine import rule_based_risk
from live_blacklist_vt import check_virustotal

# ================= LOAD MODEL + FEATURE ORDER =================
model = joblib.load("models/url_phishing_rf.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

# ================= PREPROCESSING =================
def normalize_url(url):
    if not isinstance(url, str):
        return None
    url = url.strip().lower()
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    return url

def has_encoded_chars(url):
    return int("%" in url)

def decode_url(url):
    try:
        return unquote(url)
    except Exception:
        return url

# ================= FEATURE EXTRACTION =================
SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "update", "account",
    "bank", "confirm", "signin", "payment"
]

def has_ip_address(netloc):
    return int(bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", netloc)))

def extract_features(url, has_encoded):
    parsed = urlparse(url)
    ext = tldextract.extract(url)

    features = {}

    # Lexical
    features['url_length'] = len(url)
    features['dot_count'] = url.count('.')
    features['hyphen_count'] = url.count('-')
    features['digit_count'] = sum(c.isdigit() for c in url)
    features['special_char_count'] = len(re.findall(r"[^\w\-\.]", url))
    features['has_at_symbol'] = int('@' in url)

    # Structural
    features['subdomain_count'] = len(ext.subdomain.split('.')) if ext.subdomain else 0
    features['path_length'] = len(parsed.path)
    features['query_param_count'] = len(parsed.query.split('&')) if parsed.query else 0

    # Security
    features['has_ip'] = has_ip_address(parsed.netloc)
    features['has_https'] = int(parsed.scheme == 'https')
    features['has_encoded'] = has_encoded

    # Keywords
    features['suspicious_keyword_count'] = sum(
        1 for word in SUSPICIOUS_KEYWORDS if word in url
    )

    return features

# ================= TEST URL =================
test_url = "https://www.goclasses.in"   # change freely

# Preprocess
normalized = normalize_url(test_url)
encoded_flag = has_encoded_chars(normalized)
decoded = decode_url(normalized)

# Extract features
features = extract_features(decoded, encoded_flag)

print("\nExtracted features:")
for k, v in features.items():
    print(f"{k}: {v}")

# Align feature order
X_test = pd.DataFrame([features])
X_test = X_test.reindex(columns=feature_columns, fill_value=0)

# ================= ML PREDICTION =================
prediction = model.predict(X_test)[0]
ml_probability = model.predict_proba(X_test)[0][1] * 100

print("\nML Prediction:", "PHISHING" if prediction == 1 else "LEGITIMATE")
print("ML Phishing Probability:", round(ml_probability, 2), "%")

# ================= RULE-BASED RISK =================
rule_risk, reasons = rule_based_risk(features,decoded)

final_risk = min(100, ml_probability + rule_risk)

# ✅ TRUSTED DOMAIN OVERRIDE
if "Trusted domain detected" in reasons:
    final_risk = min(final_risk, 10)
    level = "LOW RISK"
else:
    if final_risk >= 70:
        level = "HIGH RISK"
    elif final_risk >= 40:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"


# ===== VIRUSTOTAL LIVE CHECK (DEMO ONLY) =====
vt_result = check_virustotal(decoded)

if vt_result is True:
    print("\nFINAL SECURITY ASSESSMENT")
    print("-------------------------")
    print("Final Risk Score: 100 %")
    print("Risk Level: HIGH RISK")
    print("\nReasons:")
    print("- URL flagged as malicious by VirusTotal")
    exit()

elif vt_result is None:
    print("\n[Info] VirusTotal unavailable or quota exceeded. Falling back.")

# ================= FINAL OUTPUT =================
print("\nFINAL SECURITY ASSESSMENT")
print("-------------------------")
print("Final Risk Score:", round(final_risk, 2), "%")
print("Risk Level:", level)

if reasons:
    print("\nReasons:")
    for r in reasons:
        print("-", r)
else:
    print("\nReasons: None detected")
