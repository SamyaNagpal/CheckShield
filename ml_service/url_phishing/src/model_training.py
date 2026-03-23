import pandas as pd

# Load feature dataset
df = pd.read_csv("data/processed/url_features.csv")

print(df.head())
print(df.shape)

# Separate features and label
X = df.drop(columns=['label'])
feature_columns = X.columns.tolist()

import joblib
joblib.dump(feature_columns, "models/feature_columns.pkl")

y = df['label']

print("Features shape:", X.shape)
print("Labels shape:", y.shape)

from sklearn.model_selection import train_test_split

# Split data (stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training set:", X_train.shape)
print("Testing set:", X_test.shape)

from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix

# Logistic Regression pipeline
lr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('lr', LogisticRegression(max_iter=1000))
])

lr_pipeline.fit(X_train, y_train)

y_pred_lr = lr_pipeline.predict(X_test)

print("\nLogistic Regression Results")
print(classification_report(y_test, y_pred_lr))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_lr))

from sklearn.ensemble import RandomForestClassifier

# STEP 6.6: Strong model - Random Forest
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,           # limit tree depth
    min_samples_split=5,    # prevent small splits
    min_samples_leaf=2,     # avoid tiny leaf nodes
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)


rf.fit(X_train, y_train)

y_pred_rf = rf.predict(X_test)

print("\nRandom Forest Results")
print(classification_report(y_test, y_pred_rf))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_rf))

import joblib
import os

# Create models folder if it doesn't exist
os.makedirs("models", exist_ok=True)

# Save Random Forest model
joblib.dump(rf, "models/url_phishing_rf.pkl")

print("Random Forest model saved successfully.")
