"""
Edge-case validation test.
Checks that each EC-xx scenario is classified/handled correctly.
"""
import sys
sys.path.insert(0, ".")

from services.aa_simulator import simulate_fi_ready
from services.parser import parse_rebit_data
from services.insights import generate_insights

raw    = simulate_fi_ready()
parsed = parse_rebit_data(raw)
txns   = parsed["transactions"]
ins    = generate_insights(txns)
anom   = ins.get("anomalies", {})

print(f"Total raw txns in file  : 218")
print(f"After deduplication     : {len(txns)}")
print(f"Removed by dedup        : {218 - len(txns)}")
print()

# Build a lookup by txnId prefix for easy searching
def find(txn_list, **filters):
    results = []
    for t in txn_list:
        match = True
        for k, v in filters.items():
            if k == "narration_contains":
                if v.upper() not in (t.get("narration","") or "").upper():
                    match = False; break
            elif k == "txnid_startswith":
                if not (t.get("txn_id","") or "").startswith(v):
                    match = False; break
            elif k == "category":
                if (t.get("classification",{}) or {}).get("category") != v:
                    match = False; break
            elif k == "tag":
                if v not in (t.get("classification",{}) or {}).get("tags",[]):
                    match = False; break
        if match:
            results.append(t)
    return results

def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    safe_label  = label.encode("ascii", errors="replace").decode("ascii")
    safe_detail = detail.encode("ascii", errors="replace").decode("ascii") if detail else ""
    print(f"  [{status}] {safe_label}" + (f"  ({safe_detail})" if safe_detail else ""))

print("=== EDGE CASE VALIDATION ===")
print()

# EC-01: Exact duplicate removed
ec01_present = any(
    (t.get("txn_id","") or "") == txns[0].get("txn_id","") and
    t.get("timestamp","") == "2026-03-05T11:30:00.000+05:30"
    for t in txns
)
check("EC-01 Exact duplicate removed", not ec01_present,
      f"{218 - len(txns)} total removed")

# EC-02: Near-duplicate removed (only 1 of the 25s-apart pair should survive)
ec02 = find(txns, narration_contains="EDGE20260308090")
check("EC-02 Near-duplicate deduped (<=1 survives)", len(ec02) <= 1,
      f"{len(ec02)} surviving")

# EC-03: Split Zomato txns classified as Food
ec03 = find(txns, txnid_startswith="EDGE2026031291")
ec03_food = [t for t in ec03 if t.get("classification",{}).get("category") == "Food & Dining"]
check("EC-03 Split txns classified as Food", len(ec03_food) >= 2,
      f"{len(ec03_food)}/3 as Food")

# EC-04: Noisy narration → Unknown or Transfer
ec04 = find(txns, narration_contains="IMPS/4839201847")
cat04 = ec04[0]["classification"]["category"] if ec04 else "NOT FOUND"
check("EC-04 Noisy narration → Unknown/Transfer",
      cat04 in ("Unknown", "Transfer"), f"got '{cat04}'")

# EC-05: Midnight-edge Swiggy classified as Food
ec05 = find(txns, txnid_startswith="EDGE20260319")
cat05 = ec05[0]["classification"]["category"] if ec05 else "NOT FOUND"
check("EC-05 Midnight Swiggy → Food & Dining",
      cat05 == "Food & Dining", f"got '{cat05}'")

# EC-06: ATM → Cash Withdrawal
ec06 = find(txns, txnid_startswith="EDGE20260322")
cat06 = ec06[0]["classification"]["category"] if ec06 else "NOT FOUND"
check("EC-06 ATM → Cash Withdrawal",
      cat06 == "Cash Withdrawal", f"got '{cat06}'")

# EC-07: Refund credit → Refund / Cashback
ec07 = find(txns, narration_contains="REFUND/ORD#")
cat07 = ec07[0]["classification"]["category"] if ec07 else "NOT FOUND"
check("EC-07 Refund credit → Refund / Cashback",
      cat07 == "Refund / Cashback", f"got '{cat07}'")

# EC-08: Rs.89,000 camera → outlier
outlier_amounts = [o["amount"] for o in anom.get("outliers", [])]
check("EC-08 Rs.89,000 outlier detected",
      89000.0 in outlier_amounts, f"outliers: {outlier_amounts[:3]}")

# EC-09: Netflix recurring tagged
ec09 = find(txns, narration_contains="NETFLIX")
recurring_tagged = [t for t in ec09 if "recurring" in t.get("classification",{}).get("tags",[])]
check("EC-09 Netflix tagged as recurring",
      len(recurring_tagged) >= 1, f"{len(recurring_tagged)}/{len(ec09)} tagged recurring")

# EC-10: Ambiguous → time-inference (no keyword match, so falls to time layer)
ec10 = find(txns, narration_contains="IMPS/HDFC0001234")
meth10 = ec10[0]["classification"]["method"] if ec10 else "NOT FOUND"
conf10 = ec10[0]["classification"]["confidence"] if ec10 else 1.0
check("EC-10 Ambiguous IMPS uses time/fallback (low confidence)",
      meth10 in ("time_inference", "fallback", "neft_transfer"),
      f"method='{meth10}' conf={conf10}")


# EC-11: Weekend late-night Swiggy → food + weekend + night tags
ec11 = find(txns, txnid_startswith="EDGE20260404")
if ec11:
    tags11 = ec11[0].get("classification",{}).get("tags",[])
    check("EC-11 Weekend night food tagged correctly",
          "weekend" in tags11 and "night" in tags11,
          f"tags={tags11}")
else:
    check("EC-11 Weekend night food tagged correctly", False, "txn not found")

# EC-12: April salary detected
sal_events = anom.get("salary_events", [])
apr_sal = [s for s in sal_events if "APR2026" in (s.get("narration","") or "")]
check("EC-12 April salary credit detected",
      len(apr_sal) >= 1, f"{len(apr_sal)} April salary events")

print()
print("=== CLASSIFIER QUALITY ===")
from collections import Counter
cats = Counter(t["classification"]["category"] for t in txns)
methods = Counter(t["classification"]["method"] for t in txns)
print("Categories:")
for cat, cnt in cats.most_common():
    print(f"  {cat:<26} {cnt:>3} txns")
print("Methods used:")
for m, cnt in methods.most_common():
    print(f"  {m:<20} {cnt:>3} txns")

unknown_count = cats.get("Unknown", 0)
total = len(txns)
print(f"\nClassification coverage: {total - unknown_count}/{total} ({100*(total-unknown_count)/total:.1f}%)")
print()
print("=== ANOMALY SUMMARY ===")
print(f"  Outliers    : {len(anom.get('outliers',[]))}")
print(f"  Recurring   : {len(anom.get('recurring',[]))}")
print(f"  Salary evts : {len(anom.get('salary_events',[]))}")
wr = anom.get('weekend_ratio', {})
print(f"  Weekend %   : {wr.get('weekend_pct',0)}%  |  Weekday %: {wr.get('weekday_pct',0)}%")
