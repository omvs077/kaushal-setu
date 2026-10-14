"""
Simulation API Route
Handles what-if policy queries and logs them to the audit trail.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backend.app.engine.simulation import run_simulation
from backend.app.core.audit import audit_chain

router = APIRouter(prefix="/simulate", tags=["Simulation"])

class SimulationRequest(BaseModel):
    district_lgd: int = Field(..., description="LGD code of target district")
    trade_id: str = Field(..., description="ID of trade")
    seat_delta: int = Field(0, description="Seats to add or subtract (-100 to +200)")
    economic_shock_pct: float = Field(0.0, description="Economic signal shock percentage (-50% to +100%)")
    horizon_months: int = Field(6, ge=3, le=12, description="Horizon months")
    user_role: str = Field("national_planner", description="Actor role for audit logging")
    actor: str = Field("planner_demo", description="Actor username")

@router.post("")
def execute_simulation(payload: SimulationRequest):
    try:
        result = run_simulation(
            district_lgd=payload.district_lgd,
            trade_id=payload.trade_id,
            seat_delta=payload.seat_delta,
            economic_shock_pct=payload.economic_shock_pct,
            horizon_months=payload.horizon_months
        )

        # Log to tamper-evident audit chain
        audit_chain.log(
            action="SIMULATION_EXECUTION",
            actor=payload.actor,
            role=payload.user_role,
            scope=f"LGD:{payload.district_lgd}",
            details={
                "district_lgd": payload.district_lgd,
                "trade_id": payload.trade_id,
                "seat_delta": payload.seat_delta,
                "economic_shock_pct": payload.economic_shock_pct,
                "baseline_band": result["baseline"]["severity_band"],
                "simulated_band": result["simulated"]["severity_band"]
            }
        )

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
