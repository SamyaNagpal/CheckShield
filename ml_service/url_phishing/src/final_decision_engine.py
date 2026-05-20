import joblib
import os
import pandas as pd
from urllib.parse import unquote, urlparse
import re
import tldextract
import math

from risk_engine import rule_based_risk
from live_blacklist_vt import check_virustotal

# ================= LOAD MODEL =================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "url_phishing_rf.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "models", "feature_columns.pkl")

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)


# ================= TRUSTED DOMAINS =================

TRUSTED_DOMAINS = [
    "google.com", "google.co.in", "youtube.com",
    "amazon.com", "amazon.in",
    "microsoft.com", "outlook.com", "live.com",
    "apple.com", "icloud.com",
    "paypal.com",
    "github.com", "gitlab.com",
    "linkedin.com",
    "twitter.com", "x.com",
    "instagram.com", "facebook.com", "meta.com",
    "netflix.com",
    "flipkart.com", "myntra.com",
    "hdfc.com", "hdfcbank.com",
    "sbi.co.in", "onlinesbi.com",
    "icicibank.com", "axisbank.com",
    "paytm.com", "phonepe.com",
    "irctc.co.in",
    "incometax.gov.in", "uidai.gov.in"
]


def is_trusted(url):
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower().replace('www.', '')
        return any(domain == t or domain.endswith('.' + t) for t in TRUSTED_DOMAINS)
    except:
        return False


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
    except:
        return url


# ================= FEATURE SETTINGS =================

SUSPICIOUS_KEYWORDS = [
    "login","verify","secure","update","account",
    "bank","confirm","signin","payment",
    "password","wallet","recover"
]

SUSPICIOUS_TLDS = [
    "xyz","top","tk","ml","gq","cf","click","work","buzz","info"
]

BRANDS = [
    "paypal","amazon","google","microsoft","apple",
    "facebook","instagram","netflix","bank","hdfc","sbi"
]


def has_ip_address(netloc):
    return int(bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", netloc)))


def shannon_entropy(string):
    prob = [float(string.count(c)) / len(string) for c in dict.fromkeys(list(string))]
    return -sum([p * math.log2(p) for p in prob])


# ================= FEATURE EXTRACTION =================

def extract_features(url, has_encoded):

    parsed = urlparse(url)
    ext = tldextract.extract(url)

    features = {}

    # -------- Lexical --------
    features['url_length'] = len(url)
    features['dot_count'] = url.count('.')
    features['hyphen_count'] = url.count('-')
    features['digit_count'] = sum(c.isdigit() for c in url)
    features['special_char_count'] = len(re.findall(r"[^\w\-\.]", url))
    features['has_at_symbol'] = int('@' in url)

    # -------- Structural --------
    features['subdomain_count'] = len(ext.subdomain.split('.')) if ext.subdomain else 0
    features['path_length'] = len(parsed.path)
    features['query_param_count'] = len(parsed.query.split('&')) if parsed.query else 0

    # -------- Security --------
    features['has_ip'] = has_ip_address(parsed.netloc)
    features['has_https'] = int(parsed.scheme == 'https')
    features['has_encoded'] = has_encoded

    # -------- Keyword features --------
    keyword_count = sum(1 for word in SUSPICIOUS_KEYWORDS if word in url)
    features['suspicious_keyword_count'] = keyword_count
    features['keyword_density'] = keyword_count / max(len(url), 1)

    # -------- Suspicious TLD --------
    features['suspicious_tld'] = int(ext.suffix in SUSPICIOUS_TLDS)

    # -------- Brand detection --------
    features['brand_present'] = int(any(brand in url for brand in BRANDS))

    # -------- Domain complexity --------
    domain_words = ext.domain.split("-")
    features['domain_word_count'] = len(domain_words)
    features['domain_length'] = len(ext.domain)

    # -------- Hyphen abuse --------
    features['many_hyphens'] = int(url.count("-") >= 2)

    # -------- Entropy --------
    features['domain_entropy'] = shannon_entropy(ext.domain)

    return features


# ================= FINAL DECISION =================

def analyze_url(input_url):

    normalized = normalize_url(input_url)

    if not normalized:
        return {"error": "Invalid URL format"}

    encoded_flag = has_encoded_chars(normalized)
    decoded = decode_url(normalized)

    # -------- TRUSTED DOMAIN EARLY EXIT --------
    if is_trusted(decoded):
        return {
            "url": input_url,
            "risk_score": 0,
            "risk_level": "LOW RISK",
            "ml_probability": 0,
            "rule_risk": 0,
            "blacklist_flag": False,
            "reasons": ["Trusted domain verified"]
        }

    features = extract_features(decoded, encoded_flag)

    X_test = pd.DataFrame([features])
    X_test = X_test.reindex(columns=feature_columns, fill_value=0)

    # -------- ML prediction --------
    proba = model.predict_proba(X_test)[0]
    classes = model.classes_
    phishing_index = list(classes).index(1)
    ml_probability = proba[phishing_index] * 100

    # -------- Rule engine --------
    rule_risk, reasons = rule_based_risk(features, decoded)

    # -------- Fusion Strategy --------
    if rule_risk >= 70:
        final_risk = rule_risk
    elif rule_risk >= 40:
        final_risk = max(rule_risk, ml_probability)
    else:
        final_risk = (ml_probability * 0.7) + (rule_risk * 0.3)

    final_risk = min(100, final_risk)

    # -------- VirusTotal --------
    vt_result = check_virustotal(decoded)
    blacklist_flag = False

    if vt_result is True:
        final_risk = 100
        blacklist_flag = True
        reasons.append("Flagged as malicious by VirusTotal")

    # -------- Risk level --------
    if final_risk >= 70:
        level = "HIGH RISK"
    elif final_risk >= 40:
        level = "MEDIUM RISK"
    else:
        level = "LOW RISK"

    return {
        "url": input_url,
        "risk_score": round(final_risk, 2),
        "risk_level": level,
        "ml_probability": round(ml_probability, 2),
        "rule_risk": rule_risk,
        "blacklist_flag": blacklist_flag,
        "reasons": reasons
    }