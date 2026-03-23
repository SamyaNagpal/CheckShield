import pandas as pd

# Load dataset
data_path = "data/raw/PhiUSIIL_Phishing_URL_Dataset.csv"
df = pd.read_csv(data_path)

# STEP 4: Keep only raw URL and label
df = df[['URL', 'label']]

print("Filtered dataset shape:", df.shape)
print("\nColumn names:")
print(df.columns)

print("\nSample rows:")
print(df.head())

# STEP 5.1: Missing values
print("\nMissing values per column:")
print(df.isnull().sum())

# STEP 5.2: Label distribution
print("\nLabel distribution:")
print(df['label'].value_counts())

output_path = "data/processed/url_label_only.csv"
df.to_csv(output_path, index=False)

print("\nSaved cleaned dataset to:", output_path)