"""
SandInsight - Transaction Pattern Library

Pure data module. No logic — only lookup tables used by classifier.py.
All patterns derived from real Indian fintech narration formats.
"""

from __future__ import annotations

# ── Category constants ────────────────────────────────────────────────────────
FOOD         = "Food & Dining"
GROCERIES    = "Groceries"
SHOPPING     = "Shopping"
TRANSPORT    = "Transport"
INCOME       = "Income"
HEALTHCARE   = "Healthcare"
ENTERTAINMENT= "Entertainment"
UTILITIES    = "Rent & Utilities"
INVESTMENT   = "Investments"
CASH         = "Cash Withdrawal"
REFUND       = "Refund / Cashback"
TRANSFER     = "Transfer"
UNKNOWN      = "Unknown"

ALL_CATEGORIES = [
    FOOD, GROCERIES, SHOPPING, TRANSPORT, INCOME,
    HEALTHCARE, ENTERTAINMENT, UTILITIES, INVESTMENT,
    CASH, REFUND, TRANSFER, UNKNOWN,
]

# ── UPI VPA → Category  (highest confidence: 0.97) ───────────────────────────
# Format: "vpa_fragment": category
VPA_MAP: dict[str, str] = {
    # Food delivery
    "zomato":          FOOD,
    "swiggy":          FOOD,
    "swiggyinstamart": GROCERIES,
    "dominos":         FOOD,
    "mcdonalds":       FOOD,
    "kfc":             FOOD,
    "burgerking":      FOOD,
    # Coffee / cafes
    "starbucks":       FOOD,
    "chaayos":         FOOD,
    "theobroma":       FOOD,
    "cafecoffeeday":   FOOD,
    # Grocery delivery
    "bigbasket":       GROCERIES,
    "blinkit":         GROCERIES,
    "zepto":           GROCERIES,
    "dmart":           GROCERIES,
    "jiomart":         GROCERIES,
    # Transport
    "ola":             TRANSPORT,
    "uber":            TRANSPORT,
    "rapido":          TRANSPORT,
    "irctc":           TRANSPORT,
    "makemytrip":      TRANSPORT,
    "goibibo":         TRANSPORT,
    "mmrda":           TRANSPORT,
    "bmtc":            TRANSPORT,
    # Shopping
    "amazon":          SHOPPING,
    "flipkart":        SHOPPING,
    "myntra":          SHOPPING,
    "ajio":            SHOPPING,
    "meesho":          SHOPPING,
    "snapdeal":        SHOPPING,
    # Entertainment
    "netflix":         ENTERTAINMENT,
    "spotify":         ENTERTAINMENT,
    "hotstar":         ENTERTAINMENT,
    "bookmyshow":      ENTERTAINMENT,
    "pvr":             ENTERTAINMENT,
    "inox":            ENTERTAINMENT,
    "zee5":            ENTERTAINMENT,
    # Healthcare
    "apollo":          HEALTHCARE,
    "medplus":         HEALTHCARE,
    "netmeds":         HEALTHCARE,
    "1mg":             HEALTHCARE,
    "practo":          HEALTHCARE,
    "pharmeasy":       HEALTHCARE,
    # Utilities
    "jio":             UTILITIES,
    "airtel":          UTILITIES,
    "bsnl":            UTILITIES,
    "tatapower":       UTILITIES,
    "bescom":          UTILITIES,
    "msedcl":          UTILITIES,
    # Investment / insurance
    "groww":           INVESTMENT,
    "zerodha":         INVESTMENT,
    "upstox":          INVESTMENT,
    "lic":             INVESTMENT,
    "hdfclife":        INVESTMENT,
    "icicipru":        INVESTMENT,
    # Fitness
    "cultfit":         HEALTHCARE,
    "gympass":         HEALTHCARE,
}

