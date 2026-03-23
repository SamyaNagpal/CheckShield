import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "emails_cleaned.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------- LOAD DATA ----------------
df = pd.read_csv(INPUT_PATH)
# Remove NaN and empty texts
df = df.dropna(subset=["clean_text"])
df = df[df["clean_text"].str.strip() != ""]


X = df["clean_text"]
y = df["label"]

# ---------------- TRAIN-TEST SPLIT ----------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ---------------- TF-IDF ----------------
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1,2)
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# ---------------- NAIVE BAYES ----------------
nb_model = MultinomialNB()
nb_model.fit(X_train_tfidf, y_train)

nb_preds = nb_model.predict(X_test_tfidf)

print("\n===== Naive Bayes Results =====")
print(classification_report(y_test, nb_preds))

# ---------------- LOGISTIC REGRESSION ----------------
lr_model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

lr_model.fit(X_train_tfidf, y_train)

lr_preds = lr_model.predict(X_test_tfidf)

print("\n===== Logistic Regression Results =====")
print(classification_report(y_test, lr_preds))

# ---------------- SAVE BEST MODEL (we decide later) ----------------
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "email_tfidf.pkl"))
joblib.dump(lr_model, os.path.join(MODEL_DIR, "email_lr.pkl"))
joblib.dump(nb_model, os.path.join(MODEL_DIR, "email_nb.pkl"))

print("\nModels saved successfully.")
