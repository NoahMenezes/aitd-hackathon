from fastapi import APIRouter, Query
import logging
from datetime import datetime, timedelta, timezone
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.analytics import (
    get_daily_spending,
    get_weekly_spending,
    get_monthly_spending,
    get_yearly_spending,
)
from services.insights import generate_insights

logger = logging.getLogger("sandinsight.routes.dashboard")
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

_IST = timezone(timedelta(hours=5, minutes=30))

def _load_transactions() -> list[dict]:
    raw = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    return parsed["transactions"]

@router.get("/summary/{user_id}")
async def dashboard_summary(user_id: str):
    txns = _load_transactions()
    raw_data = simulate_fi_ready()
    parsed = parse_rebit_data(raw_data)
    
    # Yearly, Monthly, Weekly
    yearly = get_yearly_spending(txns)
    monthly = get_monthly_spending(txns)
    weekly = get_weekly_spending(txns, num_weeks=1)
    
    current_year = yearly[0] if yearly else {"total_spent": 0}
    current_month = monthly[0] if monthly else {"total_spent": 0, "savings_rate": 0, "net_flow": 0}
    current_week = weekly[0] if weekly else {"total_spent": 0}
    
    insights = generate_insights(txns)
    
    return {
        "user": {
            "name": parsed["account_info"]["holder_name"],
            "balance": parsed["account_info"]["current_balance"],
            "income": insights["summary"]["total_credit"],
            "stability_score": 88
        },
        "spending": {
            "year": { "total_spent": current_year.get("total_spent", 0) },
            "month": { 
                "total_spent": current_month.get("total_spent", 0),
                "savings_rate": insights["summary"]["savings_rate"],
                "savings": insights["summary"]["net_flow"]
            },
            "week": { "total_spent": current_week.get("total_spent", 0) }
        }
    }

@router.get("/spending-trend/{user_id}")
async def spending_trend(user_id: str, view: str = "monthly"):
    txns = _load_transactions()
    
    # For trend, we return a list of dates and amounts
    # If view is monthly, we return monthly totals
    # If view is daily, we return daily totals
    
    if view == "monthly":
        data = get_monthly_spending(txns)
        return {
            "status": "success",
            "data": [{"date": m["month"] + "-01", "amount": m["total_spent"]} for m in data[::-1]]
        }
    else:
        # Daily view for the last 30 days
        now = datetime.now(_IST)
        data = []
        for i in range(30):
            d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            daily = get_daily_spending(txns, d)
            data.append({"date": d, "amount": daily["total_spent"]})
        return {
            "status": "success",
            "data": data[::-1]
        }

@router.get("/alerts/{user_id}")
async def dashboard_alerts(user_id: str):
    txns = _load_transactions()
    insights = generate_insights(txns)
    
    # Map insights and anomalies to alerts
    alerts = []
    for i in insights["insights"]:
        alerts.append({
            "type": "warning" if "🔴" in i or "🟡" in i else "info",
            "title": "Spending Alert",
            "message": i
        })
    
    for a in insights["anomalies"]["outliers"]:
        alerts.append({
            "type": "danger",
            "title": "Large Transaction",
            "message": f"Unusual ₹{a['amount']:,} on {a['date']}: {a['narration']}"
        })
        
    return {"alerts": alerts[:5]}

@router.get("/daily-list/{user_id}")
async def daily_list(user_id: str, month: str = Query(None)):
    """
    Returns daily spending for a whole month to be used in a calendar view.
    """
    try:
        logger.info(f"Daily-list request: user={user_id}, month_param={month}")
        txns = _load_transactions()
        logger.info(f"Loaded {len(txns)} transactions for daily-list")
        
        if not month:
            month = datetime.now(_IST).strftime("%Y-%m")
            
        logger.info(f"Target month: {month}")
            
        parts = month.split("-")
        if len(parts) != 2:
            logger.error(f"Invalid month format: {month}")
            return {"status": "error", "message": f"Invalid month format '{month}'. Use YYYY-MM."}
            
        try:
            year, mon = map(int, parts)
        except ValueError:
            logger.error(f"Non-integer parts in month: {parts}")
            return {"status": "error", "message": "Month parts must be integers."}

        import calendar
        _, last_day = calendar.monthrange(year, mon)
        logger.info(f"Month range for {year}-{mon}: 1 to {last_day}")
        
        days = []
        for d in range(1, last_day + 1):
            date_str = f"{year}-{mon:02d}-{d:02d}"
            try:
                daily = get_daily_spending(txns, date_str)
                days.append({
                    "date": date_str,
                    "amount": daily["total_spent"],
                    "top_category": daily.get("top_category")
                })
            except Exception as inner_e:
                logger.error(f"Failed to get daily spend for {date_str}: {str(inner_e)}")
                # Continue with 0 if one day fails
                days.append({"date": date_str, "amount": 0, "top_category": None})
            
        logger.info(f"Returning {len(days)} days for {month}")
        return {"status": "success", "month": month, "days": days}
    except Exception as e:
        logger.error(f"Critical error in daily_list: {str(e)}", exc_info=True)
        return {"status": "error", "message": f"Server error: {str(e)}"}
