"""
SandInsight - ReBIT JSON Parser Service

Parses Account Aggregator FI data (RBI/ReBIT v2.0 format)
into clean, normalized transaction records, then passes them through:

  parser -> classifier -> deduplication -> enriched output

Schema reference (lowercase RBI keys):
  root -> fipID, consentId, holder, account
  account -> type, maskedAccNo, summary, transactions
  summary -> currentBalance, currency, exchgeRate, openingDate
  transactions -> startDate, endDate, transaction[]
  transaction -> type, mode, amount, currentBalance,
                 transactionTimestamp, valueDate, txnId,
                 narration, reference
"""

import logging
from typing import Any

from services.classifier import classify_all
from services.deduplication import deduplicate_transactions

logger = logging.getLogger("sandinsight.parser")


def parse_rebit_data(raw_data: dict[str, Any]) -> dict[str, Any]:
    """
    Parse raw RBI/ReBIT-format bank data and run the full
    classification + deduplication pipeline.

    Args:
        raw_data: Raw JSON from mock_bank.json (RBI schema, lowercase keys)

    Returns:
        {
            "account_info":  dict,
            "transactions":  list[dict],   # classified + deduplicated
        }
    """
    account = raw_data.get("account", {})
    summary = account.get("summary", {})
    holder  = raw_data.get("holder", {})

    account_info = {
        "masked_account":  account.get("maskedAccNo", "N/A"),
        "account_type":    account.get("type", "N/A"),
        "current_balance": _safe_float(summary.get("currentBalance", "0")),
        "currency":        summary.get("currency", "INR"),
        "opening_date":    summary.get("openingDate", "N/A"),
        "fip_id":          raw_data.get("fipID", "N/A"),
        "consent_id":      raw_data.get("consentId", "N/A"),
        # Holder info (from onboarding flow)
        "holder_name":     holder.get("name", "N/A"),
        "holder_phone":    holder.get("phone", "N/A"),
        "ckyc_status":     "COMPLIANT" if holder.get("ckycCompliance") else "PENDING",
    }

    raw_transactions = (
        account.get("transactions", {}).get("transaction", [])
    )

    # Step 1 — Normalize
    normalized = [_parse_transaction(txn) for txn in raw_transactions]

    # Step 2 — Deduplicate
    deduped = deduplicate_transactions(normalized)

    # Step 3 — Classify (with behavioral context across all transactions)
    classified = classify_all(deduped)

    logger.info(
        "Parsed %d transactions for account %s (%d after dedup, %d classified)",
        len(raw_transactions),
        account_info["masked_account"],
        len(deduped),
        len(classified),
    )

    return {
        "account_info": account_info,
        "transactions": classified,
    }


def _parse_transaction(txn: dict[str, Any]) -> dict[str, Any]:
    """Normalize a single RBI-format transaction into a clean internal dict."""
    return {
        "txn_id":        txn.get("txnId", ""),
        "type":          txn.get("type", "UNKNOWN"),
        "mode":          txn.get("mode", "UNKNOWN"),
        "amount":        _safe_float(txn.get("amount", "0")),
        "balance_after": _safe_float(txn.get("currentBalance", "0")),
        "timestamp":     txn.get("transactionTimestamp", ""),
        "date":          txn.get("valueDate", ""),
        "narration":     txn.get("narration", ""),
        "reference":     txn.get("reference", ""),
    }


def _safe_float(value: str | int | float) -> float:
    """Safely convert a value to float, defaulting to 0.0."""
    try:
        return float(value)
    except (ValueError, TypeError):
        logger.warning("Could not parse float from: %s", value)
        return 0.0
