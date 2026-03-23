# src/live_blacklist_vt.py

import requests

VT_API_KEY = "aac38df8075dc06077ee4a7d9a20ae6aa1e20a34d91b0e7dbbbb746e5636397a"
VT_URL_LOOKUP = "https://www.virustotal.com/api/v3/urls"

def check_virustotal(url):
    """
    Returns:
    True  -> malicious
    False -> not malicious
    None  -> API error / quota / network
    """
    try:
        headers = {
            "x-apikey": VT_API_KEY
        }

        # VirusTotal requires URL to be encoded
        import base64
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")

        response = requests.get(
            f"{VT_URL_LOOKUP}/{url_id}",
            headers=headers,
            timeout=5
        )

        if response.status_code != 200:
            return None

        data = response.json()
        stats = data["data"]["attributes"]["last_analysis_stats"]

        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)

        return (malicious + suspicious) > 0

    except Exception:
        return None
