from email_decision_engine import analyze_email

test_email = """
URGENT: Your account has been suspended!
Click here immediately to verify your bank details:
https://secure-login-paypal-update.xyz
"""

result = analyze_email(test_email)

print("\nEMAIL ANALYSIS RESULT")
print("----------------------")
for k, v in result.items():
    print(f"{k}: {v}")
