"""
SandInsight - ReBIT JSON Parser Service

Parses Account Aggregator FI data (ReBIT v2.0 format)
into clean, normalized transaction records.
"""

import logging
from typing import Any

logger = logging.getLogger("sandinsight.parser")


def parse_rebit_data(raw_data: dict[str, Any]) -> dict[str, Any]:
    """
    Parse raw ReBIT-format bank data into a structured summary.

    Args:
        raw_data: Raw JSON from mock_bank.json (ReBIT v2.0 format)

    Returns:
        Dictionary with account_info and transactions list.
    """
    account = raw_data.get("Account", {})
    summary = account.get("Summary", {})
    profile = account.get("Profile", {})
    holders = profile.get("Holders", {}).get("Holder", [])

    holder_name = holders[0].get("name", "Unknown") if holders else "Unknown"

    account_info = {
        "holder_name": holder_name,
        "masked_account": account.get("maskedAccNumber", "N/A"),
        "account_type": account.get("type", "N/A"),
        "current_balance": _safe_float(summary.get("currentBalance", "0")),
        "currency": summary.get("currency", "INR"),
        "branch": summary.get("branch", "N/A"),
        "ifsc": summary.get("ifscCode", "N/A"),
        "status": summary.get("status", "N/A"),
    }

    raw_transactions = (
        account.get("Transactions", {}).get("Transaction", [])
    )

    transactions = [_parse_transaction(txn) for txn in raw_transactions]

    logger.info(
        "Parsed %d transactions for account %s",
        len(transactions),
        account_info["masked_account"],
    )

    return {
        "account_info": account_info,
        "transactions": transactions,
    }


def _parse_transaction(txn: dict[str, Any]) -> dict[str, Any]:
    """Extract and normalize a single transaction record."""
    return {
        "txn_id": txn.get("txnId", ""),
        "type": txn.get("type", "UNKNOWN"),
        "mode": txn.get("mode", "UNKNOWN"),
        "amount": _safe_float(txn.get("amount", "0")),
        "balance_after": _safe_float(txn.get("currentBalance", "0")),
        "timestamp": txn.get("transactionTimestamp", ""),
        "date": txn.get("valueDate", ""),
        "narration": txn.get("narration", ""),
        "reference": txn.get("reference", ""),
    }


def _safe_float(value: str | int | float) -> float:
    """Safely convert a value to float, defaulting to 0.0."""
    try:
        return float(value)
    except (ValueError, TypeError):
        logger.warning("Could not parse float from: %s", value)
        return 0.0
