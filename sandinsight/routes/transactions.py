"""
SandInsight - Transactions Route

Handles mock transaction injection and transaction listing.
"""

import logging
from fastapi import APIRouter
from pydantic import BaseModel, Field

from services.aa_simulator import add_transaction, simulate_fi_ready
from services.parser import parse_rebit_data

logger = logging.getLogger("sandinsight.routes.transactions")
router = APIRouter(tags=["Transactions"])


class TransactionRequest(BaseModel):
    """Request body for adding a mock transaction."""
    merchant: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Merchant name (e.g. ZOMATO, AMAZON)",
        examples=["ZOMATO", "AMAZON", "SWIGGY"],
    )
    amount: float = Field(
        ...,
        gt=0,
        description="Transaction amount in INR",
        examples=[450.0, 1299.0],
    )


@router.post("/add-mock-transaction")
async def add_mock_transaction(req: TransactionRequest):
    """
    Add a new transaction to mock_bank.json.

    The transaction is created in ReBIT format with proper
    UPI narration, timestamps, and balance updates.
    """
    logger.info(
        "POST /add-mock-transaction — merchant=%s, amount=₹%.2f",
        req.merchant, req.amount,
    )

    new_txn = add_transaction(req.merchant, req.amount)

    return {
        "status": "success",
        "message": f"Transaction added: {req.merchant} — ₹{req.amount:.2f}",
        "data": new_txn,
    }


@router.get("/transactions")
async def list_transactions():
    """
    List all transactions from mock_bank.json in parsed form.
    """
    logger.info("GET /transactions — listing all transactions")

    raw_data = simulate_fi_ready()
    parsed = parse_rebit_data(raw_data)

    return {
        "status": "success",
        "count": len(parsed["transactions"]),
        "data": parsed["transactions"],
    }
