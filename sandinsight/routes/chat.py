from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.chat")
router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/{user_id}/{session_id}")
async def chat_with_bot(user_id: str, session_id: str, req: ChatRequest):
    """
    Chat endpoint for FinPilot AI Strategy Advisor.
    Generates a contextual response based on the user's actual financial data.
    """
    logger.info(f"Chat request from {user_id} (session {session_id}): {req.message}")
    
    try:
        # Load real data
        raw_data = simulate_fi_ready()
        parsed = parse_rebit_data(raw_data)
        transactions = parsed["transactions"]
        
        # Generate insights to have context
        insights_data = generate_insights(transactions)
        summary = insights_data["summary"]
        top_merchants = insights_data["top_merchants"]
        all_insights = insights_data["insights"]
        
        msg = req.message.lower()
        
        # Simple rule-based logic for the demo chatbot to feel "real" and connected to data
        if "spend" in msg or "expense" in msg or "how much" in msg:
            response = f"Your total expenses for this period are ₹{summary['total_debit']:,.2f}. "
            if insights_data["category_totals"]:
                top_cat = max(insights_data["category_totals"], key=insights_data["category_totals"].get)
                response += f"Your highest spending category is {top_cat} at ₹{insights_data['category_totals'][top_cat]:,.2f}."
            else:
                response += "I couldn't find a clear breakdown of your categories yet."
                
        elif "save" in msg or "saving" in msg:
            response = f"Your current savings rate is {summary['savings_rate']}%. "
            if summary['savings_rate'] < 20:
                response += "That's a bit below the recommended 20%. I suggest checking your Shopping and Food delivery apps for potential cuts."
            else:
                response += "Great job! You're saving significantly more than the average user."
                
        elif "merchant" in msg or "where" in msg or "who" in msg:
            if top_merchants:
                merchants_list = ", ".join([f"{m['merchant']} (₹{m['total_spent']:,.0f})" for m in top_merchants[:3]])
                response = f"Your top merchants are: {merchants_list}."
            else:
                response = "I don't have enough merchant data to give you a detailed list yet."
                
        elif "insight" in msg or "advice" in msg or "recommend" in msg or "why" in msg:
            if all_insights:
                response = f"Here's what I detected: {all_insights[0]}. "
                if len(insights_data["recommendations"]) > 0:
                    response += f"My recommendation: {insights_data['recommendations'][0]}"
            else:
                response = "Everything looks stable! I don't see any immediate concerns in your spending patterns."
        
        else:
            # General fallback that sounds smart
            response = (
                f"Based on your latest transactions, your net flow is ₹{summary['net_flow']:,.2f}. "
                "I'm monitoring your patterns for any anomalies or potential savings. "
                "Is there a specific category you'd like me to analyze?"
            )
            
        return {"response": response}
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return {"response": "I'm having trouble accessing your financial records right now. Please try again in a moment."}
