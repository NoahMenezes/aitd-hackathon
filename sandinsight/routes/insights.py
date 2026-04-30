from fastapi import APIRouter, Query
import logging
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.insights")
router = APIRouter(prefix="/insights", tags=["Insights"])

def _load_transactions() -> list[dict]:
    raw = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    return parsed["transactions"]

@router.get("/category-breakdown/{user_id}")
async def category_breakdown(user_id: str, period: str = Query(None)):
    """
    Returns spending breakdown by category for a specific period.
    """
    logger.info(f"GET /insights/category-breakdown/{user_id} - period={period}")
    txns = _load_transactions()
    
    # If period is provided (e.g. 2026-04), filter transactions
    if period:
        txns = [t for t in txns if t.get("timestamp", "").startswith(period) or t.get("date", "").startswith(period)]
        
    insights = generate_insights(txns)
    category_totals = insights.get("category_totals", {})
    
    categories = []
    total_amount = sum(category_totals.values())
    for name, amount in category_totals.items():
        percentage = round((amount / total_amount * 100), 1) if total_amount > 0 else 0
        categories.append({"name": name, "amount": amount, "percentage": percentage})
    
    return {
        "status": "success",
        "period": period,
        "categories": categories
    }

@router.get("/ai-observations/{user_id}")
async def ai_observations(user_id: str):
    """
    Returns a list of AI observations based on the user's transactions.
    """
    logger.info(f"GET /insights/ai-observations/{user_id}")
    txns = _load_transactions()
    insights_data = generate_insights(txns)
    
    # insights_data["insights"] is a list of strings. We map it to {title, description}
    observations = []
    for insight_str in insights_data.get("insights", []):
        # Extract emoji if present as title hint, or just use a generic title
        parts = insight_str.split(":", 1)
        if len(parts) > 1:
            title = parts[0].strip()
            description = parts[1].strip()
        else:
            # Fallback title if no colon is found
            title = "Spending Insight"
            description = insight_str

        observations.append({
            "title": title,
            "description": description
        })
        
    return {
        "status": "success",
        "observations": observations
    }
