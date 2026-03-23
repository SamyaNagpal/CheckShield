import pandas as pd
from urllib.parse import unquote, urlparse

# Load cleaned dataset
df = pd.read_csv("data/processed/url_label_only.csv")

def normalize_url(url):
    if not isinstance(url, str):
        return None
    
    url = url.strip().lower()

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    return url

def decode_url(url):
    try:
        decoded = unquote(url)
        return decoded
    except Exception:
        return url
    
def has_encoded_chars(url):
    return int("%" in url)

def is_valid_url(url):
    try:
        parsed = urlparse(url)
        return all([parsed.scheme, parsed.netloc])
    except Exception:
        return False

processed_urls = []
encoded_flags = []

for url in df['URL']:
    url = normalize_url(url)
    if url is None:
        processed_urls.append(None)
        encoded_flags.append(0)
        continue

    encoded_flags.append(has_encoded_chars(url))
    url = decode_url(url)

    if not is_valid_url(url):
        processed_urls.append(None)
    else:
        processed_urls.append(url)

df['clean_url'] = processed_urls
df['has_encoded'] = encoded_flags

df = df.dropna(subset=['clean_url']).reset_index(drop=True)

output_path = "data/processed/url_preprocessed.csv"
df.to_csv(output_path, index=False)

print("Preprocessing complete.")
print("Final dataset shape:", df.shape)

