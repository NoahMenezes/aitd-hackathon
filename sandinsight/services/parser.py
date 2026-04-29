"""
SandInsight - ReBIT JSON Parser Service

Parses Account Aggregator FI data (RBI/ReBIT v2.0 format)
into clean, normalized transaction records.

Schema reference (lowercase RBI keys):
  root -> fipID, consentId, account
  account -> type, maskedAccNo, summary, transactions
  summary -> currentBalance, currency, exchgeRate, openingDate
  transactions -> startDate, endDate, transaction[]
  transaction -> type, mode, amount, currentBalance,
                 transactionTimestamp, valueDate, txnId,
                 narration, reference
"""

import logging
from typing import Any

logger = logging.getLogger("sandinsight.parser")


def parse_rebit_data(raw_data: dict[str, Any]) -> dict[str, Any]:
    """
    Parse raw RBI/ReBIT-format bank data into a structured summary.

    Args:
        raw_data: Raw JSON from mock_bank.json (RBI schema, lowercase keys)

    Returns:
        Dictionary with account_info and transactions list.
    """
    account = raw_data.get("account", {})
    summary = account.get("summary", {})

    account_info = {
        "masked_account":  account.get("maskedAccNo", "N/A"),
        "account_type":    account.get("type", "N/A"),
        "current_balance": _safe_float(summary.get("currentBalance", "0")),
        "currency":        summary.get("currency", "INR"),
        "opening_date":    summary.get("openingDate", "N/A"),
        "fip_id":          raw_data.get("fipID", "N/A"),
        "consent_id":      raw_data.get("consentId", "N/A"),
    }

    raw_transactions = (
        account.get("transactions", {}).get("transaction", [])
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
        "txn_id":       txn.get("txnId", ""),
        "type":         txn.get("type", "UNKNOWN"),
        "mode":         txn.get("mode", "UNKNOWN"),
        "amount":       _safe_float(txn.get("amount", "0")),
        "balance_after":_safe_float(txn.get("currentBalance", "0")),
        "timestamp":    txn.get("transactionTimestamp", ""),
        "date":         txn.get("valueDate", ""),
        "narration":    txn.get("narration", ""),
        "reference":    txn.get("reference", ""),
    }


def _safe_float(value: str | int | float) -> float:
    """Safely convert a value to float, defaulting to 0.0."""
    try:
        return float(value)
    except (ValueError, TypeError):
        logger.warning("Could not parse float from: %s", value)
        return 0.0
