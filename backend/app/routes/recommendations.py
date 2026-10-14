"""
Recommendations API Route
Exposes min-cost flow seat shift recommendations.
"""

from fastapi import APIRouter, Query
from backend.app.engine.reallocation import compute_reallocation_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("")
def get_recommendations(
    horizon_months: int = Query(6, ge=3, le=12)
):
    recs = compute_reallocation_recommendations(horizon_months=horizon_months)
    total_shifted_seats = sum(r["seats_to_shift"] for r in recs)
    total_capex_savings = round(sum(r["estimated_capex_savings_lakhs"] for r in recs), 2)

    return {
        "count": len(recs),
        "horizon_months": horizon_months,
        "total_shifted_seats": total_shifted_seats,
        "total_estimated_capex_savings_lakhs": total_capex_savings,
        "recommendations": recs
    }
