from fastapi import APIRouter
from pydantic import BaseModel
import logging
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.simulation")
router = APIRouter(prefix="/simulation", tags=["Simulation"])

class SimulationRequest(BaseModel):
    category: str
    target_reduction: int
    time_horizon_months: int

@router.post("/run/{user_id}")
async def run_simulation(user_id: str, request: SimulationRequest):
    """
    Run a simulation for a specific category and reduction target.
    """
    logger.info(f"POST /simulation/run/{user_id} - {request.category} {request.target_reduction}%")
    raw = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    txns = parsed["transactions"]
    
    insights = generate_insights(txns)
    category_totals = insights.get("category_totals", {})
    
    # Calculate the monthly spend for the category
    monthly_spend = category_totals.get(request.category, 0)
    
    # Calculate savings
    monthly_savings = monthly_spend * (request.target_reduction / 100.0)
    total_projected_savings = monthly_savings * request.time_horizon_months
    
    return {
        "status": "success",
        "category": request.category,
        "monthly_savings": monthly_savings,
        "total_projected_savings": total_projected_savings,
        "time_horizon_months": request.time_horizon_months
    }
