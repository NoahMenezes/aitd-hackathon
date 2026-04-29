"""
SandInsight - Multi-Layer Transaction Classifier

Classification pipeline (6 layers, highest-wins strategy):

  L1 — UPI VPA direct match        (confidence 0.97)
  L2 — Merchant name keyword match  (confidence 0.90)
  L3 — Full narration keyword scan  (confidence 0.75)
  L4 — Mode + amount heuristics     (confidence 0.85)
  L5 — Time-of-day inference        (confidence 0.30)
  L6 — Fallback                     (confidence 0.10)

Behavioral enrichment (pre-pass over full transaction list):
  - Salary detection        (recurring large credits)
  - Recurring merchant tags (same VPA ≥ 3× → recurring)
  - UPI ID memory           (VPA seen before → inherit category)
  - Outlier tagging         (amount > μ + 2σ)
  - Weekend/weekday tagging
"""

from __future__ import annotations

import logging
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta
from statistics import mean, stdev
from typing import Any

from services.patterns import (
    VPA_MAP, MERCHANT_KEYWORDS,
    ATM_SIGNALS, SALARY_SIGNALS, SALARY_MIN_AMOUNT,
    REFUND_SIGNALS, TIME_SLOT_HINTS,
    LARGE_CREDIT_MIN, RENT_TYPICAL_BAND,
    FOOD, GROCERIES, SHOPPING, TRANSPORT, INCOME,
    HEALTHCARE, ENTERTAINMENT, UTILITIES, INVESTMENT,
    CASH, REFUND, TRANSFER, UNKNOWN,
)

logger = logging.getLogger("sandinsight.classifier")
IST = timezone(timedelta(hours=5, minutes=30))

# ── Helpers ───────────────────────────────────────────────────────────────────

def _upper(s: str) -> str:
    return s.upper().strip()

def _parse_ts(ts: str) -> datetime | None:
    """Parse ISO 8601 timestamp, return datetime in IST."""
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.astimezone(IST)
    except Exception:
        return None

def _extract_vpa(narration: str) -> str | None:
    """
    Extract UPI VPA from narration like:
      UPI-ZOMATO INTERNET PVT-zomato@okaxis
    Returns the VPA fragment before '@' e.g. 'zomato'.
    """
    match = re.search(r'[\w.]+@[\w.]+', narration)
    if match:
        vpa = match.group(0).lower()
        return vpa.split("@")[0]
    return None

def _extract_merchant_segment(narration: str) -> str:
    """
    For narrations formatted as TYPE-MERCHANT-DETAIL,
    extract the second segment (merchant name).
    """
    parts = narration.split("-", 2)
    if len(parts) >= 2:
        return parts[1].strip().upper()
    return narration.upper()

def _contains_any(text: str, signals: list[str]) -> bool:
    t = text.upper()
    return any(s.upper() in t for s in signals)


# ── Layer implementations ─────────────────────────────────────────────────────

def _layer1_vpa(narration: str) -> tuple[str, float, str] | None:
    """L1: Direct UPI VPA match."""
    vpa_fragment = _extract_vpa(narration)
    if not vpa_fragment:
        return None
    for key, cat in VPA_MAP.items():
        if key in vpa_fragment:
            return cat, 0.97, "vpa_match"
    return None


def _layer2_merchant(narration: str) -> tuple[str, float, str] | None:
    """L2: Merchant name segment keyword match."""
    merchant = _extract_merchant_segment(narration)
    for keyword, cat in MERCHANT_KEYWORDS:
        if keyword.upper() in merchant:
            return cat, 0.90, "merchant_keyword"
    return None


def _layer3_narration_scan(narration: str) -> tuple[str, float, str] | None:
    """L3: Full narration keyword scan (lower confidence)."""
    upper = narration.upper()
    for keyword, cat in MERCHANT_KEYWORDS:
        if keyword.upper() in upper:
            return cat, 0.75, "narration_scan"
    return None


