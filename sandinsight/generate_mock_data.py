"""
SandInsight - Realistic Human-Like Mock Data Generator

Models a real person's financial life across Jan–Apr 2026:
- Life events (birthday, trip, medical emergency, festival)
- Work expenses (client dinners, office supplies, travel)
- Prize / reward credits (cashback, contest win, referral)
- Realistic daily gaps (some days zero activity)
- Time-of-day patterns (morning coffee, late-night food)
- Weekend spikes, payday behavior, month-end tightening

Run:  python generate_mock_data.py
"""

import json
import random
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

IST = timezone(timedelta(hours=5, minutes=30))
OUTPUT_FILE = Path(__file__).parent / "data" / "mock_bank.json"

# ─────────────────────────────────────────────────────────────────────────────
# PERSON PROFILE
# ─────────────────────────────────────────────────────────────────────────────
PROFILE = {
    "name":    "Nikhil Sharma",
    "dob":     "1998-06-15",
    "mobile":  "9876543210",
    "email":   "nikhil.sharma@example.com",
    "pan":     "ABCDE1234F",
    "city":    "Mumbai",
}
STARTING_BALANCE = 45_320.00
SALARY           = 62_000.00

# ─────────────────────────────────────────────────────────────────────────────
# LIFE EVENTS  (date, label, transactions_to_inject)
# Each entry is (date, [(narration, mode, amount_min, amount_max, txn_type)])
# ─────────────────────────────────────────────────────────────────────────────
LIFE_EVENTS = {
    # Jan 1 – New Year celebration
    date(2026, 1, 1): [
        ("UPI-BANDRA SOCIAL HOSPITALITY-bandrasocial@okaxis",    "UPI",   800,  800, "DEBIT"),
        ("UPI-UBER INDIA SYSTEMS PVT-uber@hdfcbank",              "UPI",   320,  320, "DEBIT"),
        ("UPI-ZOMATO INTERNET PVT-zomato@okaxis",                 "UPI",   650,  650, "DEBIT"),
    ],
    # Jan 14 - Makar Sankranti / kite festival supplies
    date(2026, 1, 14): [
        ("UPI-SHOPKART RETAIL-shopkart@ybl",                      "UPI",   180,  180, "DEBIT"),
        ("UPI-BIGBASKET INNOVATIVE RETAIL-bigbasket@okicici",     "UPI",   450,  450, "DEBIT"),
    ],
    # Jan 20 - Client dinner (work expense)
    date(2026, 1, 20): [
        ("POS-TRIDENT HOTELS LTD-NARIMAN POINT MUMBAI",           "CARD", 3800, 3800, "DEBIT"),
    ],
    # Jan 26 - Republic Day outing
    date(2026, 1, 26): [
        ("POS-PVR CINEMAS LTD-ANDHERI WEST MUMBAI",               "CARD",  520,  520, "DEBIT"),
        ("UPI-HARDCASTLE RESTAURANTS-mcdonalds@okaxis",           "UPI",   310,  310, "DEBIT"),
    ],
    # Jan 31 - Salary
    date(2026, 1, 31): [
        ("NEFT CR-SBIN0001234-TECHCORP SOLUTIONS LTD-SAL/JAN2026/EMP00472", "NETBANKING", SALARY, SALARY, "CREDIT"),
    ],

    # Feb 4 - Work: office supplies reimbursement
    date(2026, 2, 4): [
        ("NEFT CR-HDFC0002345-TECHCORP SOLUTIONS LTD-REIMB/OFFICE/FEB2026", "NETBANKING", 2200, 2200, "CREDIT"),
        ("UPI-STAPLES INDIA PVT LTD-staples@okhdfc",              "UPI",  1200, 1200, "DEBIT"),
    ],
    # Feb 7 - Medical: doctor visit
    date(2026, 2, 7): [
        ("UPI-APOLLO HOSPITALS ENTERPRISE-apollo@okaxis",         "UPI",   700,  700, "DEBIT"),
        ("UPI-MEDPLUS HEALTH SERVICES-medplus@ybl",               "UPI",   430,  430, "DEBIT"),
    ],
    # Feb 14 - Valentine's Day
    date(2026, 2, 14): [
        ("UPI-FERNS N PETALS PVT LTD-fnp@okicici",               "UPI",   890,  890, "DEBIT"),
        ("POS-TRUFFLES RESTAURANTS PVT-BANDRA MUMBAI",            "CARD", 2200, 2200, "DEBIT"),
        ("UPI-BIGTREE ENTERTAINMENT-bookmyshow@okaxis",           "UPI",   620,  620, "DEBIT"),
    ],
    # Feb 15 - Prize: hackathon winner credit
    date(2026, 2, 15): [
        ("NEFT CR-ICIC0003456-DEVFOLIO TECHNOLOGIES-HACKATHON PRIZE FEB2026", "NETBANKING", 5000, 5000, "CREDIT"),
    ],
    # Feb 22 - Friend's birthday trip: Lonavala
    date(2026, 2, 22): [
        ("NEFT DR-AXIS0004567-MAKEMYTRIP INDIA PVT-HOTEL/LNV/220226",       "NETBANKING", 3200, 3200, "DEBIT"),
        ("UPI-IRCTC LTD-irctc@okicici",                          "UPI",   340,  340, "DEBIT"),
        ("UPI-MAGGI DHABA LONAVALA-maggidhaba@ybl",               "UPI",   480,  480, "DEBIT"),
    ],
    date(2026, 2, 23): [
        ("POS-DELLA ADVENTURE PARK-LONAVALA PUNE",                "CARD", 1800, 1800, "DEBIT"),
        ("UPI-CAFE SUNRISE LONAVALA-cafesunrise@paytm",           "UPI",   260,  260, "DEBIT"),
        ("UPI-UBER INDIA SYSTEMS PVT-uber@hdfcbank",              "UPI",   720,  720, "DEBIT"),
    ],
    # Feb 28 - Salary
    date(2026, 2, 28): [
        ("NEFT CR-SBIN0001234-TECHCORP SOLUTIONS LTD-SAL/FEB2026/EMP00472", "NETBANKING", SALARY, SALARY, "CREDIT"),
    ],

    # Mar 3 - Quarterly gym membership
    date(2026, 3, 3): [
        ("UPI-CURE FIT HEALTHCARE PVT-cultfit@okaxis",            "UPI",  3600, 3600, "DEBIT"),
    ],
    # Mar 10 - Referral bonus from Groww
    date(2026, 3, 10): [
        ("UPI CR-NEXTBILLION TECHNOLOGY-groww@okicici-REFERRAL BONUS MAR2026", "UPI", 500, 500, "CREDIT"),
    ],
    # Mar 17 - Holi celebration
    date(2026, 3, 17): [
        ("UPI-AVENUE SUPERMARTS LTD-dmart@okhdfc",               "UPI",   890,  890, "DEBIT"),
        ("UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",              "UPI",   750,  750, "DEBIT"),
        ("POS-SMAAASH ENTERTAINMENT PVT-LOWER PAREL MUMBAI",     "CARD",  980,  980, "DEBIT"),
    ],
    # Mar 20 - Work: conference registration
    date(2026, 3, 20): [
        ("NEFT DR-HDFC0002345-NASSCOM FOUNDATION-TECHCONF2026/REG", "NETBANKING", 2500, 2500, "DEBIT"),
    ],
    # Mar 25 - Emergency car repair
    date(2026, 3, 25): [
        ("POS-CARNATION AUTO INDIA PVT-ANDHERI MUMBAI",          "CARD", 4800, 4800, "DEBIT"),
    ],
    # Mar 31 - Salary + annual bonus
    date(2026, 3, 31): [
        ("NEFT CR-SBIN0001234-TECHCORP SOLUTIONS LTD-SAL/MAR2026/EMP00472", "NETBANKING", SALARY, SALARY, "CREDIT"),
        ("NEFT CR-SBIN0001234-TECHCORP SOLUTIONS LTD-BONUS/Q4FY26/EMP00472", "NETBANKING", 18000, 18000, "CREDIT"),
    ],

    # Apr 4 - Gudi Padwa: SIP investment
    date(2026, 4, 4): [
        ("UPI DR-NEXTBILLION TECHNOLOGY-groww@okicici-SIP/NIFTY50/APR2026", "NETBANKING", 5000, 5000, "DEBIT"),
    ],
    # Apr 6 - Life insurance premium
    date(2026, 4, 6): [
        ("NEFT DR-SBIN0005678-LIC OF INDIA-PREMIUM/POL887234/APR2026",       "NETBANKING", 8200, 8200, "DEBIT"),
    ],
    # Apr 10 - HDFC credit card cashback
    date(2026, 4, 10): [
        ("NEFT CR-HDFC0000001-HDFC BANK LTD-CASHBACK/CCMAR2026/9923",        "NETBANKING", 1240, 1240, "CREDIT"),
    ],
    # Apr 13 - Rent
    date(2026, 4, 13): [
        ("NEFT DR-SBIN0005678-MR RAMESH SHAH-RENT/APR2026/FLAT4B",           "NETBANKING", 15000, 15000, "DEBIT"),
    ],
    # Apr 14 - Book purchase
    date(2026, 4, 14): [
        ("UPI-AMAZON SELLER SERVICES PVT-amazon@okaxis",         "UPI",   650,  650, "DEBIT"),
    ],
    # Apr 18 - Work client lunch + cab
    date(2026, 4, 18): [
        ("POS-BAYROUTE RESTAURANTS PVT-JUHU MUMBAI",             "CARD", 3200, 3200, "DEBIT"),
        ("UPI-ANI TECHNOLOGIES PVT-ola@okaxis",                  "UPI",   480,  480, "DEBIT"),
    ],
    # Apr 22 - Friend's wedding gift
    date(2026, 4, 22): [
        ("POS-TITAN COMPANY LTD TANISHQ-BANDRA MUMBAI",          "CARD", 4500, 4500, "DEBIT"),
        ("UPI-UBER INDIA SYSTEMS PVT-uber@hdfcbank",             "UPI",   350,  350, "DEBIT"),
    ],
    # Apr 27 - Impulse: Sony headphones
    date(2026, 4, 27): [
        ("UPI-AMAZON SELLER SERVICES PVT-amazon@okaxis",         "UPI", 26900, 26900, "DEBIT"),
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# EVERYDAY MERCHANT POOL
# (narration_template, mode, min, max, weight)
# ─────────────────────────────────────────────────────────────────────────────
EVERYDAY = [
    # Morning habits
    ("UPI-STARBUCKS COFFEE INDIA-starbucks@okaxis",           "UPI",   180, 420,  4),
    ("UPI-CHAAYOS BEVERAGES PVT-chaayos@ybl",                 "UPI",    80, 180,  3),
    ("UPI-THEOBROMA FOODS PVT-theobroma@okicici",             "UPI",   120, 320,  2),
    ("UPI-TIFFIN EXPRESS MUMBAI-tiffinexp@paytm",             "UPI",    60, 150,  5),
    # Food delivery
    ("UPI-ZOMATO INTERNET PVT-zomato@okaxis",                 "UPI",   120, 680, 12),
    ("UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",               "UPI",   100, 580, 11),
    ("UPI-BUNDL TECHNOLOGIES PVT-swiggyinstamart@icici",      "UPI",   150, 500,  4),
    # Grocery
    ("UPI-SUPERMARKET GROCERY SUPPLIES-bigbasket@okicici",    "UPI",   400,1800,  5),
    ("UPI-GROFERS INDIA PVT LTD-blinkit@okhdfc",              "UPI",   150, 700,  5),
    ("UPI-KIRANAKART TECHNOLOGIES-zepto@okicici",             "UPI",   100, 550,  3),
    ("POS-AVENUE SUPERMARTS DMART-ANDHERI MUMBAI",            "CARD",  600,2500,  2),
    # Transport
    ("UPI-ANI TECHNOLOGIES PVT-ola@okaxis",                   "UPI",    80, 450,  7),
    ("UPI-UBER INDIA SYSTEMS PVT-uber@hdfcbank",              "UPI",    90, 520,  7),
    ("UPI-ROPPEN TRANSPORTATION-rapido@okicici",              "UPI",    40, 160,  5),
    ("UPI-MMRDA METRO RAIL CORP-mmrda@okaxis",                "UPI",    30,  60,  6),
    # Shopping
    ("UPI-AMAZON SELLER SERVICES-amazon@okaxis",              "UPI",   299,3999,  6),
    ("UPI-FLIPKART INTERNET PVT-flipkart@okaxis",             "UPI",   399,2999,  4),
    ("UPI-MYNTRA DESIGNS PVT LTD-myntra@okicici",             "UPI",   499,3000,  3),
    ("POS-ZARA INDIA PVT LTD-LINKING RD BANDRA",             "CARD", 1500,5000,  1),
    ("POS-DECATHLON SPORTS INDIA-MALAD MUMBAI",               "CARD",  500,3500,  1),
    # Entertainment
    ("UPI-NETFLIX INDIA-netflix@okaxis",                      "UPI",   199, 799,  1),
    ("UPI-SPOTIFY INDIA PVT LTD-spotify@okicici",             "UPI",    59, 119,  1),
    ("UPI-BIGTREE ENTERTAINMENT-bookmyshow@okaxis",           "UPI",   220, 680,  2),
    ("POS-PVR CINEMAS LTD-VERSOVA MUMBAI",                    "CARD",  250, 700,  2),
    # Utilities / bills
    ("UPI-RELIANCE JIO INFOCOMM-jio@okaxis",                  "UPI",   239, 599,  1),
    ("UPI-TATA POWER COMPANY LTD-tatapower@okhdfc",           "UPI",   800,2200,  1),
    # Health / pharmacy
    ("UPI-NETMEDS MARKETPLACE PVT-netmeds@okaxis",            "UPI",   120, 800,  2),
    ("UPI-APOLLO PHARMACY PVT LTD-apolloph@ybl",              "UPI",   150, 600,  2),
    # ATM
    ("ATM WDL-HDFC BANK ATM-ANDHERI WEST MUMBAI",            "ATM",   500,5000,  4),
    ("ATM WDL-SBI ATM-BANDRA EAST MUMBAI",                   "ATM",   500,3000,  2),
    # Misc
    ("UPI-HINDUSTAN PETROLEUM CORP-hpcl@okaxis",              "UPI",  1500,3000,  2),
    ("UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",               "UPI",   200, 550,  3),
]

WEEKEND_EXTRA = [
    ("UPI-ZOMATO INTERNET PVT-zomato@okaxis",                 "UPI",   400,1200,  4),
    ("UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",               "UPI",   350,1000,  3),
    ("POS-LIFESTYLE STORES PVT LTD-INFINITI MALL ANDHERI",   "CARD",  800,4500,  2),
    ("UPI-BIGTREE ENTERTAINMENT-bookmyshow@okaxis",           "UPI",   400, 900,  2),
    ("UPI-BANDRA SOCIAL HOSPITALITY-bandrasocial@okaxis",     "UPI",   600,1800,  1),
    ("POS-HAMLEYS INDIA PVT LTD-PHOENIX MALL MUMBAI",        "CARD",  500,2000,  1),
]

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def rref() -> str:
    return str(random.randint(100000, 999999))

def txn_id(idx: int, d: date) -> str:
    return f"TXN{d.strftime('%Y%m%d')}{idx:03d}"

def pick_time(d: date, slot: str | None = None) -> datetime:
    """Pick a realistic time based on slot hint or random slot."""
    slots = {
        "early_morning": (6,  8,  10),
        "morning":       (8,  11, 30),
        "lunch":         (12, 14, 25),
        "afternoon":     (14, 17, 15),
        "evening":       (17, 20, 30),
        "night":         (20, 23, 15),
        "late_night":    (23, 23, 5),
    }
    if slot is None:
        slot = random.choices(list(slots.keys()),
                              weights=[s[2] for s in slots.values()])[0]
    h_min, h_max, _ = slots[slot]
    hour   = random.randint(h_min, h_max)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return datetime(d.year, d.month, d.day, hour, minute, second, tzinfo=IST)

def fmt_ts(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S.000+05:30")

def fmt_bal(b: float) -> str:
    return f"{b:.2f}"

def pick_merchant(pool):
    weights = [m[4] for m in pool]
    return random.choices(pool, weights=weights, k=1)[0]

# ─────────────────────────────────────────────────────────────────────────────
# BUILD
# ─────────────────────────────────────────────────────────────────────────────

def build_transactions() -> list[dict]:
    txns: list[dict] = []
    balance = STARTING_BALANCE
    idx = 1

    start = date(2026, 1, 1)
    end   = date(2026, 4, 29)
    day   = start

    while day <= end:
        is_weekend  = day.weekday() >= 5
        is_post_pay = (day.day <= 3)   # just after salary — loose spending
        is_month_end= (day.day >= 27)  # tightening before salary

        day_txns: list[dict] = []

        # ── Inject life events for this day ──────────────────────────────────
        if day in LIFE_EVENTS:
            for narr, mode, mn, mx, ttype in LIFE_EVENTS[day]:
                amount = round(random.uniform(mn, mx), 2)
                if ttype == "DEBIT":
                    balance -= amount
                else:
                    balance += amount

                # Pick a sensible time slot for the event type
                if "SALARY" in narr or "NEFT" in narr or "CREDIT" in narr or "REIMBURSEMENT" in narr or "BONUS" in narr or "CASHBACK" in narr or "REFERRAL" in narr or "PRIZE" in narr:
                    slot = "morning"
                elif "DINNER" in narr or "PARTY" in narr or "BAR" in narr or "BINGE" in narr:
                    slot = "night"
                elif "BREAKFAST" in narr or "BFAST" in narr:
                    slot = "morning"
                elif "LUNCH" in narr:
                    slot = "lunch"
                else:
                    slot = None

                dt = pick_time(day, slot)
                ref = rref()
                day_txns.append({
                    "txnId":                txn_id(idx, day),
                    "type":                 ttype,
                    "mode":                 mode,
                    "amount":               fmt_bal(amount),
                    "currentBalance":       fmt_bal(balance),
                    "transactionTimestamp": fmt_ts(dt),
                    "valueDate":            day.isoformat(),
                    "narration":            narr.replace("{r}", ref),
                    "reference":            ref,
                })
                idx += 1

        # ── Everyday random transactions ──────────────────────────────────────
        # Decide how many random transactions today:
        # - month-end: spend less
        # - post-payday: spend more
        # - weekend: more socialising
        # - 30% chance of zero activity on a weekday
        if is_month_end:
            weights_n = [45, 40, 12, 3]
        elif is_post_pay:
            weights_n = [5,  30, 40, 25]
        elif is_weekend:
            weights_n = [5,  25, 45, 25]
        else:
            weights_n = [30, 42, 22, 6]

        n = random.choices([0, 1, 2, 3], weights=weights_n)[0]

        pool = EVERYDAY + (WEEKEND_EXTRA if is_weekend else [])

        # Sort times so chronological
        times = sorted([pick_time(day) for _ in range(n)])

        for dt in times:
            narr_tmpl, mode, mn, mx, _ = pick_merchant(pool)
            max_safe = max(mn, min(mx, balance - 1500))
            if max_safe < mn:
                continue
            amount = round(random.uniform(mn, max_safe), 2)
            balance -= amount
            ref = rref()
            day_txns.append({
                "txnId":                txn_id(idx, day),
                "type":                 "DEBIT",
                "mode":                 mode,
                "amount":               fmt_bal(amount),
                "currentBalance":       fmt_bal(balance),
                "transactionTimestamp": fmt_ts(dt),
                "valueDate":            day.isoformat(),
                "narration":            narr_tmpl.replace("{r}", ref),
                "reference":            ref,
            })
            idx += 1

        # Sort all of today's txns by timestamp before adding
        day_txns.sort(key=lambda t: t["transactionTimestamp"])
        txns.extend(day_txns)
        day += timedelta(days=1)

    return txns


def build_document(txns: list[dict]) -> dict:
    final_balance = float(txns[-1]["currentBalance"])
    return {
        "fipID":     "SBIN-FIP",
        "consentId": "3d141d07-76f1-47ad-af4c-a321aee354ee",
        "holder": {
            "name":           PROFILE["name"],
            "phone":          PROFILE["mobile"],
            "email":          PROFILE["email"],
            "pan":            PROFILE["pan"],
            "dob":            PROFILE["dob"],
            "ckycCompliance": True,
        },
        "account": {
            "type":        "SAVINGS",
            "maskedAccNo": "XXXXXX5678",
            "summary": {
                "currentBalance": fmt_bal(final_balance),
                "currency":       "INR",
                "exchgeRate":     "1",
                "openingDate":    "2019-08-10",
            },
            "transactions": {
                "startDate":   "2026-01-01",
                "endDate":     "2026-04-29",
                "transaction": txns,
            }
        }
    }




if __name__ == "__main__":
    print("Generating realistic human-like transactions...")
    txns = build_transactions()
    doc  = build_document(txns)

    OUTPUT_FILE.write_text(
        json.dumps(doc, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

    debit_count  = sum(1 for t in txns if t["type"] == "DEBIT")
    credit_count = sum(1 for t in txns if t["type"] == "CREDIT")
    total_debit  = sum(float(t["amount"]) for t in txns if t["type"] == "DEBIT")
    total_credit = sum(float(t["amount"]) for t in txns if t["type"] == "CREDIT")
    final_bal    = float(txns[-1]["currentBalance"])

    print(f"Done. Written -> {OUTPUT_FILE}")
    print(f"  Total txns  : {len(txns)} ({debit_count} debits, {credit_count} credits)")
    print(f"  Total spent : Rs. {total_debit:,.2f}")
    print(f"  Total in    : Rs. {total_credit:,.2f}")
    print(f"  Ending bal  : Rs. {final_bal:,.2f}")
    print()
    print("Life events included:")
    for d in sorted(LIFE_EVENTS.keys()):
        labels = [e[0].split("/")[1] for e in LIFE_EVENTS[d]]
        print(f"  {d}  {', '.join(labels)}")
