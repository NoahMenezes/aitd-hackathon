"""
SandInsight - Financial Profile & Income Routes

Endpoints:
  POST /generate-data                  Generate mock data for a user profile
  GET  /analytics/income               Income trend, stability, top sources
  GET  /analytics/cashflow             Monthly cash in/out, cash vs digital
  GET  /analytics/business             Shopkeeper metrics (peak hours, margin)
"""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from services.aa_simulator import simulate_fi_ready
from services.data_generator import generate_profile_data
from services.income_analytics import (
    income_analytics,
    cashflow_analytics,
    business_analytics,
)
from services.parser import parse_rebit_data

router = APIRouter(tags=["Financial Profiles"])
logger = logging.getLogger("sandinsight.routes.profiles")


# ── Request models ────────────────────────────────────────────────────────────

class GenerateDataRequest(BaseModel):
    user_type: str   # "salaried" | "freelancer" | "shopkeeper"
    months:    int = 3


# ── Helper: load + parse transactions ────────────────────────────────────────

def _get_transactions() -> list[dict]:
    raw    = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    return parsed.get("transactions", [])


# ── POST /generate-data ───────────────────────────────────────────────────────

@router.post("/generate-data")
def generate_data(req: GenerateDataRequest):
    """
    Generate and store realistic mock financial data for a given user type.
    Overwrites mock_bank.json with fresh profile-specific data.
    """
    valid = {"salaried", "freelancer", "shopkeeper"}
    if req.user_type not in valid:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid user_type '{req.user_type}'. Must be one of: {sorted(valid)}"
        )
    if not (1 <= req.months <= 12):
        raise HTTPException(status_code=422, detail="months must be 1–12")

    logger.info("Generating %s profile for %d months", req.user_type, req.months)

    result = generate_profile_data(req.user_type, req.months)

    return {
        "status":  "success",
        "message": (
            f"Generated {result['txn_count']} transactions for "
            f"'{req.user_type}' profile ({req.months} months). "
            f"mock_bank.json updated."
        ),
        "data": result,
    }


# ── GET /analytics/income ─────────────────────────────────────────────────────

@router.get("/analytics/income")
def get_income_analytics():
    """
    Income analysis: monthly trend, stability score (0-100),
    income-type breakdown (Salary / Freelance / Business), top sources.
    """
    logger.info("GET /analytics/income")
    txns = _get_transactions()
    result = income_analytics(txns)
    return {"status": "success", "data": result}


# ── GET /analytics/cashflow ───────────────────────────────────────────────────

@router.get("/analytics/cashflow")
def get_cashflow_analytics():
    """
    Monthly cash-in vs cash-out, net flow, savings rate,
    and digital vs ATM cash split.
    """
    logger.info("GET /analytics/cashflow")
    txns   = _get_transactions()
    result = cashflow_analytics(txns)
    return {"status": "success", "data": result}


# ── GET /analytics/business ───────────────────────────────────────────────────

@router.get("/analytics/business")
def get_business_analytics():
    """
    Shopkeeper-specific metrics: daily revenue, peak hours,
    supplier costs, gross margin, repeat customer patterns.
    """
    logger.info("GET /analytics/business")
    txns   = _get_transactions()
    result = business_analytics(txns)
    return {"status": "success", "data": result}
