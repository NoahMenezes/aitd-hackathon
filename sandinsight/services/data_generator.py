"""
SandInsight - Multi-Profile Financial Data Generator

Generates ReBIT-compliant mock financial data for three user profiles:

  salaried    Fixed monthly salary, regular personal expenses
  freelancer  Irregular client payments, project-based income
  shopkeeper  High-frequency small sales + supplier debits

Usage:
    from services.data_generator import generate_profile_data
    doc = generate_profile_data("shopkeeper", months=3)
"""
from __future__ import annotations

import json
import random
import uuid
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

IST = timezone(timedelta(hours=5, minutes=30))
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# ── Profile definitions ───────────────────────────────────────────────────────

PROFILES = {
    "salaried": {
        "name":    "Nikhil Sharma",
        "phone":   "9876543210",
        "email":   "nikhil.sharma@techcorp.in",
        "pan":     "ABCDE1234F",
        "dob":     "1998-06-15",
        "fip":     "SBIN-FIP",
        "accNo":   "XXXXXX5678",
        "accType": "SAVINGS",
        "balance": 75_000.0,
        "opening": "2019-08-10",
    },
    "freelancer": {
        "name":    "Priya Menon",
        "phone":   "9812345678",
        "email":   "priya.menon@freelance.dev",
        "pan":     "FGHIJ5678K",
        "dob":     "1995-03-22",
        "fip":     "HDFC-FIP",
        "accNo":   "XXXXXX9012",
        "accType": "SAVINGS",
        "balance": 120_000.0,
        "opening": "2020-04-01",
    },
    "shopkeeper": {
        "name":    "Ramesh Gupta",
        "phone":   "9765432109",
        "email":   "ramesh.gupta@kirana.in",
        "pan":     "LMNOP9012Q",
        "dob":     "1978-11-08",
        "fip":     "PUNB-FIP",
        "accNo":   "XXXXXX3456",
        "accType": "CURRENT",
        "balance": 50_000.0,
        "opening": "2010-06-15",
    },
}

# ── Shared expense pool (all profiles) ───────────────────────────────────────

COMMON_EXPENSES = [
    ("UPI-ZOMATO INTERNET PVT-zomato@okaxis",           "UPI",  120,  680, 10),
    ("UPI-BUNDL TECHNOLOGIES PVT-swiggy@icici",          "UPI",  100,  580,  9),
    ("UPI-UBER INDIA SYSTEMS PVT-uber@hdfcbank",         "UPI",   90,  520,  7),
    ("UPI-ANI TECHNOLOGIES PVT-ola@okaxis",              "UPI",   80,  450,  6),
    ("UPI-SUPERMARKET GROCERY SUPPLIES-bigbasket@okicici","UPI",  400, 1800,  4),
    ("UPI-GROFERS INDIA PVT LTD-blinkit@okhdfc",         "UPI",  150,  700,  4),
    ("UPI-AMAZON SELLER SERVICES-amazon@okaxis",         "UPI",  299, 3999,  5),
    ("UPI-FLIPKART INTERNET PVT-flipkart@okaxis",        "UPI",  399, 2999,  3),
    ("UPI-NETFLIX INDIA-netflix@okaxis",                 "UPI",  199,  799,  1),
    ("UPI-RELIANCE JIO INFOCOMM-jio@okaxis",             "UPI",  239,  599,  1),
    ("UPI-APOLLO PHARMACY PVT LTD-apolloph@ybl",         "UPI",  120,  600,  2),
    ("ATM WDL-HDFC BANK ATM-ANDHERI WEST MUMBAI",        "ATM",  500, 5000,  3),
    ("UPI-STARBUCKS COFFEE INDIA-starbucks@okaxis",      "UPI",  180,  420,  3),
    ("UPI-ROPPEN TRANSPORTATION-rapido@okicici",         "UPI",   40,  160,  4),
    ("UPI-AVENUE SUPERMARTS DMART-dmart@okhdfc",         "CARD", 600, 2500,  2),
]

