"""
SandInsight - Deduplication Module

Handles:
  1. Exact deduplication by txnId
  2. Heuristic deduplication (same amount + timestamp within 60s)
  3. Split transaction detection (same merchant, multiple small txns in short window)
"""

from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timezone, timedelta

logger = logging.getLogger("sandinsight.deduplication")
IST = timezone(timedelta(hours=5, minutes=30))


def _parse_ts(ts: str) -> datetime | None:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.astimezone(IST)
    except Exception:
        return None


def deduplicate_transactions(transactions: list[dict]) -> list[dict]:
    """
    Remove duplicate transactions using a two-pass strategy:

    Pass 1 — Exact: deduplicate by txnId.
    Pass 2 — Heuristic: flag pairs with same amount + timestamp within 60 seconds.

    Returns clean list with a 'duplicate' flag on removed entries.
    """
    # Pass 1: exact txnId dedup
    seen_ids: set[str] = set()
    pass1: list[dict] = []
    exact_dupes = 0

    for txn in transactions:
        tid = txn.get("txn_id") or txn.get("txnId", "")
        if tid in seen_ids:
            exact_dupes += 1
            logger.debug("Exact duplicate removed: %s", tid)
            continue
        seen_ids.add(tid)
        pass1.append(txn)

    # Pass 2: heuristic dedup (same amount + within 60s)
    WINDOW_SECONDS = 60
    clean: list[dict] = []
    heuristic_dupes = 0

    for i, txn in enumerate(pass1):
        ts_i  = _parse_ts(txn.get("timestamp") or txn.get("transactionTimestamp", ""))
        amt_i = txn.get("amount", 0)
        is_dupe = False

        for j in range(max(0, i - 5), i):  # only compare nearby transactions
            txn_j = pass1[j]
            ts_j  = _parse_ts(txn_j.get("timestamp") or txn_j.get("transactionTimestamp", ""))
            amt_j = txn_j.get("amount", 0)

            if ts_i and ts_j and abs((ts_i - ts_j).total_seconds()) <= WINDOW_SECONDS:
                if amt_i == amt_j and txn.get("narration") == txn_j.get("narration"):
                    is_dupe = True
                    heuristic_dupes += 1
                    logger.debug("Heuristic duplicate flagged: %s", txn.get("txn_id"))
                    break

        if not is_dupe:
            clean.append(txn)

    if exact_dupes or heuristic_dupes:
        logger.info(
            "Deduplication: removed %d exact + %d heuristic duplicates (%d remaining)",
            exact_dupes, heuristic_dupes, len(clean),
        )

    return clean


def detect_split_transactions(transactions: list[dict]) -> list[dict[str, object]]:
    """
    Detect split transactions: multiple small debits to the same merchant
    within a 2-hour window that together exceed a threshold.

    Returns a list of split groups (for reporting/insight purposes).
    Each group: {merchant, total_amount, txn_ids, window_minutes}
    """
    WINDOW_SECONDS = 2 * 3600   # 2 hours
    MIN_GROUP_SIZE = 2
    MIN_GROUP_TOTAL = 500

    # Group by narration
    by_narration: defaultdict[str, list[dict]] = defaultdict(list)
    for txn in transactions:
        if (txn.get("type") or txn.get("classification", {}).get("category")) != "CREDIT":
            narr = (txn.get("narration", "") or "").upper()[:40]
            by_narration[narr].append(txn)

    split_groups: list[dict] = []

    for narr, group in by_narration.items():
        if len(group) < MIN_GROUP_SIZE:
            continue

        group_sorted = sorted(
            group,
            key=lambda t: t.get("timestamp") or t.get("transactionTimestamp", "")
        )

        # Sliding window
        i = 0
        while i < len(group_sorted):
            window = [group_sorted[i]]
            ts_start = _parse_ts(
                group_sorted[i].get("timestamp") or
                group_sorted[i].get("transactionTimestamp", "")
            )
            if not ts_start:
                i += 1
                continue

            for j in range(i + 1, len(group_sorted)):
                ts_j = _parse_ts(
                    group_sorted[j].get("timestamp") or
                    group_sorted[j].get("transactionTimestamp", "")
                )
                if ts_j and (ts_j - ts_start).total_seconds() <= WINDOW_SECONDS:
                    window.append(group_sorted[j])
                else:
                    break

            if len(window) >= MIN_GROUP_SIZE:
                total = sum(float(t.get("amount", 0)) for t in window)
                if total >= MIN_GROUP_TOTAL:
                    split_groups.append({
                        "merchant":       narr,
                        "total_amount":   round(total, 2),
                        "txn_count":      len(window),
                        "txn_ids":        [t.get("txn_id") or t.get("txnId") for t in window],
                        "window_minutes": int(WINDOW_SECONDS / 60),
                    })

            i += len(window)

    if split_groups:
        logger.info("Detected %d potential split transaction groups", len(split_groups))

    return split_groups
