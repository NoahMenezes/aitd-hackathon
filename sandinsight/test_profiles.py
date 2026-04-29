"""Quick profile generation and quality check."""
import sys
sys.path.insert(0, ".")

from collections import Counter
from services.data_generator import generate_profile_data
from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.income_analytics import income_analytics, cashflow_analytics, business_analytics

print("=" * 60)
for user_type in ("salaried", "freelancer", "shopkeeper"):
    print(f"\nGENERATING: {user_type.upper()}")
    r = generate_profile_data(user_type, months=3)
    print(f"  Txns     : {r['txn_count']}")
    print(f"  Balance  : Rs.{r['final_balance']:,.2f}")
    print(f"  Holder   : {r['holder']}")

    raw    = simulate_fi_ready()
    parsed = parse_rebit_data(raw)
    txns   = parsed["transactions"]

    types = Counter(t["type"] for t in txns)
    cats  = Counter(t["classification"]["category"] for t in txns)

    print(f"  CREDIT   : {types.get('CREDIT', 0)}  |  DEBIT: {types.get('DEBIT', 0)}")
    print("  Top categories:")
    for cat, cnt in cats.most_common(6):
        bar = "#" * min(cnt, 30)
        print(f"    {cat:<26} {cnt:>3}  {bar}")

    inc = income_analytics(txns)
    print(f"  Total income      : Rs.{inc['total_income']:>12,.2f}")
    print(f"  Avg/month         : Rs.{inc['avg_monthly_income']:>12,.2f}")
    print(f"  Stability score   : {inc['stability_score']:>3}/100")
    print(f"  Trend             : {inc['income_trend']}")
    print("  Income by category:")
    for cat, amt in inc["income_by_category"].items():
        print(f"    {cat:<26}  Rs.{amt:>10,.2f}")

    cf = cashflow_analytics(txns)
    print("  Monthly cashflow:")
    for row in cf["monthly_cashflow"]:
        net_str = f"+{row['net_flow']:,.0f}" if row["net_flow"] >= 0 else f"{row['net_flow']:,.0f}"
        print(f"    {row['month']}  In: Rs.{row['total_in']:>8,.0f}  Out: Rs.{row['total_out']:>8,.0f}  Net: Rs.{net_str:>10}  Save: {row['savings_rate']:>5.1f}%")

    cdv = cf["cash_vs_digital"]
    print(f"  Cash: {cdv['cash_pct']}%  |  Digital: {cdv['digital_pct']}%")

    if user_type == "shopkeeper":
        biz = business_analytics(txns)
        print(f"  Daily revenue avg : Rs.{biz['avg_txn_value']:>8,.2f} per sale")
        print(f"  Total revenue     : Rs.{biz['total_revenue']:>12,.2f}")
        print(f"  Supplier cost     : Rs.{biz['total_supplier_cost']:>12,.2f}")
        print(f"  Gross margin      : {biz['gross_margin_pct']}%")
        print(f"  Busiest day       : {biz['busiest_day_of_week']}")
        print(f"  Total sales       : {biz['total_sales_count']}")
        peak_hrs = sorted(biz["peak_hours"].items(), key=lambda x: -x[1])[:5]
        print(f"  Peak hours        : {[(f'{h}:00', c) for h,c in peak_hrs]}")

    print("-" * 60)

print("\nALL PROFILES GENERATED SUCCESSFULLY")
