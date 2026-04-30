from fastapi import APIRouter, Query
import logging
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.recommendations")
router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

def _load_transactions() -> list[dict]:
    raw = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    return parsed["transactions"]

@router.get("/list/{user_id}")
async def list_recommendations(user_id: str):
    """
    Returns a list of actionable financial recommendations.
    """
    logger.info(f"GET /recommendations/list/{user_id}")
    txns = _load_transactions()
    insights_data = generate_insights(txns)
    
    # Recommendations in generate_insights are currently strings.
    # The frontend expects {title, description, category, impact_monthly}
    recs = []
    for r_text in insights_data.get("recommendations", []):
        # Simple parsing for simulation
        title = r_text.split(".")[0] if "." in r_text else r_text
        recs.append({
            "title": title,
            "description": r_text,
            "category": "Saving",
            "impact_monthly": 1500  # Mock impact
        })
        
    return {
        "status": "success",
        "recommendations": recs,
        "total_savings": len(recs) * 1500 * 12
    }
