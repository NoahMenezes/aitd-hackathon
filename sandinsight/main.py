"""
SandInsight — AI-Powered Financial Insights System
===================================================

Main FastAPI application entry point.

Run with:
    uvicorn main:app --reload
"""

import json
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from routes.consent import router as consent_router
from routes.webhook import router as webhook_router
from routes.transactions import router as transactions_router
from routes.analytics import router as analytics_router

# ──────────────────────────────────────────────
# Logging configuration
# ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)-30s │ %(levelname)-7s │ %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("sandinsight")

# ──────────────────────────────────────────────
# App initialization
# ──────────────────────────────────────────────
app = FastAPI(
    title="SandInsight",
    description=(
        "AI-Powered Financial Insights System — "
        "simulates Account Aggregator flows, parses ReBIT data, "
        "and generates smart spending insights."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow all origins for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Register route modules
# ──────────────────────────────────────────────
app.include_router(consent_router)
app.include_router(webhook_router)
app.include_router(transactions_router)
app.include_router(analytics_router)

# ──────────────────────────────────────────────
# WebSocket — real-time insights feed
# ──────────────────────────────────────────────

class ConnectionManager:
    """Manages active WebSocket connections for real-time broadcasts."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info("WebSocket client connected (%d active)", len(self.active_connections))

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info("WebSocket client disconnected (%d active)", len(self.active_connections))

    async def broadcast(self, message: dict):
        """Send a JSON message to all connected clients."""
        payload = json.dumps(message)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.active_connections.remove(conn)


manager = ConnectionManager()


@app.websocket("/ws/insights")
async def websocket_insights(websocket: WebSocket):
    """
    WebSocket endpoint for real-time insight updates.

    Clients connect here to receive live notifications
    whenever new transactions are added or insights change.
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info("WS received: %s", data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# Expose manager globally so routes can broadcast
app.state.ws_manager = manager


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    """Health check / root endpoint."""
    return {
        "service": "SandInsight",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.on_event("startup")
async def startup_event():
    logger.info("🚀 SandInsight server starting...")
    logger.info("📖 API Docs: http://localhost:8000/docs")
