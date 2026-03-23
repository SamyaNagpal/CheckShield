from final_decision_engine import analyze_url

test_url = "https://www.google.com/"

result = analyze_url(test_url)

print("\nFINAL SECURITY ASSESSMENT")
print("-------------------------")

for key, value in result.items():
    print(f"{key}: {value}")
