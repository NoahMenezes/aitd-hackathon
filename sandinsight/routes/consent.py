"""
SandInsight - Consent Route

Handles the simulated Account Aggregator consent flow.
"""

import logging
from fastapi import APIRouter

from services.aa_simulator import create_mock_consent

logger = logging.getLogger("sandinsight.routes.consent")
router = APIRouter(tags=["Consent"])


@router.post("/create-consent")
async def create_consent():
    """
    Create a simulated AA consent request.

    Returns a mock consentHandle, sessionId, and redirect URL
    to mimic the real Account Aggregator consent flow.
    """
    logger.info("POST /create-consent — initiating consent flow")
    consent = create_mock_consent()
    return {
        "status": "success",
        "message": "Consent created successfully",
        "data": consent,
    }
