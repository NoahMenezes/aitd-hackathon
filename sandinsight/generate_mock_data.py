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

def pick_time(d: date, slot: str | None = None, narration: str = "") -> datetime:
    """
    Human-realistic timestamp generation.

    Real people don't transact uniformly — they cluster around:
      - 8:30-9:30  (morning commute / coffee)
      - 13:00-14:00 (lunch break)
      - 19:30-21:30 (dinner / evening shopping)
      - 23:00-00:30 (late-night Swiggy / Netflix)

    Weekend users wake up ~1-2h later and spend more in evenings.
    Seconds and sub-second offsets are randomised to feel organic.
    Slot hint overrides the default behaviour (used for life events).
    """
    is_weekend = d.weekday() >= 5
    # Weekend: +90 min offset on all morning peaks
    weekend_offset_min = 90 if is_weekend else 0

    # ── Merchant-aware slot override ─────────────────────────────────────────
    narr_up = narration.upper()
    if slot is None:
        if any(k in narr_up for k in ("STARBUCKS", "CHAAYOS", "TIFFIN", "BREAKFAST", "COFFEE")):
            slot = "morning_coffee"
        elif any(k in narr_up for k in ("ZOMATO", "SWIGGY", "DOMINOS", "PIZZA", "LUNCH")):
            slot = "meal" if not is_weekend else "late_meal"
        elif any(k in narr_up for k in ("UBER", "OLA", "RAPIDO", "METRO", "IRCTC")):
            slot = "commute"
        elif any(k in narr_up for k in ("NETFLIX", "SPOTIFY", "HOTSTAR", "BOOKMYSHOW")):
            slot = "evening_leisure"
        elif any(k in narr_up for k in ("ATM", "CASH WDL")):
            slot = "business_hours"
        elif any(k in narr_up for k in ("SALARY", "NEFT CR", "SAL/")):
            slot = "office_open"
        elif any(k in narr_up for k in ("AMAZON", "FLIPKART", "MYNTRA")):
            slot = "shopping_browse"

    # ── Gaussian peak clusters (mean_hour, std_minutes) ──────────────────────
    # Each slot has a list of (peak_hour, std_mins, weight) peaks
    # We pick one peak probabilistically, then sample from its Gaussian.
    PEAKS: dict[str, list[tuple[float, float, int]]] = {
        "morning_coffee":   [(8.5,  25, 5),  (9.2,  20, 3)],
        "meal":             [(13.0, 35, 6),  (20.0, 40, 4),  (12.0, 20, 2)],
        "late_meal":        [(13.5, 45, 4),  (20.5, 50, 6),  (14.0, 30, 2)],
        "commute":          [(8.8,  30, 5),  (18.5, 35, 5),  (9.5,  25, 2)],
        "evening_leisure":  [(21.0, 45, 6),  (22.0, 40, 3),  (20.0, 30, 2)],
        "business_hours":   [(11.0, 60, 4),  (15.0, 60, 4),  (10.0, 40, 2)],
        "office_open":      [(9.0,  20, 8),  (10.0, 30, 3)],
        "shopping_browse":  [(13.5, 60, 3),  (21.5, 60, 5),  (16.0, 45, 3)],
        # Explicit slot hints (from life events)
        "morning":          [(9.0,  40, 6),  (10.0, 30, 3)],
        "lunch":            [(13.0, 30, 8),  (12.5, 20, 2)],
        "afternoon":        [(15.5, 60, 6),  (16.5, 45, 2)],
        "evening":          [(19.0, 45, 5),  (20.0, 40, 4)],
        "night":            [(21.0, 50, 5),  (22.0, 40, 3),  (23.0, 30, 1)],
        "late_night":       [(23.5, 30, 5),  (0.5,  25, 3)],
        "early_morning":    [(7.0,  30, 6),  (7.5,  20, 3)],
    }

    peaks = PEAKS.get(slot or "", [(14.0, 90, 1)])  # broad afternoon default

    # Pick a peak probabilistically
    weights = [p[2] for p in peaks]
    peak_h, std_m, _ = random.choices(peaks, weights=weights, k=1)[0]

    # Weekend sleep-in on morning slots
    if is_weekend and slot in ("morning_coffee", "morning", "commute", "office_open"):
        peak_h += weekend_offset_min / 60

    # Sample from Gaussian (minutes from midnight)
    mean_mins = peak_h * 60
    std_mins  = std_m
    total_mins = -1
    for _ in range(20):   # rejection sample to stay in [0, 1439]
        total_mins = int(random.gauss(mean_mins, std_mins))
        if 0 <= total_mins <= 1439:
            break
    total_mins = max(0, min(1439, total_mins))

    hour   = total_mins // 60
    minute = total_mins % 60
    # Organic seconds: people tap at :00-:05 less often, more at :10-:50
    second = int(random.gauss(30, 15))
    second = max(1, min(58, second))
    # Milliseconds: real UPI logs have actual ms
    ms = random.randint(0, 999)

    return datetime(d.year, d.month, d.day, hour, minute, second,
                    microsecond=ms * 1000, tzinfo=IST)


