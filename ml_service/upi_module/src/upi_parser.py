# upi_parser.py

from urllib.parse import urlparse, parse_qs, unquote


def parse_upi_uri(uri: str):
    """
    Parses a UPI URI and extracts core transaction details.
    Returns structured dictionary.
    """

    if not uri.startswith("upi://"):
        return {
            "valid_upi": False,
            "error": "Not a valid UPI URI"
        }

    try:
        parsed = urlparse(uri)
        query_params = parse_qs(parsed.query)

        # Extract parameters safely
        payee_address = query_params.get("pa", [None])[0]
        payee_name = query_params.get("pn", [None])[0]
        amount = query_params.get("am", [None])[0]
        currency = query_params.get("cu", [None])[0]
        transaction_note = query_params.get("tn", [None])[0]

        # Decode name if encoded
        if payee_name:
            payee_name = unquote(payee_name)

        return {
            "valid_upi": True,
            "raw_uri": uri,
            "payee_address": payee_address,
            "payee_name": payee_name,
            "amount": amount,
            "currency": currency,
            "transaction_note": transaction_note
        }

    except Exception as e:
        return {
            "valid_upi": False,
            "error": str(e)
        }