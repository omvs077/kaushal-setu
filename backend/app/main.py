"""
Kaushal Setu (कौशल सेतु) - Labour Market Intelligence & Skill Forecasting MVP
FastAPI Application Entrypoint
"""

import sys
import types
from pathlib import Path

# Ensure 'backend' namespace resolves even when working directory is 'backend/' (e.g. on Render)
_BACKEND_DIR = Path(__file__).resolve().parent.parent
if "backend" not in sys.modules:
    _backend_pkg = types.ModuleType("backend")
    _backend_pkg.__path__ = [str(_BACKEND_DIR)]
    sys.modules["backend"] = _backend_pkg
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from backend.app.core.config import settings
from backend.app.core.audit import audit_chain
from backend.app.routes.overview import router as overview_router
from backend.app.routes.rankings import router as rankings_router
from backend.app.routes.districts import router as districts_router
from backend.app.routes.recommendations import router as recommendations_router
from backend.app.routes.alerts import router as alerts_router
from backend.app.routes.simulation import router as simulation_router
from backend.app.routes.export import router as export_router
from backend.app.routes.audit import router as audit_router
from backend.app.routes.sources import router as sources_router

app = FastAPI(
    title=settings.APP_TITLE,
    description="Kaushal Setu turns leading economic signals (power, e-way bills, credit) into district-level skill demand-supply forecasts, ranks mismatches, and recommends seat reallocations.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(overview_router, prefix=settings.API_PREFIX)
app.include_router(rankings_router, prefix=settings.API_PREFIX)
app.include_router(districts_router, prefix=settings.API_PREFIX)
app.include_router(recommendations_router, prefix=settings.API_PREFIX)
app.include_router(alerts_router, prefix=settings.API_PREFIX)
app.include_router(simulation_router, prefix=settings.API_PREFIX)
app.include_router(export_router, prefix=settings.API_PREFIX)
app.include_router(audit_router, prefix=settings.API_PREFIX)
app.include_router(sources_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "title": settings.APP_TITLE,
        "version": settings.VERSION,
        "status": "ONLINE",
        "docs": "/docs",
        "pilot_states": settings.PILOT_STATES,
        "data_origin": settings.DATA_ORIGIN
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "audit_chain_verified": audit_chain.verify_integrity(),
        "version": settings.VERSION
    }

# Mock Auth / Role Session endpoint for MVP demo personas
@app.get("/api/auth/me")
def get_current_user_profile(role: str = "national_planner"):
    profiles = {
        "national_planner": {
            "name": "Meera Sharma",
            "role": "national_planner",
            "title": "National Planning Director, MSDE / NCVET",
            "scope": "ALL_STATES",
            "state_code": None,
            "badge": "National Planner"
        },
        "state_planner": {
            "name": "Rajesh Deshmukh",
            "role": "state_planner",
            "title": "State Skill Development Mission (SSDM) Director",
            "scope": "STATE",
            "state_code": "MH",
            "badge": "Maharashtra State Planner"
        },
        "district_officer": {
            "name": "Farida Ansari",
            "role": "district_officer",
            "title": "District Skill Officer (DSO), Pune",
            "scope": "DISTRICT",
            "district_lgd": 490,
            "state_code": "MH",
            "badge": "Pune District Officer"
        },
        "auditor": {
            "name": "CAG & STQC Auditor",
            "role": "auditor",
            "title": "Independent Audit & Verification Officer",
            "scope": "READ_ONLY_AUDIT",
            "state_code": None,
            "badge": "External Auditor"
        }
    }
    return profiles.get(role, profiles["national_planner"])
