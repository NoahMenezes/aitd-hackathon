"""
SandInsight - Income & Business Analytics

Provides:
  income_analytics()    Monthly income trend, stability score, top sources
  cashflow_analytics()  Cash in vs cash out, net flow per period
  business_analytics()  Shopkeeper: daily revenue, peak hours, avg txn value
"""
from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from statistics import mean, stdev

from services.patterns import (
    SALARY_INC, FREELANCE_INC, BUSINESS_INC, INCOME,
    SUPPLIER, TRANSFER,
)

logger = logging.getLogger("sandinsight.income_analytics")
IST = timezone(timedelta(hours=5, minutes=30))
INCOME_CATS = {SALARY_INC, FREELANCE_INC, BUSINESS_INC, INCOME}


def _parse_ts(ts: str) -> datetime | None:
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.astimezone(IST)
    except Exception:
        return None


def _month_key(ts: str) -> str:
    dt = _parse_ts(ts)
    return dt.strftime("%Y-%m") if dt else "unknown"


# ── Income Analytics ──────────────────────────────────────────────────────────

def income_analytics(transactions: list[dict]) -> dict:
    """
    Analyse all income (CREDIT) transactions.

    Returns:
        monthly_income:      {month: total_credited}
        income_by_category:  {Salary/Freelance/Business: total}
        top_sources:         top 5 narrations by total amount
        stability_score:     0-100 (100 = perfectly consistent monthly income)
        avg_monthly_income:  mean monthly total
        income_trend:        "growing" | "declining" | "stable" | "irregular"
        total_income:        grand total credits
    """
    # Filter to CREDIT transactions only
    credits = [
        t for t in transactions
        if (t.get("type") or "").upper() == "CREDIT"
    ]

    monthly: defaultdict[str, float] = defaultdict(float)
    by_category: defaultdict[str, float] = defaultdict(float)
    by_source: defaultdict[str, float] = defaultdict(float)

    for t in credits:
        mk  = _month_key(t.get("timestamp") or t.get("transactionTimestamp", ""))
        amt = float(t.get("amount", 0))
        clf = t.get("classification", {})
        cat = clf.get("category", INCOME) if clf else INCOME

        monthly[mk] += amt
        by_category[cat] += amt

        # Source = first 30 chars of narration (merchant/entity)
        narr   = (t.get("narration", "") or "")
        source = narr[:35].upper().strip()
        by_source[source] += amt

    months_sorted = sorted(monthly.keys())
    monthly_values = [monthly[m] for m in months_sorted]

    # Stability score: inverse of coefficient of variation (capped 0-100)
    stability = 0
    if len(monthly_values) >= 2:
        mu = mean(monthly_values)
        sd = stdev(monthly_values)
        cv = sd / mu if mu > 0 else 1
        stability = max(0, min(100, int((1 - cv) * 100)))

    # Trend
    trend = "irregular"
    if len(monthly_values) >= 3:
        first_half = mean(monthly_values[:len(monthly_values)//2])
        second_half= mean(monthly_values[len(monthly_values)//2:])
        if second_half > first_half * 1.1:
            trend = "growing"
        elif second_half < first_half * 0.9:
            trend = "declining"
        else:
            trend = "stable"

    top_sources = sorted(
        [{"source": k, "total": round(v, 2)} for k, v in by_source.items()],
        key=lambda x: -x["total"]
    )[:5]

    total_income = sum(monthly_values) if monthly_values else 0.0

    logger.info(
        "Income analytics: Rs.%.0f total, stability=%d, trend=%s",
        total_income, stability, trend,
    )

    return {
        "monthly_income":     {m: round(monthly[m], 2) for m in months_sorted},
        "income_by_category": {k: round(v, 2) for k, v in sorted(by_category.items(), key=lambda x: -x[1])},
        "top_sources":        top_sources,
        "stability_score":    stability,
        "avg_monthly_income": round(mean(monthly_values), 2) if monthly_values else 0.0,
        "income_trend":       trend,
        "total_income":       round(total_income, 2),
    }


# ── Cash Flow Analytics ───────────────────────────────────────────────────────

def cashflow_analytics(transactions: list[dict]) -> dict:
    """
    Monthly cash in / cash out / net flow with digital vs cash split.

    Returns:
        monthly_cashflow: [{month, total_in, total_out, net_flow, savings_rate}]
        cash_vs_digital:  {cash_amount, digital_amount, cash_pct, digital_pct}
        overall:          {total_in, total_out, net_flow, savings_rate}
    """
    monthly_in:  defaultdict[str, float] = defaultdict(float)
    monthly_out: defaultdict[str, float] = defaultdict(float)
    cash_total   = 0.0
    digital_total= 0.0

    for t in transactions:
        mk   = _month_key(t.get("timestamp") or t.get("transactionTimestamp", ""))
        amt  = float(t.get("amount", 0))
        ttype= (t.get("type") or "").upper()
        mode = (t.get("mode") or "").upper()

        if ttype == "CREDIT":
            monthly_in[mk] += amt
        else:
            monthly_out[mk] += amt
            if mode == "ATM":
                cash_total += amt
            else:
                digital_total += amt

    all_months = sorted(set(list(monthly_in.keys()) + list(monthly_out.keys())))
    monthly_cf = []
    for m in all_months:
        tin   = monthly_in.get(m, 0.0)
        tout  = monthly_out.get(m, 0.0)
        net   = tin - tout
        srate = round(100 * net / tin, 1) if tin > 0 else 0.0
        monthly_cf.append({
            "month":        m,
            "total_in":     round(tin, 2),
            "total_out":    round(tout, 2),
            "net_flow":     round(net, 2),
            "savings_rate": srate,
        })

    total_in  = sum(monthly_in.values())
    total_out = sum(monthly_out.values())
    net_total = total_in - total_out
    total_digital = cash_total + digital_total

    return {
        "monthly_cashflow": monthly_cf,
        "cash_vs_digital": {
            "cash_amount":    round(cash_total, 2),
            "digital_amount": round(digital_total, 2),
            "cash_pct":       round(100 * cash_total / total_digital, 1) if total_digital else 0,
            "digital_pct":    round(100 * digital_total / total_digital, 1) if total_digital else 0,
        },
        "overall": {
            "total_in":    round(total_in, 2),
            "total_out":   round(total_out, 2),
            "net_flow":    round(net_total, 2),
            "savings_rate":round(100 * net_total / total_in, 1) if total_in else 0,
        },
    }


# ── Business Analytics (Shopkeeper) ──────────────────────────────────────────

def business_analytics(transactions: list[dict]) -> dict:
    """
    Shopkeeper-specific metrics.

    Returns:
        daily_revenue:       {date: total sales}
        peak_hours:          {hour: txn_count} for CREDIT txns
        avg_txn_value:       mean per-sale amount
        total_revenue:       sum of all sales
        total_supplier_cost: sum of supplier debits
        gross_margin_pct:    (revenue - supplier) / revenue * 100
        repeat_customers:    narrations appearing 3+ times (loyalty signal)
        busiest_day_of_week: 0=Mon … 6=Sun
    """
    daily_rev:  defaultdict[str, float] = defaultdict(float)
    hour_count: defaultdict[int, int]   = defaultdict(int)
    sale_amounts: list[float]           = []
    supplier_cost = 0.0
    narr_counts: defaultdict[str, int]  = defaultdict(int)
    weekday_rev: defaultdict[int, float]= defaultdict(float)

    for t in transactions:
        amt  = float(t.get("amount", 0))
        ttype= (t.get("type") or "").upper()
        narr = (t.get("narration", "") or "")
        ts   = t.get("timestamp") or t.get("transactionTimestamp", "")
        clf  = t.get("classification", {})
        cat  = clf.get("category", "") if clf else ""

        dt   = _parse_ts(ts)

        if ttype == "CREDIT" and cat in (BUSINESS_INC, INCOME, "Business Income"):
            dk = ts[:10] if ts else "unknown"
            daily_rev[dk] += amt
            sale_amounts.append(amt)
            if dt:
                hour_count[dt.hour] += 1
                weekday_rev[dt.weekday()] += amt
            narr_short = narr[:40].upper()
            narr_counts[narr_short] += 1

        if ttype == "DEBIT" and cat == SUPPLIER:
            supplier_cost += amt

    total_revenue = sum(daily_rev.values())

    # Sort peak hours
    peak_hours = dict(sorted(hour_count.items()))

    # Repeat customers: narrations appearing 3+ times
    repeat_customers = [
        {"pattern": k, "count": v}
        for k, v in narr_counts.items()
        if v >= 3
    ]
    repeat_customers.sort(key=lambda x: -x["count"])

    # Busiest day of week
    busiest = max(weekday_rev, key=weekday_rev.get) if weekday_rev else 0
    day_names = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

    gross_margin = round(
        100 * (total_revenue - supplier_cost) / total_revenue, 1
    ) if total_revenue > 0 else 0.0

    logger.info(
        "Business analytics: revenue Rs.%.0f, supplier cost Rs.%.0f, margin=%.1f%%",
        total_revenue, supplier_cost, gross_margin,
    )

    return {
        "daily_revenue":        {k: round(v, 2) for k, v in sorted(daily_rev.items())},
        "peak_hours":           peak_hours,
        "avg_txn_value":        round(mean(sale_amounts), 2) if sale_amounts else 0.0,
        "total_revenue":        round(total_revenue, 2),
        "total_supplier_cost":  round(supplier_cost, 2),
        "gross_margin_pct":     gross_margin,
        "repeat_customers":     repeat_customers[:10],
        "busiest_day_of_week":  day_names[busiest],
        "total_sales_count":    len(sale_amounts),
    }