def fmt_ts(dt: datetime) -> str:
    ms = dt.microsecond // 1000
    return dt.strftime(f"%Y-%m-%dT%H:%M:%S.{ms:03d}+05:30")

def fmt_bal(b: float) -> str:
    return f"{b:.2f}"

def pick_merchant(pool):
    weights = [m[4] for m in pool]
    return random.choices(pool, weights=weights, k=1)[0]

# ─────────────────────────────────────────────────────────────────────────────
# EDGE CASE INJECTION
# Produces one of each scenario the classifier must handle correctly.
# Each scenario is labelled so it is easy to trace in test output.
# ─────────────────────────────────────────────────────────────────────────────

def _mk(idx, d, narr, mode, amount, balance, ttype="DEBIT", hour=14, minute=0):
    """Build a single raw ReBIT transaction dict."""
    dt = datetime(d.year, d.month, d.day, hour, minute, random.randint(0, 59), tzinfo=IST)
    if ttype == "DEBIT":
        balance -= amount
    else:
        balance += amount
    return {
        "txnId":                f"EDGE{d.strftime('%Y%m%d')}{idx:03d}",
        "type":                 ttype,
        "mode":                 mode,
        "amount":               fmt_bal(amount),
        "currentBalance":       fmt_bal(balance),
        "transactionTimestamp": fmt_ts(dt),
        "valueDate":            d.isoformat(),
        "narration":            narr,
        "reference":            rref(),
    }, balance


