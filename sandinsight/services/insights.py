"""
SandInsight - Financial Insights Engine

Uses classifier output (category + confidence) from the classification
pipeline instead of raw keyword matching, and enriches insights with
anomaly detection (outliers, recurring patterns, weekend ratio).
"""

import logging
from typing import Any

from services.anomaly import (
    detect_outliers,
    detect_recurring,
    detect_salary_pattern,
    weekend_spending_ratio,
)

logger = logging.getLogger("sandinsight.insights")


# ──────────────────────────────────────────────
# Category definitions: keyword → category
# ──────────────────────────────────────────────
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Food & Dining": [
        "ZOMATO", "SWIGGY", "FOODPANDA", "DOMINOS", "PIZZA",
        "MCDONALDS", "KFC", "BURGER", "RESTAURANT", "CAFE",
        "STARBUCKS", "FOOD", "DINING", "LUNCH", "DINNER",
        "BREAKFAST", "SNACKS",
    ],
    "Shopping": [
        "AMAZON", "FLIPKART", "MYNTRA", "AJIO", "MEESHO",
        "NYKAA", "TATACLIQ", "SNAPDEAL", "SHOPPING",
        "ELECTRONICS", "GADGETS", "CLOTHING", "FASHION",
        "PURCHASE",
    ],
    "Groceries": [
        "BIGBASKET", "BLINKIT", "GROFERS", "DUNZO",
        "ZEPTO", "DMART", "GROCERY", "GROCERIES",
        "VEGETABLES", "FRUITS",
    ],
    "Rent & Utilities": [
        "RENT", "ELECTRICITY", "WATER", "GAS", "BROADBAND",
        "INTERNET", "WIFI", "LANDLORD", "MAINTENANCE",
    ],
    "Entertainment": [
        "NETFLIX", "HOTSTAR", "PRIME", "SPOTIFY", "YOUTUBE",
        "SUBSCRIPTION", "MOVIE", "THEATRE", "GAMING",
    ],
    "Transport": [
        "OLA", "UBER", "RAPIDO", "METRO", "IRCTC",
        "FUEL", "PETROL", "DIESEL", "PARKING", "TOLL",
    ],
    "Income": [
        "SALARY", "CREDIT", "REFUND", "CASHBACK",
        "INTEREST", "DIVIDEND",
    ],
}

# ──────────────────────────────────────────────
# Monthly budget thresholds (₹)
# ──────────────────────────────────────────────
BUDGET_LIMITS: dict[str, float] = {
    "Food & Dining": 5000.0,
    "Shopping": 8000.0,
    "Groceries": 4000.0,
    "Rent & Utilities": 20000.0,
    "Entertainment": 2000.0,
    "Transport": 3000.0,
}


def categorize_transaction(narration: str) -> str:
    """Determine the category of a transaction from its narration string."""
    narration_upper = narration.upper()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in narration_upper for kw in keywords):
            return category
    return "Others"







def _extract_merchant(narration: str) -> str:
    """Extract merchant name from narration (handles both UPI- and UPI/ formats)."""
    # New format: UPI-MERCHANT NAME-vpa@bank
    if "-" in narration:
        parts = narration.split("-", 2)
        if len(parts) >= 2:
            return parts[1].strip().upper()[:20]
    # Legacy format: UPI/MERCHANT/...
    parts = narration.split("/")
    if len(parts) >= 2:
        return parts[1].strip().upper()[:20]
    return ""


def _budget_recommendation(category: str, overshoot: float, count: int) -> str:
    """Generate a contextual recommendation for an exceeded category."""
    if category == "Food & Dining":
        return (
            f"Reduce ordering frequency to save ₹{overshoot:,.0f}. "
            f"You placed {count} food orders this period — "
            f"try cooking at home 2-3 times a week."
        )
    if category == "Shopping":
        return (
            f"Your shopping exceeded budget by ₹{overshoot:,.0f}. "
            f"Consider using wishlists and waiting 48 hours before purchasing."
        )
    if category == "Entertainment":
        return (
            f"Entertainment overspend: ₹{overshoot:,.0f}. "
            f"Review your active subscriptions and cancel unused ones."
        )
    return (
        f"Spending in '{category}' exceeded budget by ₹{overshoot:,.0f}. "
        f"Review recent transactions and identify areas to cut back."
    )