def _layer4_mode_amount(txn: dict) -> tuple[str, float, str] | None:
    """L4: Mode, type, and amount heuristics."""
    mode   = _upper(txn.get("mode", ""))
    ttype  = _upper(txn.get("type", ""))
    narr   = _upper(txn.get("narration", ""))
    amount = float(txn.get("amount", 0))

    # ATM withdrawals
    if mode == "ATM" or _contains_any(narr, ATM_SIGNALS):
        return CASH, 0.98, "atm_mode"

    # Salary / large credits
    if ttype == "CREDIT":
        if _contains_any(narr, SALARY_SIGNALS) and amount >= SALARY_MIN_AMOUNT:
            return INCOME, 0.96, "salary_signal"
        if amount >= LARGE_CREDIT_MIN and "NEFT" in narr:
            return INCOME, 0.85, "large_neft_credit"

    # Refunds / cashback
    if ttype == "CREDIT" and _contains_any(narr, REFUND_SIGNALS):
        return REFUND, 0.90, "refund_signal"

    # NEFT transfers (non-salary)
    if "NEFT" in narr and ttype == "DEBIT":
        # Rent band
        if RENT_TYPICAL_BAND[0] <= amount <= RENT_TYPICAL_BAND[1]:
            if "RENT" in narr or "LANDLORD" in narr or "FLAT" in narr:
                return UTILITIES, 0.92, "rent_neft"
        return TRANSFER, 0.60, "neft_transfer"

    return None


def _layer5_time(txn: dict) -> tuple[str, float, str] | None:
    """L5: Time-of-day inference (low confidence backup)."""
    dt = _parse_ts(txn.get("timestamp") or txn.get("transactionTimestamp", ""))
    if not dt:
        return None
    hour = dt.hour
    for h_start, h_end, cat, conf in TIME_SLOT_HINTS:
        if h_start <= hour < h_end:
            return cat, conf, "time_inference"
    return None


# ── Behavioral pre-pass ───────────────────────────────────────────────────────

def build_behavioral_profile(transactions: list[dict]) -> dict[str, Any]:
    """
    Single pass over all transactions to extract behavioral signals:
    - vpa_category_memory: VPA → category (from high-confidence classifications)
    - recurring_vpas: VPAs seen ≥ 3 times
    - outlier_threshold: μ + 2σ of debit amounts
    - merchant_frequencies: merchant → count
    """
    debit_amounts: list[float] = []
    vpa_counts: Counter = Counter()
    merchant_counts: Counter = Counter()

    for txn in transactions:
        narr = txn.get("narration", "")
        amt  = float(txn.get("amount", 0))
        ttype = _upper(txn.get("type", ""))

        if ttype == "DEBIT":
            debit_amounts.append(amt)

        vpa = _extract_vpa(narr)
        if vpa:
            vpa_counts[vpa] += 1

        merchant = _extract_merchant_segment(narr)
        merchant_counts[merchant] += 1

    # Outlier threshold
    if len(debit_amounts) >= 3:
        mu  = mean(debit_amounts)
        sd  = stdev(debit_amounts)
        outlier_threshold = mu + 2 * sd
    else:
        outlier_threshold = float("inf")

    recurring_vpas = {vpa for vpa, cnt in vpa_counts.items() if cnt >= 3}
    recurring_merchants = {m for m, cnt in merchant_counts.items() if cnt >= 3}

    return {
        "outlier_threshold":    outlier_threshold,
        "recurring_vpas":       recurring_vpas,
        "recurring_merchants":  recurring_merchants,
        "vpa_counts":           dict(vpa_counts),
        "merchant_counts":      dict(merchant_counts),
    }


# ── Tag builder ───────────────────────────────────────────────────────────────