def _inject_edge_cases(txns: list[dict], balance: float) -> list[dict]:
    """
    Injects targeted edge-case transactions into the transaction list.

    Scenarios covered:
      EC-01  Exact duplicate (same txnId — dedup must remove)
      EC-02  Near-duplicate (same narr+amount within 30s — heuristic dedup)
      EC-03  Split transaction (3 small Zomato orders within 90 min)
      EC-04  Noisy / unreadable narration (fallback → Unknown)
      EC-05  Midnight edge (23:58 → classified on correct date)
      EC-06  ATM withdrawal (must be Cash Withdrawal, not Shopping)
      EC-07  Refund credit (must be Refund, not Income)
      EC-08  Large one-time outlier (z-score spike, Sony camera)
      EC-09  Recurring subscription (3rd Netflix = should be tagged recurring)
      EC-10  Ambiguous narration (HDFC TRANSFER — time-based fallback)
      EC-11  Weekend late-night food order (tagged weekend + night + food)
      EC-12  Salary-like large credit (monthly, NEFT)
    """
    extras: list[dict] = []
    bal = balance

    # EC-01: Exact duplicate — same txnId as an existing transaction
    if txns:
        original = txns[0].copy()
        original["txnId"] = txns[0]["txnId"]  # deliberate collision
        original["transactionTimestamp"] = "2026-03-05T11:30:00.000+05:30"
        extras.append(original)
        print("  [EC-01] Exact duplicate injected")

    # EC-02: Near-duplicate — same narration + amount, 25 seconds apart
    d = date(2026, 3, 8)
    t1, bal = _mk(901, d, "UPI-ZOMATO INTERNET PVT-zomato@okaxis",
                  "UPI", 349.00, bal, hour=13, minute=10)
    t2 = t1.copy()
    t2["txnId"] = "EDGE202603080902"
    t2["transactionTimestamp"] = "2026-03-08T13:10:25.000+05:30"  # 25s later
    extras += [t1, t2]
    print("  [EC-02] Near-duplicate injected (25s gap, same amount+narration)")

    # EC-03: Split transaction — 3 small Zomato orders within 90 min
    d = date(2026, 3, 12)
    for i, (h, m, amt) in enumerate([(12, 5, 180), (12, 45, 220), (13, 20, 150)], start=910):
        t, bal = _mk(i, d, "UPI-ZOMATO INTERNET PVT-zomato@okaxis",
                     "UPI", amt, bal, hour=h, minute=m)
        extras.append(t)
    print("  [EC-03] Split transaction injected (3x Zomato in 75 min)")

    # EC-04: Noisy narration — should fall to Unknown / fallback
    d = date(2026, 3, 15)
    t, bal = _mk(920, d, "IMPS/4839201847/TRF/REF8827364/NA",
                 "UPI", 500.00, bal, hour=16, minute=22)
    extras.append(t)
    print("  [EC-04] Noisy narration injected (fallback expected)")

    # EC-05: Midnight edge — 23:58 on Mar 19 (must be dated Mar 19, not Mar 20)
    d = date(2026, 3, 19)
    t, bal = _mk(930, d, "UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",
                 "UPI", 310.00, bal, hour=23, minute=58)
    extras.append(t)
    print("  [EC-05] Midnight edge injected (23:58, Food expected)")

    # EC-06: ATM withdrawal — must NOT be classified as Shopping
    d = date(2026, 3, 22)
    t, bal = _mk(940, d, "ATM WDL-HDFC BANK ATM-ANDHERI WEST MUMBAI",
                 "ATM", 3000.00, bal, hour=10, minute=15)
    extras.append(t)
    print("  [EC-06] ATM withdrawal injected (Cash Withdrawal expected)")

    # EC-07: Refund credit — NOT salary, NOT income
    d = date(2026, 3, 24)
    t, bal = _mk(950, d, "UPI CR-AMAZON SELLER SERVICES-amazon@okaxis-REFUND/ORD#3849201",
                 "UPI", 1299.00, bal, ttype="CREDIT", hour=11, minute=5)
    extras.append(t)
    print("  [EC-07] Refund credit injected (Refund/Cashback expected)")

    # EC-08: Large outlier — Rs. 89,000 DSLR camera (z-score >> threshold)
    d = date(2026, 2, 10)
    t, bal = _mk(960, d,
                 "NEFT DR-ICIC0000001-CANON INDIA PVT LTD-INV/CAMERA/EOS90D/FEB2026",
                 "NETBANKING", 89000.00, bal, hour=15, minute=30)
    extras.append(t)
    print("  [EC-08] Large outlier injected (Rs.89,000 camera — outlier expected)")

    # EC-09: Third Netflix charge — should be tagged 'recurring'
    for d_val, h in [(date(2026, 1, 18), 9), (date(2026, 2, 18), 9), (date(2026, 3, 18), 9)]:
        t, bal = _mk(970, d_val, "UPI-NETFLIX INDIA-netflix@okaxis",
                     "UPI", 649.00, bal, hour=h, minute=0)
        t["txnId"] = f"EDGE_NFLX_{d_val.strftime('%Y%m%d')}"
        extras.append(t)
    print("  [EC-09] Recurring Netflix (3x monthly) injected")

    # EC-10: Ambiguous narration — generic HDFC transfer, time-based inference
    d = date(2026, 4, 2)
    t, bal = _mk(980, d, "IMPS/HDFC0001234/TRANSFER/MISC/PERSONAL",
                 "NETBANKING", 2000.00, bal, hour=20, minute=30)
    extras.append(t)
    print("  [EC-10] Ambiguous IMPS transfer injected (time-inference expected)")

    # EC-11: Weekend late-night Swiggy (Sat 11:45 PM)
    d = date(2026, 4, 4)   # Saturday
    t, bal = _mk(990, d, "UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",
                 "UPI", 425.00, bal, hour=23, minute=45)
    extras.append(t)
    print("  [EC-11] Weekend late-night food injected (weekend+night+food tags expected)")

    # EC-12: Extra salary-like credit for March (already have one; this tests multi-month)
    d = date(2026, 4, 30)
    t, bal = _mk(999, d,
                 "NEFT CR-SBIN0001234-TECHCORP SOLUTIONS LTD-SAL/APR2026/EMP00472",
                 "NETBANKING", SALARY, bal, ttype="CREDIT", hour=9, minute=0)
    extras.append(t)
    print("  [EC-12] April salary credit injected")

    print(f"  Total edge-case txns injected: {len(extras)}")
    return txns + extras


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

                dt = pick_time(day, slot, narr)
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

        # Pick merchant-aware times for each random transaction today
        times = sorted([
            pick_time(day, narration=pick_merchant(pool)[0]) for _ in range(n)
        ])

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

    # Inject edge cases then re-sort whole list by timestamp
    txns = _inject_edge_cases(txns, balance)
    txns.sort(key=lambda t: t["transactionTimestamp"])

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
        def _label(narr):
            parts = narr.split("-")
            return parts[1].split()[0] if len(parts) >= 2 else narr[:12]
        labels = [_label(e[0]) for e in LIFE_EVENTS[d]]
        print(f"  {d}  {', '.join(labels)}")
