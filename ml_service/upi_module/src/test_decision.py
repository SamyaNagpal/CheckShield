from upi_decision_engine import analyze_upi_message

test_message = """
URGENT refund pending.
Approve collect request immediately.
upi://pay?pa=refund-icici@ybl&pn=ICICI%20Refund&am=5000&cu=INR
"""

result = analyze_upi_message(test_message)

print("\nUPI Decision Result:")
for k, v in result.items():
    print(f"{k}: {v}")