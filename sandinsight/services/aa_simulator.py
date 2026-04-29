"""
SandInsight - Account Aggregator Simulator

Simulates the Account Aggregator (AA) consent flow and
FI data-fetch lifecycle for development and testing.
"""

import json
import logging
import uuid
from pathlib import Path

logger = logging.getLogger("sandinsight.aa_simulator")

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MOCK_BANK_FILE = DATA_DIR / "mock_bank.json"


def create_mock_consent() -> dict:
    """
    Simulate an AA consent creation.

    Returns a mock consentHandle and redirect URL
    as an AA would during the consent flow.
    """
    consent_handle = str(uuid.uuid4())
    session_id = str(uuid.uuid4())

    logger.info("Created mock consent: handle=%s", consent_handle)

    return {
        "ver": "2.0.0",
        "timestamp": _now_iso(),
        "txnid": str(uuid.uuid4()),
        "consentHandle": consent_handle,
        "sessionId": session_id,
        "redirectUrl": f"http://localhost:8000/static/index.html?consent={consent_handle}",
        "status": "CREATED",
    }


def simulate_fi_ready() -> dict:
    """
    Simulate the FI_READY notification.

    Loads mock bank data from disk and returns it
    as if fetched through the AA data-fetch API.
    """
    if not MOCK_BANK_FILE.exists():
        logger.error("Mock bank data not found at %s", MOCK_BANK_FILE)
        raise FileNotFoundError(f"Mock data file missing: {MOCK_BANK_FILE}")

    with open(MOCK_BANK_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(
        "FI_READY: loaded %d transactions from mock bank",
        len(data.get("Account", {}).get("Transactions", {}).get("Transaction", [])),
    )

    return data


def add_transaction(merchant: str, amount: float) -> dict:
    """
    Add a new transaction to mock_bank.json in ReBIT format.

    Args:
        merchant: Merchant name (e.g. "ZOMATO", "AMAZON")
        amount: Transaction amount in INR

    Returns:
        The newly created transaction record.
    """
    data = _load_bank_data()

    transactions = data["Account"]["Transactions"]["Transaction"]
    current_balance = float(data["Account"]["Summary"]["currentBalance"])

    new_balance = current_balance - amount
    txn_count = len(transactions) + 1
    txn_id = f"TXN{_date_compact()}{txn_count:03d}"

    new_txn = {
        "txnId": txn_id,
        "type": "DEBIT",
        "mode": "UPI",
        "amount": f"{amount:.2f}",
        "currentBalance": f"{new_balance:.2f}",
        "transactionTimestamp": _now_iso(),
        "valueDate": _today_iso(),
        "narration": f"UPI/{merchant.upper()}/Purchase/Payment",
        "reference": f"{merchant.upper()[:3]}{_date_compact()}{txn_count:03d}",
    }

    transactions.append(new_txn)
    data["Account"]["Summary"]["currentBalance"] = f"{new_balance:.2f}"

    _save_bank_data(data)

    logger.info(
        "Added transaction: %s → ₹%.2f (balance: ₹%.2f)",
        merchant, amount, new_balance,
    )

    return new_txn


def _load_bank_data() -> dict:
    """Load mock_bank.json from disk."""
    with open(MOCK_BANK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_bank_data(data: dict) -> None:
    """Persist updated data to mock_bank.json."""
    with open(MOCK_BANK_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _now_iso() -> str:
    """Current timestamp in ISO 8601 with timezone."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%dT%H:%M:%S.000+05:30")


def _today_iso() -> str:
    """Today's date in ISO format."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%d")


def _date_compact() -> str:
    """Compact date string for IDs (YYYYMMDD)."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y%m%d")
