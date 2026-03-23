from urllib.parse import urlparse
import tldextract

TRUSTED_DOMAINS = [
    "amazon.com",
    "amazon.in",
    "google.com",
    "google.co.in",
    "microsoft.com",
    "apple.com",
    "paypal.com"
]

SUSPICIOUS_TLDS = [
    "xyz",
    "top",
    "gq",
    "tk",
    "ml",
    "cf"
]

PHISHING_KEYWORDS = [
    "login",
    "verify",
    "account",
    "secure",
    "update",
    "bank",
    "confirm",
    "signin",
    "payment"
]


def is_trusted_domain(url):

    parsed = urlparse(url)
    domain = parsed.netloc.lower()

    for trusted in TRUSTED_DOMAINS:
        if domain.endswith(trusted):
            return True

    return False


def rule_based_risk(features, url):

    # -------- TRUSTED DOMAIN OVERRIDE --------
    if is_trusted_domain(url):
        return 0, ["Trusted domain detected"]

    risk = 0
    reasons = []

    parsed = urlparse(url)
    ext = tldextract.extract(url)

    domain = ext.domain

    # -------- IP Address --------
    if features['has_ip'] == 1:
        risk += 30
        reasons.append("IP address used instead of domain")

    # -------- @ Symbol --------
    if features['has_at_symbol'] == 1:
        risk += 40
        reasons.append("@ symbol redirect detected")

    # -------- Encoded Characters --------
    if features['has_encoded'] == 1:
        risk += 20
        reasons.append("Encoded characters detected")

    # -------- Suspicious Keywords --------
    if features['suspicious_keyword_count'] >= 3:
        risk += 40
        reasons.append("Multiple phishing keywords detected")

    elif features['suspicious_keyword_count'] == 2:
        risk += 25
        reasons.append("Suspicious keywords detected")

    # -------- Keywords in Domain --------
    for word in PHISHING_KEYWORDS:
        if word in domain:
            risk += 10
            reasons.append(f"Keyword '{word}' found in domain")

    # -------- Suspicious TLD --------
    if ext.suffix in SUSPICIOUS_TLDS:
        risk += 20
        reasons.append(f"Suspicious TLD .{ext.suffix}")

    # -------- Deep Subdomain --------
    if features['subdomain_count'] >= 2:
        risk += 15
        reasons.append("Deep subdomain structure")

    # -------- Long URL --------
    if features['url_length'] > 60:
        risk += 10
        reasons.append("Unusually long URL")

    return risk, reasons