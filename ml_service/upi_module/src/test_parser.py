from upi_parser import parse_upi_uri

test_uri = "upi://pay?pa=merchant@okaxis&pn=Merchant%20Store&am=500&cu=INR"

result = parse_upi_uri(test_uri)

print("\nParsed UPI Data:")
for k, v in result.items():
    print(f"{k}: {v}")