SHOPKEEPER_EXPENSES = [
    # Supplier / inventory payments (large debits)
    ("NEFT DR-PUNB0001234-METRO CASH CARRY INDIA-INVENTORY/STOCK/WEEKLY",    "NETBANKING", 8000, 25000, 2),
    ("NEFT DR-HDFC0002345-HINDUSTAN UNILEVER LTD-SUPPLIER/MONTHLY/ORDER",    "NETBANKING",15000, 45000, 1),
    ("UPI-WHOLESALE MARKET DELHI-wholesale@okaxis",                           "UPI",        2000,  8000, 3),
    ("NEFT DR-SBIN0001234-PARLE AGRO PVT LTD-STOCK/BEVERAGES/WEEKLY",       "NETBANKING",  5000, 18000, 1),
    ("UPI-PACKAGING SUPPLIES INDIA-packaging@ybl",                            "UPI",         500,  3000, 2),
]

# ── Income generators per profile ─────────────────────────────────────────────

COMPANIES = [
    "TECHCORP SOLUTIONS LTD", "INFOSYS BPO LTD", "WIPRO DIGITAL",
    "HEXAWARE TECHNOLOGIES", "MPHASIS LTD", "COGNIZANT TECH SOLUTIONS",
]
FREELANCE_CLIENTS = [
    "RAJESH KUMAR DESIGNS", "WEBCRAFT STUDIOS PVT", "DIGITAL MONK AGENCY",
    "ACME ANALYTICS PVT", "NEXGEN SOLUTIONS", "BLUEPRINT TECH LLP",
    "STARTUPGURU VENTURES", "PIXEL LABS INDIA",
]
CUSTOMER_IDS = [f"CUST{random.randint(1000,9999)}" for _ in range(50)]
PAYMENT_APPS = ["phonepay", "gpay", "paytm", "bhimupi"]


# ── Timing helpers ────────────────────────────────────────────────────────────

def _pick_time(d: date, peak_hour: float, std_mins: float = 45) -> datetime:
    """Gaussian-clustered realistic timestamp."""
    mean_m = peak_hour * 60
    total  = -1
    for _ in range(20):
        total = int(random.gauss(mean_m, std_mins))
        if 0 <= total <= 1439:
            break
    total  = max(0, min(1439, total))
    hour   = total // 60
    minute = total % 60
    second = max(1, min(58, int(random.gauss(30, 15))))
    ms     = random.randint(0, 999)
    return datetime(d.year, d.month, d.day, hour, minute, second,
                    microsecond=ms * 1000, tzinfo=IST)


def _fmt_ts(dt: datetime) -> str:
    ms = dt.microsecond // 1000
    return dt.strftime(f"%Y-%m-%dT%H:%M:%S.{ms:03d}+05:30")


def _rref() -> str:
    return str(random.randint(100000, 999999))


def _txn(idx, d, narr, mode, amount, balance, ttype="DEBIT", dt=None):
    if dt is None:
        dt = _pick_time(d, 13.0)
    if ttype == "DEBIT":
        balance -= amount
    else:
        balance += amount
    return {
        "txnId":                f"TXN{d.strftime('%Y%m%d')}{idx:04d}",
        "type":                 ttype,
        "mode":                 mode,
        "amount":               f"{amount:.2f}",
        "currentBalance":       f"{balance:.2f}",
        "transactionTimestamp": _fmt_ts(dt),
        "valueDate":            d.isoformat(),
        "narration":            narr,
        "reference":            _rref(),
    }, balance


# ── Per-profile generators ────────────────────────────────────────────────────

def _salaried_transactions(months: int, start: date, balance: float):
    txns = []
    idx  = 1
    company = random.choice(COMPANIES)
    salary  = round(random.uniform(45_000, 95_000), -3)   # round to nearest 1000

    d = start
    end = start + timedelta(days=months * 30)

    while d <= end:
        is_weekend = d.weekday() >= 5
        day_txns   = []

        # Salary credit on last working day of each month
        if d.day in (28, 29, 30, 31):
            # Check it's near month-end and hasn't been paid this month
            already_paid = any(
                t["valueDate"][:7] == d.isoformat()[:7] and
                "SAL/" in t["narration"]
                for t in txns
            )
            if not already_paid:
                narr = f"NEFT CR-SBIN0001234-{company}-SAL/{d.strftime('%b%Y').upper()}/EMP00472"
                dt   = _pick_time(d, 9.0, 20)
                t, balance = _txn(idx, d, narr, "NETBANKING", salary, balance, "CREDIT", dt)
                day_txns.append(t); idx += 1

        # Daily random expenses (1-3 per day)
        n_exp = random.choices([0, 1, 2, 3],
                               weights=[25, 40, 25, 10] if not is_weekend else [10, 30, 35, 25])[0]
        for _ in range(n_exp):
            narr_tmpl, mode, mn, mx, _ = random.choices(
                COMMON_EXPENSES, weights=[e[4] for e in COMMON_EXPENSES])[0]
            amt  = round(random.uniform(mn, min(mx, balance - 2000)), 2)
            if amt < mn:
                continue
            peak = random.choice([8.5, 13.0, 20.5])
            dt   = _pick_time(d, peak, 40)
            t, balance = _txn(idx, d, narr_tmpl, mode, amt, balance, "DEBIT", dt)
            day_txns.append(t); idx += 1

        day_txns.sort(key=lambda x: x["transactionTimestamp"])
        txns.extend(day_txns)
        d += timedelta(days=1)

    return txns, balance