def _detect_patterns(
    transactions: list[dict],
    category_totals: dict[str, float],
    merchant_totals: dict[str, float],
    total_debit: float,
    total_credit: float,
) -> tuple[list[str], list[str]]:
    """Detect spending patterns and generate higher-level insights."""
    insights: list[str] = []
    recommendations: list[str] = []

    # High food-delivery dependency
    food_merchants = {"ZOMATO", "SWIGGY", "FOODPANDA"}
    food_delivery_spend = sum(
        merchant_totals.get(m, 0.0) for m in food_merchants
    )
    if food_delivery_spend > 3000:
        insights.append(
            f"📱 High food-delivery dependency: ₹{food_delivery_spend:,.0f} "
            f"spent on delivery apps alone"
        )
        recommendations.append(
            "Switch to home-cooked meals or bulk meal prep on weekends "
            "to reduce food delivery costs by up to 60%."
        )

    # Shopping concentration
    if merchant_totals:
        top_merchant = max(merchant_totals, key=merchant_totals.get)
        top_amount = merchant_totals[top_merchant]
        if total_debit > 0 and (top_amount / total_debit) > 0.20:
            insights.append(
                f"🏪 {top_merchant} accounts for "
                f"{(top_amount / total_debit * 100):.0f}% of your total spending"
            )

    # Savings health check
    if total_credit > 0:
        savings_pct = (total_credit - total_debit) / total_credit * 100
        if savings_pct < 20:
            insights.append(
                f"💰 Savings rate is only {savings_pct:.1f}% — "
                f"below the recommended 20% minimum"
            )
            recommendations.append(
                "Aim to save at least 20% of your income. "
                "Set up an automatic transfer to a savings account on payday."
            )
        elif savings_pct > 40:
            insights.append(
                f"🌟 Excellent savings rate of {savings_pct:.1f}%! "
                f"Consider investing the surplus."
            )
            recommendations.append(
                "You're saving well! Explore SIPs in index funds or "
                "fixed deposits to grow your surplus."
            )

    return insights, recommendations


def generate_insights(transactions: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Analyze a list of parsed transactions and produce financial insights.
    """
    category_totals: dict[str, float] = {}
    merchant_totals: dict[str, float] = {}
    total_debit = 0.0
    total_credit = 0.0

    category_counts: dict[str, int] = {}
    for txn in transactions:
        amount = txn.get("amount", 0.0)
        txn_type = txn.get("type", "DEBIT")
        narration = txn.get("narration", "")
        
        category = categorize_transaction(narration)
        
        if txn_type == "CREDIT":
            total_credit += amount
        else:
            total_debit += amount
            category_totals[category] = category_totals.get(category, 0.0) + amount
            category_counts[category] = category_counts.get(category, 0) + 1
            merchant = _extract_merchant(narration)
            if merchant:
                merchant_totals[merchant] = merchant_totals.get(merchant, 0.0) + amount

    # Budget analysis
    budget_status = []
    insights = []
    recommendations = []
    
    for cat, limit in BUDGET_LIMITS.items():
        spent = category_totals.get(cat, 0.0)
        if spent > limit:
            insights.append(f"🔴 {cat} budget exceeded by ₹{spent-limit:,.0f}")
            recommendations.append(_budget_recommendation(cat, spent - limit, category_counts.get(cat, 0)))
        budget_status.append({
            "category": cat,
            "limit": limit,
            "spent": spent,
            "status": "exceeded" if spent > limit else "ok"
        })

    # Pattern detection
    pattern_insights, pattern_recs = _detect_patterns(
        transactions, category_totals, merchant_totals, total_debit, total_credit
    )
    insights.extend(pattern_insights)
    recommendations.extend(pattern_recs)

    return {
        "category_totals": {k: round(v, 2) for k, v in category_totals.items()},
        "budget_status": budget_status,
        "insights": insights,
        "recommendations": recommendations,
        "top_merchants": sorted([{"merchant": k, "total_spent": v} for k, v in merchant_totals.items()], key=lambda x: x["total_spent"], reverse=True)[:5],
        "summary": {
            "total_debit": round(total_debit, 2),
            "total_credit": round(total_credit, 2),
            "net_flow": round(total_credit - total_debit, 2),
            "savings_rate": round((total_credit - total_debit) / total_credit * 100, 1) if total_credit > 0 else 0
        },
        "anomalies": {
            "outliers": detect_outliers(transactions)[:5],
            "recurring": detect_recurring(transactions)[:5],
            "salary_events": detect_salary_pattern(transactions),
            "weekend_ratio": weekend_spending_ratio(transactions),
        }
    }
