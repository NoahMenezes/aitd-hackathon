"""
SandInsight - Time-Based Financial Analytics Service

Computes daily, weekly, monthly, and yearly spending breakdowns
from parsed transaction data. Reuses categorization logic from
the insights engine.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from services.insights import categorize_transaction

logger = logging.getLogger("sandinsight.analytics")

# IST timezone offset
_IST = timezone(timedelta(hours=5, minutes=30))


# ──────────────────────────────────────────────
# Timestamp helpers
# ──────────────────────────────────────────────

def _parse_timestamp(ts: str) -> datetime:
    """
    Parse a ReBIT ISO timestamp into a timezone-aware datetime.

    Handles formats like '2026-04-01T12:30:00.000+05:30'.
    Falls back to date-only parsing if full timestamp fails.
    """
    if not ts:
        return datetime.now(_IST)

    # Try full ISO format first
    for fmt in (
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S",
    ):
        try:
            dt = datetime.strptime(ts, fmt)
            # Attach IST if naive
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=_IST)
            return dt
        except ValueError:
            continue

    # Fallback: date-only string
    try:
        dt = datetime.strptime(ts[:10], "%Y-%m-%d")
        return dt.replace(tzinfo=_IST)
    except ValueError:
        logger.warning("Unparseable timestamp: %s", ts)
        return datetime.now(_IST)


def _iso_week_label(dt: datetime) -> str:
    """Return ISO week label like '2026-W17'."""
    iso_year, iso_week, _ = dt.isocalendar()
    return f"{iso_year}-W{iso_week:02d}"


def _filter_debits(transactions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Return only DEBIT transactions (spending)."""
    return [t for t in transactions if t.get("type") == "DEBIT"]