# ── Merchant name keywords → Category  (confidence: 0.90) ────────────────────
MERCHANT_KEYWORDS: list[tuple[str, str]] = [
    # Food
    ("ZOMATO",       FOOD),
    ("SWIGGY",       FOOD),
    ("DOMINOS",      FOOD),
    ("PIZZA",        FOOD),
    ("MCDONALDS",    FOOD),
    ("HARDCASTLE",   FOOD),       # McDonald's legal entity
    ("STARBUCKS",    FOOD),
    ("CHAAYOS",      FOOD),
    ("THEOBROMA",    FOOD),
    ("CAFE",         FOOD),
    ("RESTAURANT",   FOOD),
    ("DHABA",        FOOD),
    ("HOTEL",        FOOD),       # usually dining; hotel stays override later
    ("TRUFFLES",     FOOD),
    ("BAYROUTE",     FOOD),
    ("TIFFIN",       FOOD),
    # Grocery
    ("BIGBASKET",    GROCERIES),
    ("BLINKIT",      GROCERIES),
    ("GROFERS",      GROCERIES),
    ("ZEPTO",        GROCERIES),
    ("KIRANA",       GROCERIES),
    ("SUPERMARKET",  GROCERIES),
    ("GROCERY",      GROCERIES),
    ("DMART",        GROCERIES),
    ("AVENUE SUPERS",GROCERIES),
    ("JIOMART",      GROCERIES),
    # Transport
    ("OLA",          TRANSPORT),
    ("UBER",         TRANSPORT),
    ("RAPIDO",       TRANSPORT),
    ("IRCTC",        TRANSPORT),
    ("MAKEMYTRIP",   TRANSPORT),
    ("GOIBIBO",      TRANSPORT),
    ("INDIGO",       TRANSPORT),
    ("AIRINDIA",     TRANSPORT),
    ("METRO",        TRANSPORT),
    ("PETROL",       TRANSPORT),
    ("PETROLEUM",    TRANSPORT),
    ("HPCL",         TRANSPORT),
    ("BPCL",         TRANSPORT),
    ("IOCL",         TRANSPORT),
    ("FUEL",         TRANSPORT),
    ("SHELL",        TRANSPORT),
    ("CARNATION AUTO",TRANSPORT),
    # Shopping
    ("AMAZON",       SHOPPING),
    ("FLIPKART",     SHOPPING),
    ("MYNTRA",       SHOPPING),
    ("AJIO",         SHOPPING),
    ("ZARA",         SHOPPING),
    ("H&M",          SHOPPING),
    ("DECATHLON",    SHOPPING),
    ("LIFESTYLE",    SHOPPING),
    ("SHOPPERS STOP",SHOPPING),
    ("PANTALOONS",   SHOPPING),
    ("HAMLEYS",      SHOPPING),
    ("TITAN",        SHOPPING),
    ("TANISHQ",      SHOPPING),
    ("MEESHO",       SHOPPING),
    # Entertainment
    ("NETFLIX",      ENTERTAINMENT),
    ("SPOTIFY",      ENTERTAINMENT),
    ("HOTSTAR",      ENTERTAINMENT),
    ("BOOKMYSHOW",   ENTERTAINMENT),
    ("BIGTREE",      ENTERTAINMENT),
    ("PVR",          ENTERTAINMENT),
    ("INOX",         ENTERTAINMENT),
    ("SMAAASH",      ENTERTAINMENT),
    ("DELLA",        ENTERTAINMENT),
    ("CINEMAX",      ENTERTAINMENT),
    # Healthcare
    ("APOLLO",       HEALTHCARE),
    ("MEDPLUS",      HEALTHCARE),
    ("NETMEDS",      HEALTHCARE),
    ("PHARMACY",     HEALTHCARE),
    ("MEDICAL",      HEALTHCARE),
    ("HOSPITAL",     HEALTHCARE),
    ("CLINIC",       HEALTHCARE),
    ("HEALTH",       HEALTHCARE),
    ("PRACTO",       HEALTHCARE),
    # Utilities / rent
    ("RENT",         UTILITIES),
    ("JIO",          UTILITIES),
    ("AIRTEL",       UTILITIES),
    ("TATAPOWER",    UTILITIES),
    ("ELECTRICITY",  UTILITIES),
    ("BROADBAND",    UTILITIES),
    ("MAINTENANCE",  UTILITIES),
    # Investment
    ("GROWW",        INVESTMENT),
    ("ZERODHA",      INVESTMENT),
    ("SIP",          INVESTMENT),
    ("NIFTY",        INVESTMENT),
    ("LIC",          INVESTMENT),
    ("PREMIUM",      INVESTMENT),
    ("INSURANCE",    INVESTMENT),
    ("CULTFIT",      HEALTHCARE),
    ("CURE FIT",     HEALTHCARE),
    # Income signals
    ("SALARY",       INCOME),
    ("SAL/",         INCOME),
    ("BONUS",        INCOME),
    ("REIMBURSEMENT",INCOME),
    ("STIPEND",      INCOME),
    # Refunds
    ("REFUND",       REFUND),
    ("CASHBACK",     REFUND),
    ("REVERSAL",     REFUND),
    ("PRIZE",        REFUND),
    ("REFERRAL",     REFUND),
    ("REWARD",       REFUND),
]

# ── ATM / Cash patterns  (confidence: 0.98) ───────────────────────────────────
ATM_SIGNALS = ["ATM", "CASH WDL", "WITHDRAWAL", "ATM WDL"]

# ── Salary detection heuristics ───────────────────────────────────────────────
SALARY_SIGNALS   = ["SALARY", "SAL/", "NEFT CR", "NEFT/SALARY", "BONUS", "STIPEND", "REIMBURSEMENT"]
SALARY_MIN_AMOUNT = 5_000   # credits below this are unlikely to be salary

# ── Refund signals ────────────────────────────────────────────────────────────
REFUND_SIGNALS   = ["REFUND", "CASHBACK", "REVERSAL", "PRIZE", "REFERRAL BONUS", "REWARD", "CR-"]

# ── Time-slot → category hint  (low confidence backup) ───────────────────────
# (hour_start, hour_end): (category, hint_confidence)
TIME_SLOT_HINTS: list[tuple[int, int, str, float]] = [
    (6,  9,  TRANSPORT, 0.30),   # morning commute
    (7,  10, FOOD,      0.25),   # breakfast
    (12, 14, FOOD,      0.30),   # lunch
    (17, 20, TRANSPORT, 0.25),   # evening commute
    (19, 23, FOOD,      0.30),   # dinner
    (20, 23, ENTERTAINMENT, 0.20),
    (23, 24, FOOD,      0.20),   # late night food
]

# ── Amount brackets for inference ────────────────────────────────────────────
LARGE_CREDIT_MIN  = 10_000   # likely salary or bonus
RENT_TYPICAL_BAND = (5_000, 50_000)
ATM_TYPICAL_BAND  = (500, 10_000)
