"""
SandInsight - Account Aggregator Simulator

Simulates the Account Aggregator (AA) consent flow and
FI data-fetch lifecycle using the RBI/ReBIT v2.0 schema
(all lowercase keys: account, summary, transactions, transaction).
"""

import json
import logging
import uuid
from pathlib import Path

logger = logging.getLogger("sandinsight.aa_simulator")

DATA_DIR       = Path(__file__).resolve().parent.parent / "data"
MOCK_BANK_FILE = DATA_DIR / "mock_bank.json"


def create_mock_consent() -> dict:
    """
    Simulate an AA consent creation.

    Returns a mock consentHandle and redirect URL
    as an AA would during the consent flow.
    """
    consent_handle = str(uuid.uuid4())
    session_id     = str(uuid.uuid4())

    logger.info("Created mock consent: handle=%s", consent_handle)

    return {
        "ver":           "2.0.0",
        "timestamp":     _now_iso(),
        "txnid":         str(uuid.uuid4()),
        "consentHandle": consent_handle,
        "sessionId":     session_id,
        "redirectUrl":   f"http://localhost:8000/consent/callback?handle={consent_handle}",
        "status":        "CREATED",
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

    txn_count = len(
        data.get("account", {})
            .get("transactions", {})
            .get("transaction", [])
    )
    logger.info("FI_READY: loaded %d transactions from mock bank", txn_count)

    return data


def lookup_account_by_phone(phone: str) -> dict | None:
    """
    Look up a linked bank account by phone number.

    Simulates the AA discovery step where the user's phone number
    is used to find all bank accounts registered under that mobile.

    Args:
        phone: 10-digit mobile number (e.g. "9876543210")

    Returns:
        Account discovery payload if found, None otherwise.
    """
    data = _load_bank_data()

    holder = data.get("holder", {})
    registered_phone = holder.get("phone", "")

    # Normalise — strip spaces/country code prefix
    phone_clean      = phone.strip().lstrip("+91").lstrip("0")
    registered_clean = registered_phone.strip().lstrip("+91").lstrip("0")

    if phone_clean != registered_clean:
        logger.warning("Phone lookup miss: %s not found", phone)
        return None

    account = data.get("account", {})
    summary = account.get("summary", {})

    logger.info("Phone lookup hit: %s -> %s", phone, account.get("maskedAccNo"))

    return {
        "phone":       holder.get("phone"),
        "name":        holder.get("name"),
        "ckycStatus":  "COMPLIANT" if holder.get("ckycCompliance") else "PENDING",
        "linkedAccounts": [
            {
                "fipID":       data.get("fipID"),
                "maskedAccNo": account.get("maskedAccNo"),
                "type":        account.get("type"),
                "ifsc":        "SBIN0005678",
                "bank":        "State Bank of India",
                "openingDate": summary.get("openingDate"),
                "status":      "ACTIVE",
            }
        ],
    }



def add_transaction(merchant: str, amount: float) -> dict:
    """
    Add a new transaction to mock_bank.json in RBI/ReBIT format.

    Args:
        merchant: Merchant name (e.g. "ZOMATO", "AMAZON")
        amount:   Transaction amount in INR (positive = debit)

    Returns:
        The newly created transaction record.
    """
    data = _load_bank_data()

    transactions    = data["account"]["transactions"]["transaction"]
    current_balance = float(data["account"]["summary"]["currentBalance"])

    new_balance = current_balance - amount
    txn_count   = len(transactions) + 1
    txn_id      = f"TXN{_date_compact()}{txn_count:03d}"

    new_txn = {
        "txnId":                txn_id,
        "type":                 "DEBIT",
        "mode":                 "UPI",
        "amount":               f"{amount:.2f}",
        "currentBalance":       f"{new_balance:.2f}",
        "transactionTimestamp": _now_iso(),
        "valueDate":            _today_iso(),
        "narration":            f"UPI/{merchant.upper()}/Purchase/Payment",
        "reference":            f"{merchant.upper()[:3]}{_date_compact()}{txn_count:03d}",
    }

    transactions.append(new_txn)
    data["account"]["summary"]["currentBalance"] = f"{new_balance:.2f}"

    _save_bank_data(data)

    logger.info(
        "Added transaction: %s -> Rs.%.2f (balance: Rs.%.2f)",
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
    """Current timestamp in ISO 8601 with IST timezone."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%dT%H:%M:%S.000+05:30")


def _today_iso() -> str:
    """Today's date as YYYY-MM-DD."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%d")


def _date_compact() -> str:
    """Compact date string YYYYMMDD for ID generation."""
    from datetime import datetime, timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y%m%d")
