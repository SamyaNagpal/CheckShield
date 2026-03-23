import pandas as pd
import re
from urllib.parse import urlparse
import tldextract
import math
from collections import Counter

SUSPICIOUS_KEYWORDS = [
    "login","verify","secure","update","account",
    "bank","confirm","signin","payment","password",
    "wallet","recover"
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

    # -------- Keywords --------
    keyword_count = sum(1 for word in SUSPICIOUS_KEYWORDS if word in url)
    features['suspicious_keyword_count'] = keyword_count

    # -------- Keyword density --------
    features['keyword_density'] = keyword_count / max(len(url),1)

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


# ================= LOAD DATASET =================

df = pd.read_csv("data/processed/url_preprocessed.csv")

feature_rows = []

for _, row in df.iterrows():

    feats = extract_features(row['clean_url'], row['has_encoded'])
    feats['label'] = row['label']

    feature_rows.append(feats)


feature_df = pd.DataFrame(feature_rows)

output_path = "data/processed/url_features.csv"
feature_df.to_csv(output_path, index=False)

print("Feature extraction complete.")
print("Feature dataset shape:", feature_df.shape)
print(feature_df.head())