def _categorize_and_enrich(
    transactions: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Add parsed datetime and category to each transaction."""
    enriched = []
    for txn in transactions:
        dt = _parse_timestamp(txn.get("timestamp", ""))
        category = categorize_transaction(txn.get("narration", ""))
        enriched.append({**txn, "_dt": dt, "_category": category})
    return enriched


# ──────────────────────────────────────────────
# Core analytics functions
# ──────────────────────────────────────────────

def get_daily_spending(
    transactions: list[dict[str, Any]], date: str
) -> dict[str, Any]:
    """
    Compute spending breakdown for a single day.

    Args:
        transactions: Parsed transaction list from parser.py
        date: Target date as 'YYYY-MM-DD'

    Returns:
        Dictionary with total_spent, category breakdown,
        transaction_count, and top_category.
    """
    debits = _categorize_and_enrich(_filter_debits(transactions))
    day_txns = [t for t in debits if t["_dt"].strftime("%Y-%m-%d") == date]

    categories: dict[str, float] = {}
    total = 0.0
    for txn in day_txns:
        amt = txn.get("amount", 0.0)
        total += amt
        cat = txn["_category"]
        categories[cat] = categories.get(cat, 0.0) + amt

    top_category = max(categories, key=categories.get) if categories else None

    logger.info("Daily analytics for %s: ₹%.2f across %d txns", date, total, len(day_txns))

    return {
        "date": date,
        "total_spent": round(total, 2),
        "transaction_count": len(day_txns),
        "categories": {k: round(v, 2) for k, v in categories.items()},
        "top_category": top_category,
    }


def get_today_spending(
    transactions: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Compute today's spending with a comparison to yesterday.

    Returns daily breakdown plus a trend comparison message.
    """
    now = datetime.now(_IST)
    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    today_data = get_daily_spending(transactions, today_str)
    yesterday_data = get_daily_spending(transactions, yesterday_str)

    # Trend comparison
    comparison = None
    if yesterday_data["total_spent"] > 0:
        change_pct = (
            (today_data["total_spent"] - yesterday_data["total_spent"])
            / yesterday_data["total_spent"]
            * 100
        )
        if change_pct > 0:
            comparison = (
                f"You spent {abs(change_pct):.0f}% more than yesterday "
                f"(₹{today_data['total_spent']:,.0f} vs ₹{yesterday_data['total_spent']:,.0f})"
            )
        elif change_pct < 0:
            comparison = (
                f"You spent {abs(change_pct):.0f}% less than yesterday "
                f"(₹{today_data['total_spent']:,.0f} vs ₹{yesterday_data['total_spent']:,.0f})"
            )
        else:
            comparison = "Spending is the same as yesterday"
    elif today_data["total_spent"] > 0:
        comparison = (
            f"You spent ₹{today_data['total_spent']:,.0f} today "
            f"— no spending recorded yesterday"
        )
    else:
        comparison = "No spending recorded today or yesterday"

    today_data["comparison"] = comparison
    today_data["yesterday_total"] = yesterday_data["total_spent"]
    return today_data


def get_weekly_spending(
    transactions: list[dict[str, Any]], num_weeks: int = 4
) -> list[dict[str, Any]]:
    """
    Compute spending grouped by ISO week (Mon–Sun).

    Args:
        transactions: Parsed transaction list
        num_weeks: Number of recent weeks to return (default 4)

    Returns:
        List of weekly summaries, most recent first.
    """
    debits = _categorize_and_enrich(_filter_debits(transactions))

    # Group by week
    weekly: dict[str, dict[str, Any]] = {}
    for txn in debits:
        week_label = _iso_week_label(txn["_dt"])
        if week_label not in weekly:
            weekly[week_label] = {
                "total_spent": 0.0,
                "transaction_count": 0,
                "categories": {},
            }
        bucket = weekly[week_label]
        amt = txn.get("amount", 0.0)
        bucket["total_spent"] += amt
        bucket["transaction_count"] += 1
        cat = txn["_category"]
        bucket["categories"][cat] = bucket["categories"].get(cat, 0.0) + amt

    # Sort descending (most recent first) and take last N weeks
    sorted_weeks = sorted(weekly.keys(), reverse=True)[:num_weeks]

    results = []
    for week in sorted_weeks:
        data = weekly[week]
        cats = {k: round(v, 2) for k, v in data["categories"].items()}
        top_cat = max(cats, key=cats.get) if cats else None
        avg_daily = round(data["total_spent"] / 7, 2)
        results.append({
            "week": week,
            "total_spent": round(data["total_spent"], 2),
            "transaction_count": data["transaction_count"],
            "categories": cats,
            "top_category": top_cat,
            "avg_daily_spend": avg_daily,
        })

    # Add trend indicator between consecutive weeks
    for i in range(len(results) - 1):
        current = results[i]["total_spent"]
        previous = results[i + 1]["total_spent"]
        if previous > 0:
            change = ((current - previous) / previous) * 100
            results[i]["trend"] = {
                "direction": "increase" if change > 0 else "decrease",
                "percentage": round(abs(change), 1),
                "vs_previous_week": results[i + 1]["week"],
            }
        else:
            results[i]["trend"] = None

    logger.info("Weekly analytics: %d weeks computed", len(results))
    return results


def get_monthly_spending(
    transactions: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Compute spending grouped by month (YYYY-MM).

    Returns list of monthly summaries with category breakdowns,
    sorted most recent first.
    """
    debits = _categorize_and_enrich(_filter_debits(transactions))

    monthly: dict[str, dict[str, Any]] = {}
    for txn in debits:
        month_label = txn["_dt"].strftime("%Y-%m")
        if month_label not in monthly:
            monthly[month_label] = {
                "total_spent": 0.0,
                "transaction_count": 0,
                "categories": {},
            }
        bucket = monthly[month_label]
        amt = txn.get("amount", 0.0)
        bucket["total_spent"] += amt
        bucket["transaction_count"] += 1
        cat = txn["_category"]
        bucket["categories"][cat] = bucket["categories"].get(cat, 0.0) + amt

    sorted_months = sorted(monthly.keys(), reverse=True)

    results = []
    for month in sorted_months:
        data = monthly[month]
        cats = {k: round(v, 2) for k, v in data["categories"].items()}
        top_cat = max(cats, key=cats.get) if cats else None

        # Approximate days in the month for avg calculation
        days_in_month = 30
        avg_daily = round(data["total_spent"] / days_in_month, 2)

        results.append({
            "month": month,
            "total_spent": round(data["total_spent"], 2),
            "transaction_count": data["transaction_count"],
            "categories": cats,
            "top_category": top_cat,
            "avg_daily_spend": avg_daily,
        })

    # Trend between consecutive months
    for i in range(len(results) - 1):
        current = results[i]["total_spent"]
        previous = results[i + 1]["total_spent"]
        if previous > 0:
            change = ((current - previous) / previous) * 100
            results[i]["trend"] = {
                "direction": "increase" if change > 0 else "decrease",
                "percentage": round(abs(change), 1),
                "vs_previous_month": results[i + 1]["month"],
            }
        else:
            results[i]["trend"] = None

    logger.info("Monthly analytics: %d months computed", len(results))
    return results


def get_yearly_spending(
    transactions: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Compute spending grouped by year.

    Returns list of yearly summaries with category breakdowns,
    sorted most recent first.
    """
    debits = _categorize_and_enrich(_filter_debits(transactions))

    yearly: dict[str, dict[str, Any]] = {}
    for txn in debits:
        year_label = txn["_dt"].strftime("%Y")
        if year_label not in yearly:
            yearly[year_label] = {
                "total_spent": 0.0,
                "transaction_count": 0,
                "categories": {},
            }
        bucket = yearly[year_label]
        amt = txn.get("amount", 0.0)
        bucket["total_spent"] += amt
        bucket["transaction_count"] += 1
        cat = txn["_category"]
        bucket["categories"][cat] = bucket["categories"].get(cat, 0.0) + amt

    sorted_years = sorted(yearly.keys(), reverse=True)

    results = []
    for year in sorted_years:
        data = yearly[year]
        cats = {k: round(v, 2) for k, v in data["categories"].items()}
        top_cat = max(cats, key=cats.get) if cats else None
        avg_monthly = round(data["total_spent"] / 12, 2)

        results.append({
            "year": year,
            "total_spent": round(data["total_spent"], 2),
            "transaction_count": data["transaction_count"],
            "categories": cats,
            "top_category": top_cat,
            "avg_monthly_spend": avg_monthly,
        })

    # Trend between consecutive years
    for i in range(len(results) - 1):
        current = results[i]["total_spent"]
        previous = results[i + 1]["total_spent"]
        if previous > 0:
            change = ((current - previous) / previous) * 100
            results[i]["trend"] = {
                "direction": "increase" if change > 0 else "decrease",
                "percentage": round(abs(change), 1),
                "vs_previous_year": results[i + 1]["year"],
            }
        else:
            results[i]["trend"] = None

    logger.info("Yearly analytics: %d years computed", len(results))
    return results