def _freelancer_transactions(months: int, start: date, balance: float):
    txns = []
    idx  = 1
    d    = start
    end  = start + timedelta(days=months * 30)

    # Pre-schedule irregular payment dates per month
    payment_schedule: list[tuple[date, str, float]] = []
    cur = start
    for _ in range(months):
        n_payments = random.randint(3, 10)
        days_used: set[int] = set()
        for _ in range(n_payments):
            pd = random.randint(1, 28)
            while pd in days_used:
                pd = random.randint(1, 28)
            days_used.add(pd)
            pay_date  = date(cur.year, cur.month, pd)
            client    = random.choice(FREELANCE_CLIENTS)
            proj_ref  = f"PROJ{random.randint(1000,9999)}"
            amount    = round(random.uniform(5_000, 40_000), -2)
            payment_schedule.append((pay_date, client, amount))
        cur = date(cur.year + (cur.month // 12), (cur.month % 12) + 1, 1)

    pay_map = {p[0]: (p[1], p[2]) for p in payment_schedule}

    while d <= end:
        is_weekend = d.weekday() >= 5
        day_txns   = []

        # Freelance credit if scheduled
        if d in pay_map:
            client, amount = pay_map[d]
            proj = f"PROJ{random.randint(1000,9999)}"
            narr = f"NEFT CR-HDFC0009876-{client}-FREELANCE/INVOICE/{proj}"
            dt   = _pick_time(d, random.uniform(10, 15), 60)
            t, balance = _txn(idx, d, narr, "NETBANKING", amount, balance, "CREDIT", dt)
            day_txns.append(t); idx += 1

        # Occasional IMPS client payment
        if random.random() < 0.05:
            client = random.choice(FREELANCE_CLIENTS)
            amount = round(random.uniform(2_000, 15_000), -2)
            narr   = f"IMPS-{client[:20]}-CONSULTING/MILESTONE/{random.randint(100,999)}"
            dt     = _pick_time(d, 11.5, 90)
            t, balance = _txn(idx, d, narr, "NETBANKING", amount, balance, "CREDIT", dt)
            day_txns.append(t); idx += 1

        # Expenses — freelancers spend less regularly
        n_exp = random.choices([0, 1, 2], weights=[35, 45, 20]
                               if not is_weekend else [20, 40, 40])[0]
        for _ in range(n_exp):
            narr_tmpl, mode, mn, mx, _ = random.choices(
                COMMON_EXPENSES, weights=[e[4] for e in COMMON_EXPENSES])[0]
            amt = round(random.uniform(mn, min(mx, balance - 1000)), 2)
            if amt < mn:
                continue
            peak = random.choice([9.0, 13.5, 21.0])
            dt   = _pick_time(d, peak, 50)
            t, balance = _txn(idx, d, narr_tmpl, mode, amt, balance, "DEBIT", dt)
            day_txns.append(t); idx += 1

        day_txns.sort(key=lambda x: x["transactionTimestamp"])
        txns.extend(day_txns)
        d += timedelta(days=1)

    return txns, balance


def _shopkeeper_transactions(months: int, start: date, balance: float):
    txns = []
    idx  = 1
    d    = start
    end  = start + timedelta(days=months * 30)

    while d <= end:
        is_weekend = d.weekday() >= 5
        day_txns   = []

        # Daily sales (high-frequency small credits)
        # Weekend: more sales; weekday: moderate
        n_sales = random.randint(30, 80) if is_weekend else random.randint(15, 50)
        for _ in range(n_sales):
            sale_amount = round(random.uniform(20, 600), 2)
            app         = random.choice(PAYMENT_APPS)
            cust        = random.choice(CUSTOMER_IDS)
            narr = f"UPI CR-{cust}-{app}@{app}-SALE/RETAIL/SHOP"
            # Peak hours: morning (8-11) and evening (17-21)
            peak = random.choices([9.0, 14.0, 19.0], weights=[4, 2, 5])[0]
            dt   = _pick_time(d, peak, 80)
            t, balance = _txn(idx, d, narr, "UPI", sale_amount, balance, "CREDIT", dt)
            day_txns.append(t); idx += 1

        # Supplier / inventory payments (2-4 per week)
        if d.weekday() in (0, 2, 4) or (is_weekend and random.random() < 0.3):
            exp = random.choices(SHOPKEEPER_EXPENSES,
                                 weights=[e[4] for e in SHOPKEEPER_EXPENSES])[0]
            narr_tmpl, mode, mn, mx, _ = exp
            amt = round(random.uniform(mn, min(mx, balance - 5000)), 2)
            if amt >= mn:
                dt = _pick_time(d, 10.5, 60)
                t, balance = _txn(idx, d, narr_tmpl, mode, amt, balance, "DEBIT", dt)
                day_txns.append(t); idx += 1

        # Personal expenses (fewer — shopkeeper pays from shop)
        n_personal = random.choices([0, 1, 2], weights=[40, 45, 15])[0]
        for _ in range(n_personal):
            narr_tmpl, mode, mn, mx, _ = random.choices(
                COMMON_EXPENSES[:8], weights=[e[4] for e in COMMON_EXPENSES[:8]])[0]
            amt = round(random.uniform(mn, min(mx, balance - 3000)), 2)
            if amt < mn:
                continue
            dt = _pick_time(d, random.choice([8.0, 13.0, 20.0]), 45)
            t, balance = _txn(idx, d, narr_tmpl, mode, amt, balance, "DEBIT", dt)
            day_txns.append(t); idx += 1

        day_txns.sort(key=lambda x: x["transactionTimestamp"])
        txns.extend(day_txns)
        d += timedelta(days=1)

    return txns, balance


# ── Public API ────────────────────────────────────────────────────────────────

def generate_profile_data(user_type: str, months: int = 3) -> dict:
    """
    Generate a complete ReBIT-compliant financial document for a user profile.

    Args:
        user_type: "salaried" | "freelancer" | "shopkeeper"
        months:    Number of months of history to generate (default 3)

    Returns:
        ReBIT JSON document (dict) ready for storage and classification.
    """
    if user_type not in PROFILES:
        raise ValueError(f"Unknown user_type '{user_type}'. Choose: {list(PROFILES)}")

    p       = PROFILES[user_type]
    balance = p["balance"]
    start   = date.today().replace(day=1) - timedelta(days=(months - 1) * 30)

    generators = {
        "salaried":   _salaried_transactions,
        "freelancer": _freelancer_transactions,
        "shopkeeper": _shopkeeper_transactions,
    }
    txns, final_balance = generators[user_type](months, start, balance)

    # Sort all by timestamp
    txns.sort(key=lambda t: t["transactionTimestamp"])

    doc = {
        "fipID":     p["fip"],
        "consentId": str(uuid.uuid4()),
        "holder": {
            "name":           p["name"],
            "phone":          p["phone"],
            "email":          p["email"],
            "pan":            p["pan"],
            "dob":            p["dob"],
            "ckycCompliance": True,
            "userType":       user_type,
        },
        "account": {
            "type":        p["accType"],
            "maskedAccNo": p["accNo"],
            "summary": {
                "currentBalance": f"{final_balance:.2f}",
                "currency":       "INR",
                "exchgeRate":     "1",
                "openingDate":    p["opening"],
            },
            "transactions": {
                "startDate":   start.isoformat(),
                "endDate":     date.today().isoformat(),
                "transaction": txns,
            },
        },
    }

    # Write to mock_bank.json
    out_path = DATA_DIR / "mock_bank.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)

    return {
        "user_type":    user_type,
        "holder":       p["name"],
        "months":       months,
        "txn_count":    len(txns),
        "final_balance":round(final_balance, 2),
        "file":         str(out_path),
    }
