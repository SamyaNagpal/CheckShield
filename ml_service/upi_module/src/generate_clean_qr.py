import qrcode

def generate_upi_qr():

    upi_data = "upi://pay?pa=refund-icici@ybl&pn=ICICI%20Refund&am=5000&cu=INR"

    qr = qrcode.QRCode(
        version=None,  # automatic size
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=12,
        border=4,
    )

    qr.add_data(upi_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    img.save("src/sample_qr.png")

    print("✅ Clean UPI QR generated successfully.")
    print("Saved at: src/sample_qr.png")


if __name__ == "__main__":
    generate_upi_qr()