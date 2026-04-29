"""
SandInsight - Analytics Route

Exposes time-based financial analytics endpoints:
daily, weekly, monthly, yearly, and today's spending.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Query

from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.analytics import (
    get_daily_spending,
    get_today_spending,
    get_weekly_spending,
    get_monthly_spending,
    get_yearly_spending,
)

logger = logging.getLogger("sandinsight.routes.analytics")
router = APIRouter(prefix="/analytics", tags=["Analytics"])

_IST = timezone(timedelta(hours=5, minutes=30))


def _load_transactions() -> list[dict]:
    """Load and parse transactions from mock bank data."""
    raw = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    return parsed["transactions"]


@router.get("/today")
async def analytics_today():
    """
    Get today's spending summary with comparison to yesterday.

    Returns total spent, category breakdown, and a trend
    comparison message (e.g. "You spent 20% more than yesterday").
    """
    logger.info("GET /analytics/today")
    transactions = _load_transactions()
    data = get_today_spending(transactions)
    return {"status": "success", "data": data}


@router.get("/daily")
async def analytics_daily(
    date: str = Query(
        default=None,
        description="Target date in YYYY-MM-DD format. Defaults to today.",
        examples=["2026-04-10"],
    ),
):
    """
    Get spending breakdown for a specific day.

    Returns total spent, per-category totals, transaction count,
    and the top spending category for that day.
    """
    if date is None:
        date = datetime.now(_IST).strftime("%Y-%m-%d")

    logger.info("GET /analytics/daily — date=%s", date)
    transactions = _load_transactions()
    data = get_daily_spending(transactions, date)
    return {"status": "success", "data": data}


@router.get("/weekly")
async def analytics_weekly(
    weeks: int = Query(
        default=4,
        ge=1,
        le=52,
        description="Number of recent weeks to return (default 4)",
    ),
):
    """
    Get weekly spending summaries (Mon–Sun, ISO weeks).

    Returns the last N weeks with totals, category breakdowns,
    average daily spend, and trend vs. the previous week.
    """
    logger.info("GET /analytics/weekly — weeks=%d", weeks)
    transactions = _load_transactions()
    data = get_weekly_spending(transactions, num_weeks=weeks)
    return {"status": "success", "count": len(data), "data": data}


@router.get("/monthly")
async def analytics_monthly():
    """
    Get monthly spending summaries (YYYY-MM).

    Returns all months with totals, category breakdowns,
    average daily spend, and trend vs. the previous month.
    """
    logger.info("GET /analytics/monthly")
    transactions = _load_transactions()
    data = get_monthly_spending(transactions)
    return {"status": "success", "count": len(data), "data": data}


@router.get("/yearly")
async def analytics_yearly():
    """
    Get yearly spending summaries.

    Returns all years with totals, category breakdowns,
    average monthly spend, and trend vs. the previous year.
    """
    logger.info("GET /analytics/yearly")
    transactions = _load_transactions()
    data = get_yearly_spending(transactions)
    return {"status": "success", "count": len(data), "data": data}
