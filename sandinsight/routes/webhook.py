"""
SandInsight - Webhook Route

Simulates the FI_READY webhook callback from an Account Aggregator.
Loads bank data, parses it, and runs the insights engine.
"""

import logging
from fastapi import APIRouter

from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.webhook")
router = APIRouter(tags=["Webhook"])


@router.post("/webhook")
async def webhook_fi_ready():
    """
    Handle a simulated FI_READY webhook.

    Pipeline:
    1. Load mock bank data (simulates AA data fetch)
    2. Parse ReBIT-format JSON into clean records
    3. Run insights engine for categorization + recommendations
    4. Return complete insights payload
    """
    logger.info("POST /webhook — FI_READY received")

    # Step 1: Fetch raw financial data
    raw_data = simulate_fi_ready()

    # Step 2: Parse into structured records
    parsed = parse_rebit_data(raw_data)

    # Step 3: Generate insights
    insights = generate_insights(parsed["transactions"])

    logger.info(
        "Webhook pipeline complete: %d insights, %d recommendations",
        len(insights["insights"]),
        len(insights["recommendations"]),
    )

    return {
        "status": "success",
        "message": "FI data processed and insights generated",
        "data": {
            "account_info": parsed["account_info"],
            "insights": insights,
        },
    }
