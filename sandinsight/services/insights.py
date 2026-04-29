"""
SandInsight - Financial Insights Engine

Categorizes transactions, detects overspending patterns,
and generates actionable financial recommendations.
"""

import logging
from typing import Any

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


def generate_insights(transactions: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Analyze a list of parsed transactions and produce financial insights.

    Returns:
        Dictionary containing:
        - category_totals: spending per category
        - budget_status: per-category budget analysis
        - insights: list of insight messages
        - recommendations: list of actionable recommendations
        - top_merchants: most-spent-at merchants
        - summary: overall financial summary
    """
    # ── 1. Categorize & aggregate ────────────────
    category_totals: dict[str, float] = {}
    category_counts: dict[str, int] = {}
    merchant_totals: dict[str, float] = {}
    total_debit = 0.0
    total_credit = 0.0

    for txn in transactions:
        narration = txn.get("narration", "")
        amount = txn.get("amount", 0.0)
        txn_type = txn.get("type", "DEBIT")

        if txn_type == "CREDIT":
            total_credit += amount
            continue

        total_debit += amount
        category = categorize_transaction(narration)

        category_totals[category] = category_totals.get(category, 0.0) + amount
        category_counts[category] = category_counts.get(category, 0) + 1

        # Extract merchant name from narration (UPI/MERCHANT/...)
        merchant = _extract_merchant(narration)
        if merchant:
            merchant_totals[merchant] = merchant_totals.get(merchant, 0.0) + amount

    # ── 2. Budget analysis ───────────────────────
    budget_status: list[dict[str, Any]] = []
    insights: list[str] = []
    recommendations: list[str] = []

    for category, limit in BUDGET_LIMITS.items():
        spent = category_totals.get(category, 0.0)
        remaining = limit - spent
        pct_used = (spent / limit * 100) if limit > 0 else 0

        status = "within_budget"
        if spent > limit:
            status = "exceeded"
        elif pct_used >= 80:
            status = "warning"

        budget_status.append({
            "category": category,
            "budget_limit": limit,
            "spent": round(spent, 2),
            "remaining": round(remaining, 2),
            "percentage_used": round(pct_used, 1),
            "status": status,
            "transaction_count": category_counts.get(category, 0),
        })

        # Generate insights for exceeded / near-limit budgets
        if status == "exceeded":
            overshoot = spent - limit
            insights.append(
                f"🔴 {category} budget exceeded by ₹{overshoot:,.0f} "
                f"({pct_used:.0f}% of ₹{limit:,.0f} limit)"
            )
            recommendations.append(
                _budget_recommendation(category, overshoot, category_counts.get(category, 0))
            )
        elif status == "warning":
            insights.append(
                f"🟡 {category} spending at {pct_used:.0f}% of budget — "
                f"only ₹{remaining:,.0f} remaining"
            )
            recommendations.append(
                f"Consider slowing down {category.lower()} spending "
                f"to stay within your ₹{limit:,.0f} budget."
            )

    # ── 3. Pattern detection ─────────────────────
    pattern_insights, pattern_recs = _detect_patterns(
        transactions, category_totals, merchant_totals, total_debit, total_credit
    )
    insights.extend(pattern_insights)
    recommendations.extend(pattern_recs)

    # ── 4. Top merchants ─────────────────────────
    top_merchants = sorted(
        [{"merchant": m, "total_spent": round(t, 2)} for m, t in merchant_totals.items()],
        key=lambda x: x["total_spent"],
        reverse=True,
    )[:5]

    # ── 5. Summary ───────────────────────────────
    savings_rate = ((total_credit - total_debit) / total_credit * 100) if total_credit > 0 else 0

    summary = {
        "total_income": round(total_credit, 2),
        "total_expenses": round(total_debit, 2),
        "net_flow": round(total_credit - total_debit, 2),
        "savings_rate": round(savings_rate, 1),
        "transaction_count": len(transactions),
        "categories_tracked": len(category_totals),
    }

    logger.info(
        "Generated %d insights and %d recommendations",
        len(insights), len(recommendations),
    )

    return {
        "category_totals": {k: round(v, 2) for k, v in category_totals.items()},
        "budget_status": budget_status,
        "insights": insights,
        "recommendations": recommendations,
        "top_merchants": top_merchants,
        "summary": summary,
    }


def _extract_merchant(narration: str) -> str:
    """Extract merchant name from a UPI-style narration string."""
    parts = narration.split("/")
    if len(parts) >= 2:
        return parts[1].strip().upper()
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
