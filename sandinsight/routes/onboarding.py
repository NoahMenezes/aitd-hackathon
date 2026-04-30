"""
SandInsight - Onboarding Route

Handles the AA-compliant user onboarding flow:
  1. POST /onboard/discover  — user provides phone, system finds linked accounts
  2. POST /onboard/consent   — user selects an account, consent is created
  3. POST /onboard/complete  — webhook fires, full insights returned

This simulates the real-world 3-step AA journey in one clean flow.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.aa_simulator import (
    lookup_account_by_phone,
    create_mock_consent,
    simulate_fi_ready,
)
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.onboarding")
router = APIRouter(prefix="/onboard", tags=["Onboarding"])


# ── Request models ────────────────────────────────────────────────────────────

class PhoneLookupRequest(BaseModel):
    phone: str = Field(
        ...,
        min_length=10,
        max_length=13,
        description="10-digit mobile number (e.g. 9876543210)",
        examples=["9876543210"],
    )

class ConsentRequest(BaseModel):
    phone: str = Field(..., description="Verified phone number")
    maskedAccNo: str = Field(..., description="Account selected by the user")
    purpose: str = Field(
        default="Financial Insights & Budgeting",
        description="Purpose of data access consent",
    )


# ── Step 1: Discover linked accounts ─────────────────────────────────────────

@router.post("/discover")
async def discover_accounts(req: PhoneLookupRequest):
    """
    Step 1 — Account Discovery.

    User enters their mobile number. The system queries the AA
    framework to find all bank accounts linked to that number.

    In real AA: this triggers an FIP discovery request.
    Here: we look up phone in mock_bank.json holder data.
    """
    logger.info("POST /onboard/discover — phone=%s", req.phone)

    result = lookup_account_by_phone(req.phone)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "NO_ACCOUNT_FOUND",
                "message": (
                    f"No bank account linked to mobile {req.phone}. "
                    "Please check your number or register with your bank."
                ),
            },
        )

    return {
        "status": "success",
        "step": "DISCOVERY_COMPLETE",
        "message": f"Found {len(result['linkedAccounts'])} linked account(s) for {req.phone}",
        "data": result,
    }


# ── Step 2: Create Consent ────────────────────────────────────────────────────

@router.post("/consent")
async def create_consent(req: ConsentRequest):
    """
    Step 2 — Consent Creation.

    User selects which account to link and approves data sharing.
    System creates a consent handle and returns a redirect URL
    (in real AA, user would be sent to bank's approval screen).
    """
    logger.info(
        "POST /onboard/consent — phone=%s, acc=%s", req.phone, req.maskedAccNo
    )

    # Verify phone is still valid
    result = lookup_account_by_phone(req.phone)
    if result is None:
        raise HTTPException(status_code=404, detail="Phone number not found")

    # Check the selected account actually belongs to this user
    linked = [a["maskedAccNo"] for a in result["linkedAccounts"]]
    if req.maskedAccNo not in linked:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "ACCOUNT_MISMATCH",
                "message": f"{req.maskedAccNo} is not linked to {req.phone}",
            },
        )

    consent = create_mock_consent()

    return {
        "status": "success",
        "step": "CONSENT_CREATED",
        "message": "Consent created. Awaiting user approval via bank redirect.",
        "data": {
            "consentHandle": consent["consentHandle"],
            "sessionId":     consent["sessionId"],
            "redirectUrl":   consent["redirectUrl"],
            "purpose":       req.purpose,
            "account":       req.maskedAccNo,
            "holder":        result["name"],
            "ckycStatus":    result["ckycStatus"],
            "expiresIn":     "10 minutes",
            "nextStep":      "POST /onboard/complete with consentHandle",
        },
    }


# ── Step 3: Complete Onboarding (FI_READY + Insights) ────────────────────────

class CompleteRequest(BaseModel):
    consentHandle: str = Field(..., description="Handle returned from /onboard/consent")


@router.post("/complete")
async def complete_onboarding(req: CompleteRequest):
    """
    Step 3 — Onboarding Complete (FI_READY webhook simulation).

    After the user approves consent on the bank's page, the AA
    fires a FI_READY webhook. This endpoint simulates that event:
    downloads financial data, parses it, and runs the AI insights engine.

    This is the final step — after this the user's dashboard is ready.
    """
    logger.info(
        "POST /onboard/complete — consentHandle=%s", req.consentHandle
    )

    # Fetch + parse FI data
    raw_data = simulate_fi_ready()
    parsed   = parse_rebit_data(raw_data)
    insights = generate_insights(parsed["transactions"])

    logger.info(
        "Onboarding complete: %d txns parsed, %d insights generated",
        len(parsed["transactions"]), len(insights["insights"]),
    )

    return {
        "status":  "success",
        "step":    "ONBOARDING_COMPLETE",
        "message": "Account linked successfully. Financial insights are ready.",
        "data": {
            "consentHandle": req.consentHandle,
            "account":       parsed["account_info"],
            "insights":      insights,
        },
    }
    
@router.post("/seed/{user_id}")
async def seed_user_data(user_id: str):
    """
    Seeds the system with mock financial data for the given user.
    Simulates the first-time data fetch from an Account Aggregator.
    """
    logger.info(f"POST /seed/{user_id}")
    # In this simulation, simulate_fi_ready already provides the data.
    # We just return success to satisfy the frontend flow.
    return {
        "status": "success",
        "message": f"Data seeded for user {user_id}. Insights are now available."
    }
