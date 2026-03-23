from text_rule_engine import analyze_text_rules

test_message = """
URGENT: Refund pending!
Approve collect request immediately to receive your cashback.
"""

result = analyze_text_rules(test_message)

print("\nText Rule Analysis:")
for k, v in result.items():
    print(f"{k}: {v}")