def _build_tags(txn: dict, profile: dict, category: str) -> list[str]:
    tags: list[str] = []

    # Weekend / weekday
    dt = _parse_ts(txn.get("timestamp") or txn.get("transactionTimestamp", ""))
    if dt:
        tags.append("weekend" if dt.weekday() >= 5 else "weekday")
        hour = dt.hour
        if 6 <= hour < 12:
            tags.append("morning")
        elif 12 <= hour < 17:
            tags.append("afternoon")
        elif 17 <= hour < 21:
            tags.append("evening")
        else:
            tags.append("night")

    # Recurring
    vpa = _extract_vpa(txn.get("narration", ""))
    if vpa and vpa in profile.get("recurring_vpas", set()):
        tags.append("recurring")

    merchant = _extract_merchant_segment(txn.get("narration", ""))
    if merchant in profile.get("recurring_merchants", set()):
        tags.append("recurring")

    tags = list(dict.fromkeys(tags))  # deduplicate

    # Outlier
    amt = float(txn.get("amount", 0))
    if amt > profile.get("outlier_threshold", float("inf")):
        tags.append("outlier")

    # Transaction type tags
    if _upper(txn.get("type", "")) == "CREDIT":
        tags.append("credit")
    else:
        tags.append("debit")

    # Category shorthand
    category_tags = {
        FOOD: "food",
        GROCERIES: "groceries",
        SHOPPING: "shopping",
        TRANSPORT: "transport",
        INCOME: "income",
        HEALTHCARE: "health",
        ENTERTAINMENT: "entertainment",
        UTILITIES: "utilities",
        INVESTMENT: "investment",
        CASH: "atm",
        REFUND: "refund",
    }
    if category in category_tags:
        tags.append(category_tags[category])

    return tags


# ── Public API ────────────────────────────────────────────────────────────────

def classify_transaction(
    txn: dict,
    profile: dict | None = None,
) -> dict[str, Any]:
    """
    Classify a single transaction through the 6-layer pipeline.

    Args:
        txn:     Parsed transaction dict (from parser.py output)
        profile: Behavioral profile from build_behavioral_profile()

    Returns:
        {
            "category":    str,
            "confidence":  float,
            "method":      str,
            "tags":        list[str],
            "explanation": str,
        }
    """
    if profile is None:
        profile = {}

    narr = txn.get("narration") or txn.get("narration", "")

    # Run layers highest-to-lowest confidence
    result = (
        _layer4_mode_amount(txn)    # ATM/salary has very high confidence
        or _layer1_vpa(narr)
        or _layer2_merchant(narr)
        or _layer3_narration_scan(narr)
        or _layer5_time(txn)
    )

    if result:
        category, confidence, method = result
    else:
        category, confidence, method = UNKNOWN, 0.10, "fallback"

    tags = _build_tags(txn, profile, category)

    explanation = _build_explanation(narr, category, method, tags)

    return {
        "category":    category,
        "confidence":  round(confidence, 2),
        "method":      method,
        "tags":        tags,
        "explanation": explanation,
    }


def classify_all(transactions: list[dict]) -> list[dict]:
    """
    Classify all transactions with behavioral context.

    Args:
        transactions: List of parsed transaction dicts

    Returns:
        Same list with 'classification' key added to each transaction.
    """
    profile = build_behavioral_profile(transactions)
    logger.info(
        "Behavioral profile: %d recurring VPAs, outlier threshold Rs.%.0f",
        len(profile["recurring_vpas"]),
        profile["outlier_threshold"],
    )

    enriched: list[dict] = []
    for txn in transactions:
        classification = classify_transaction(txn, profile)
        enriched.append({**txn, "classification": classification})

    categories = Counter(t["classification"]["category"] for t in enriched)
    logger.info("Classification summary: %s", dict(categories))

    return enriched


def _build_explanation(narr: str, category: str, method: str, tags: list[str]) -> str:
    """Human-readable explanation of classification decision."""
    method_desc = {
        "vpa_match":        "UPI VPA directly matched known merchant registry",
        "merchant_keyword": "Merchant name matched category keyword",
        "narration_scan":   "Category keyword found in narration text",
        "atm_mode":         "Transaction mode is ATM / cash withdrawal",
        "salary_signal":    "Large NEFT credit with salary keyword",
        "large_neft_credit":"Large NEFT credit — likely salary or transfer",
        "refund_signal":    "Refund/cashback keyword detected in credit",
        "rent_neft":        "NEFT debit in typical rent range with rent keyword",
        "neft_transfer":    "NEFT debit — classified as transfer",
        "time_inference":   "Inferred from time of day (low confidence)",
        "fallback":         "No pattern matched — marked Unknown",
    }.get(method, method)

    extra = ""
    if "recurring" in tags:
        extra += " Merchant appears frequently (recurring pattern)."
    if "outlier" in tags:
        extra += " Amount is an outlier vs. spending history."
    if "weekend" in tags:
        extra += " Weekend transaction."

    return f"[{method}] {method_desc}.{extra}"
