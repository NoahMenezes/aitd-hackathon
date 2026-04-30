# SandInsight — Complete API Reference

**Base URL:** `http://localhost:8000`  
**Docs:** `http://localhost:8000/docs`

---

## 🟢 System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns `{ status: "healthy" }` |

```powershell
Invoke-RestMethod -Uri http://localhost:8000/ -Method Get | ConvertTo-Json
```

---

## 🔐 Account Aggregator (AA) Consent Flow

> Simulates the 3-step ReBIT / Account Aggregator onboarding.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create-consent` | Step 0 — Create AA consent, returns `consentHandle` + `redirectUrl` |
| `POST` | `/onboard/discover` | Step 1 — Discover linked accounts by phone number |
| `POST` | `/onboard/consent` | Step 2 — Link consent to discovered account |
| `POST` | `/onboard/complete` | Step 3 — Simulate FI_READY webhook, triggers AI engine |

```powershell
# Step 0 — Create consent
Invoke-RestMethod -Uri http://localhost:8000/create-consent -Method Post | ConvertTo-Json

# Step 1 — Discover accounts by phone
Invoke-RestMethod -Uri http://localhost:8000/onboard/discover -Method Post `
  -Body '{"phone":"9876543210"}' -ContentType 'application/json' | ConvertTo-Json

# Step 2 — Grant consent
Invoke-RestMethod -Uri http://localhost:8000/onboard/consent -Method Post `
  -Body '{"consentHandle":"<handle>","accountId":"XXXXXX5678"}' `
  -ContentType 'application/json' | ConvertTo-Json

# Step 3 — Complete + trigger AI
Invoke-RestMethod -Uri http://localhost:8000/onboard/complete -Method Post `
  -Body '{"consentHandle":"<handle>"}' -ContentType 'application/json' | ConvertTo-Json -Depth 5
```

---

## 🧠 AI Insights Engine (Webhook)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhook` | Trigger FI_READY — parses data, classifies all transactions, generates insights |

```powershell
Invoke-RestMethod -Uri http://localhost:8000/webhook -Method Post | ConvertTo-Json -Depth 5
```

**Returns:** account info, category totals, budget breaches, anomalies (outliers, recurring, salary), recommendations.

---

## 💳 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/transactions` | All parsed + classified transactions |
| `POST` | `/add-mock-transaction` | Inject a real-time purchase |

```powershell
# View all transactions
Invoke-RestMethod -Uri http://localhost:8000/transactions -Method Get | ConvertTo-Json -Depth 3

# Inject a live purchase
Invoke-RestMethod -Uri http://localhost:8000/add-mock-transaction -Method Post `
  -Body '{"merchant":"MYNTRA","amount":2500}' -ContentType 'application/json' | ConvertTo-Json
```

---

## 📊 Time-Based Analytics

| Method | Endpoint | Query Params | Description |
|--------|----------|-------------|-------------|
| `GET` | `/analytics/today` | — | Today's spending, top category, vs yesterday |
| `GET` | `/analytics/daily` | `?date=YYYY-MM-DD` | Spending breakdown for any specific date |
| `GET` | `/analytics/weekly` | `?weeks=4` | Rolling N-week summary with week-over-week trend |
| `GET` | `/analytics/monthly` | — | Month-by-month breakdown |
| `GET` | `/analytics/yearly` | — | Yearly macro overview |

```powershell
Invoke-RestMethod -Uri http://localhost:8000/analytics/today   -Method Get | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri "http://localhost:8000/analytics/daily?date=2026-04-10" -Method Get | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri "http://localhost:8000/analytics/weekly?weeks=4"        -Method Get | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri http://localhost:8000/analytics/monthly -Method Get | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri http://localhost:8000/analytics/yearly  -Method Get | ConvertTo-Json -Depth 5
```

---

## 👤 Financial Profiles & Income Intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/generate-data` | Generate fresh mock data for a user profile |
| `GET` | `/analytics/income` | Income trend, stability score (0–100), top sources |
| `GET` | `/analytics/cashflow` | Monthly cash in/out, net flow, savings rate, digital vs cash split |
| `GET` | `/analytics/business` | Shopkeeper: daily revenue, peak hours, gross margin, repeat customers |

```powershell
# Switch to shopkeeper profile (3 months of data)
Invoke-RestMethod -Uri http://localhost:8000/generate-data -Method Post `
  -Body '{"user_type":"shopkeeper","months":3}' -ContentType 'application/json' | ConvertTo-Json

# Switch to freelancer profile
Invoke-RestMethod -Uri http://localhost:8000/generate-data -Method Post `
  -Body '{"user_type":"freelancer","months":3}' -ContentType 'application/json' | ConvertTo-Json

# Income analytics
Invoke-RestMethod -Uri http://localhost:8000/analytics/income    -Method Get | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri http://localhost:8000/analytics/cashflow  -Method Get | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri http://localhost:8000/analytics/business  -Method Get | ConvertTo-Json -Depth 4
```

> **user_type options:** `salaried` | `freelancer` | `shopkeeper`

---

## 📡 WebSocket — Real-Time Insights Feed

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| `WS` | `/ws/insights` | Live broadcast whenever new transactions are added |

```javascript
// Browser / JS client
const ws = new WebSocket("ws://localhost:8000/ws/insights");
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

---

## 🗺️ Quick Cheatsheet

```
GET  /                              Health check
POST /create-consent                AA consent creation
POST /onboard/discover              Phone-based account discovery
POST /onboard/consent               Consent linking
POST /onboard/complete              FI_READY trigger
POST /webhook                       AI engine trigger
GET  /transactions                  All classified transactions
POST /add-mock-transaction          Inject live purchase
GET  /analytics/today               Today's spending
GET  /analytics/daily?date=...      Specific day
GET  /analytics/weekly?weeks=4      Rolling weeks
GET  /analytics/monthly             Month breakdown
GET  /analytics/yearly              Yearly overview
POST /generate-data                 Generate profile data
GET  /analytics/income              Income intelligence
GET  /analytics/cashflow            Cash flow analysis
GET  /analytics/business            Business metrics
WS   /ws/insights                   Real-time feed
```

**Total: 16 HTTP endpoints + 1 WebSocket**
+