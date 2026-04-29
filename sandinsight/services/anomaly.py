"""
SandInsight - Anomaly & Behavioral Analysis Module

Provides:
  - detect_outliers()         Statistically unusual transactions (μ + 2σ)
  - detect_recurring()        Merchants appearing on regular schedule
  - detect_salary_pattern()   Large monthly credits
  - weekend_spending_ratio()  Weekend vs weekday spend ratio
  - midnight_safe_date()      Correct date grouping across midnight boundary
"""

from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timezone, timedelta, date
from statistics import mean, stdev

logger = logging.getLogger("sandinsight.anomaly")
IST = timezone(timedelta(hours=5, minutes=30))


def _parse_ts(ts: str) -> datetime | None:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.astimezone(IST)
    except Exception:
        return None


def midnight_safe_date(ts: str) -> date | None:
    """
    Return IST date for a timestamp, correctly handling midnight edge.
    Transactions at 00:00–00:05 are attributed to the same business day.
    """
    dt = _parse_ts(ts)
    if not dt:
        return None
    # If within first 5 minutes of midnight, treat as previous day
    if dt.hour == 0 and dt.minute < 5:
        dt = dt - timedelta(minutes=10)
    return dt.date()


def detect_outliers(transactions: list[dict]) -> list[dict]:
    """
    Find transactions with amounts statistically unusual vs. the distribution.

    Uses μ + 2σ threshold on debit amounts.
    Returns list of outlier transactions with their z-score.
    """
    debits = [
        (t, float(t.get("amount", 0)))
        for t in transactions
        if (t.get("type") or "").upper() == "DEBIT"
    ]

    if len(debits) < 5:
        return []

    amounts = [amt for _, amt in debits]
    mu = mean(amounts)
    sd = stdev(amounts)

    if sd == 0:
        return []

    threshold = mu + 2 * sd
    outliers  = []

    for txn, amt in debits:
        if amt > threshold:
            z = round((amt - mu) / sd, 2)
            outliers.append({
                "txn_id":      txn.get("txn_id") or txn.get("txnId"),
                "amount":      amt,
                "narration":   txn.get("narration", ""),
                "date":        txn.get("date") or txn.get("valueDate", ""),
                "z_score":     z,
                "threshold":   round(threshold, 2),
                "mean_spend":  round(mu, 2),
            })

    if outliers:
        logger.info(
            "Outlier detection: %d outliers found (threshold Rs.%.0f, mean Rs.%.0f)",
            len(outliers), threshold, mu,
        )

    return sorted(outliers, key=lambda x: x["z_score"], reverse=True)


def detect_recurring(transactions: list[dict]) -> list[dict]:
    """
    Detect merchants that appear on a recurring monthly/weekly schedule.

    Returns a list of recurring merchant summaries.
    """
    # Group by narration prefix (first 30 chars for grouping stability)
    by_merchant: defaultdict[str, list[datetime]] = defaultdict(list)

    for txn in transactions:
        if (txn.get("type") or "").upper() != "DEBIT":
            continue
        narr = (txn.get("narration", "") or "")[:30].upper().strip()
        ts   = _parse_ts(
            txn.get("timestamp") or txn.get("transactionTimestamp", "")
        )
        if ts:
            by_merchant[narr].append(ts)

    results = []
    for narr, timestamps in by_merchant.items():
        if len(timestamps) < 2:
            continue

        timestamps.sort()
        # Compute average gap in days
        gaps = [
            (timestamps[i + 1] - timestamps[i]).days
            for i in range(len(timestamps) - 1)
        ]
        avg_gap = mean(gaps)

        pattern = None
        if 6 <= avg_gap <= 8:
            pattern = "weekly"
        elif 13 <= avg_gap <= 16:
            pattern = "bi-weekly"
        elif 28 <= avg_gap <= 33:
            pattern = "monthly"

        if pattern:
            results.append({
                "merchant":      narr,
                "occurrences":   len(timestamps),
                "pattern":       pattern,
                "avg_gap_days":  round(avg_gap, 1),
                "last_seen":     timestamps[-1].date().isoformat(),
            })

    if results:
        logger.info("Recurring pattern detection: %d recurring merchants found", len(results))

    return results


def detect_salary_pattern(transactions: list[dict]) -> list[dict]:
    """
    Detect monthly salary-like credits (large credits on similar day each month).

    Returns list of probable salary events.
    """
    from services.patterns import SALARY_MIN_AMOUNT, SALARY_SIGNALS

    candidates = []
    for txn in transactions:
        if (txn.get("type") or "").upper() != "CREDIT":
            continue
        amt  = float(txn.get("amount", 0))
        narr = (txn.get("narration", "") or "").upper()
        if amt < SALARY_MIN_AMOUNT:
            continue
        if any(s.upper() in narr for s in SALARY_SIGNALS):
            ts = _parse_ts(
                txn.get("timestamp") or txn.get("transactionTimestamp", "")
            )
            candidates.append({
                "txn_id":  txn.get("txn_id") or txn.get("txnId"),
                "amount":  amt,
                "date":    ts.date().isoformat() if ts else "",
                "narration": txn.get("narration", ""),
            })

    if len(candidates) >= 2:
        logger.info("Salary pattern: %d probable salary credits detected", len(candidates))

    return candidates


def weekend_spending_ratio(transactions: list[dict]) -> dict:
    """
    Compute total weekend vs. weekday spending ratio.
    Returns breakdown with amounts and percentage.
    """
    weekend_total = 0.0
    weekday_total = 0.0

    for txn in transactions:
        if (txn.get("type") or "").upper() != "DEBIT":
            continue
        amt = float(txn.get("amount", 0))
        ts  = _parse_ts(
            txn.get("timestamp") or txn.get("transactionTimestamp", "")
        )
        if ts:
            if ts.weekday() >= 5:
                weekend_total += amt
            else:
                weekday_total += amt

    total = weekend_total + weekday_total
    return {
        "weekend_total":   round(weekend_total, 2),
        "weekday_total":   round(weekday_total, 2),
        "weekend_pct":     round(100 * weekend_total / total, 1) if total else 0,
        "weekday_pct":     round(100 * weekday_total / total, 1) if total else 0,
    }
