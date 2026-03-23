import csv
import os
import email
import pandas as pd

# Get base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

os.makedirs(PROCESSED_DIR, exist_ok=True)


def parse_email(file_path):
    """
    Extract subject + body from raw email file
    """
    with open(file_path, "r", encoding="latin-1", errors="ignore") as f:
        msg = email.message_from_file(f)

    subject = msg.get("Subject", "")
    body = ""

    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    body += part.get_payload(decode=True).decode("latin-1", errors="ignore")
                except:
                    pass
    else:
        try:
            body = msg.get_payload(decode=True)
            if body:
                body = body.decode("latin-1", errors="ignore")
        except:
            body = ""

    return subject + " " + body


def load_dataset():
    emails = []
    labels = []

    ham_folders = ["easy_ham", "easy_ham_2", "hard_ham"]
    spam_folders = ["spam", "spam_2"]

    # Load ham emails
    for folder in ham_folders:
        folder_path = os.path.join(RAW_DIR, folder)
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            text = parse_email(file_path)
            emails.append(text)
            labels.append(0)  # 0 = ham

    # Load spam emails
    for folder in spam_folders:
        folder_path = os.path.join(RAW_DIR, folder)
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            text = parse_email(file_path)
            emails.append(text)
            labels.append(1)  # 1 = spam

    df = pd.DataFrame({
        "text": emails,
        "label": labels
    })

    return df


if __name__ == "__main__":
    df = load_dataset()

    print("Dataset loaded successfully.")
    print("Shape:", df.shape)
    print("\nLabel distribution:")
    print(df["label"].value_counts())

    output_path = os.path.join(PROCESSED_DIR, "emails.csv")
    df.to_csv(
    output_path,
    index=False,
    encoding="utf-8",
    quoting=csv.QUOTE_ALL,
    escapechar="\\"
)
    print("\nSaved to:", output_path)
