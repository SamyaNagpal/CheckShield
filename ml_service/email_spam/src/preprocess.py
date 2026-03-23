import os
import re
import pandas as pd
import nltk
from nltk.corpus import stopwords

# Download stopwords once
nltk.download("stopwords")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "emails.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "emails_cleaned.csv")

stop_words = set(stopwords.words("english"))


def clean_text(text):
    if not isinstance(text, str):
        return ""

    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove HTML tags
    text = re.sub(r"<.*?>", "", text)

    # Remove non-alphabet characters
    text = re.sub(r"[^a-z\s]", "", text)

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # Remove stopwords
    words = text.split()
    words = [word for word in words if word not in stop_words]

    return " ".join(words)


if __name__ == "__main__":

    df = pd.read_csv(INPUT_PATH)

    print("Cleaning text...")

    df["clean_text"] = df["text"].apply(clean_text)

    df = df[["clean_text", "label"]]

    df.to_csv(OUTPUT_PATH, index=False)

    print("Cleaning complete.")
    print("Saved to:", OUTPUT_PATH)
    print("Shape:", df.shape)
