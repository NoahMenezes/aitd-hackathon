import requests
import os

# Use ngrok URL from environment if possible, or just test locally
BASE_URL = "http://localhost:8000"

endpoints = [
    "/dashboard/daily-list/testuser",
]

for ep in endpoints:
    try:
        res = requests.get(f"{BASE_URL}{ep}", headers={"ngrok-skip-browser-warning": "true"})
        print(f"GET {ep}: {res.status_code}")
        print(f"Response: {res.text[:200]}")
    except Exception as e:
        print(f"Failed to connect to {ep}: {str(e)}")
