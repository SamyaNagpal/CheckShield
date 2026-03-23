# qr_analyzer.py

import cv2
import numpy as np
from upi_decision_engine import analyze_upi_message


def analyze_qr_image(image_path: str):

    image = cv2.imread(image_path)

    if image is None:
        return {"error": "Invalid image path"}

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Increase contrast
    gray = cv2.equalizeHist(gray)

    detector = cv2.QRCodeDetector()

    data, bbox, _ = detector.detectAndDecode(gray)

    # Try again with original if failed
    if not data:
        data, bbox, _ = detector.detectAndDecode(image)

    if not data:
        return {"error": "No QR code detected"}

    result = analyze_upi_message(data)

    return {
        "qr_content": data,
        "analysis": result
    }