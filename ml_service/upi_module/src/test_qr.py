from qr_analyzer import analyze_qr_image

result = analyze_qr_image("src/sample_qr.png")

print("\nQR Analysis Result:")
for k, v in result.items():
    print(f"{k}: {v}")