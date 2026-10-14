"""
Overview API Route
Provides high-level KPI aggregations for national and state planners.
"""

from fastapi import APIRouter, Query
from typing import Optional
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, PILOT_SECTORS, PILOT_STATES, BASELINE_SEATS
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity

router = APIRouter(prefix="/overview", tags=["Overview"])

@router.get("")
def get_overview(
    state_code: Optional[str] = Query(None, description="Filter by pilot state: MH, UP, TN"),
    horizon_months: int = Query(6, ge=3, le=12, description="Forecasting horizon in months")
):
    districts = PILOT_DISTRICTS
    if state_code:
        districts = [d for d in districts if d["state_code"].upper() == state_code.upper()]

    total_demand = 0
    total_supply = 0
    critical_shortages_count = 0
    shortage_watch_count = 0
    balanced_count = 0
    oversupply_count = 0
    critical_surplus_count = 0

    sector_demand_map = {s["id"]: 0 for s in PILOT_SECTORS}
    sector_supply_map = {s["id"]: 0 for s in PILOT_SECTORS}

    trade_map = {t["id"]: t for t in PILOT_TRADES}

    for dist in districts:
        lgd = dist["lgd"]
        for trade in PILOT_TRADES:
            tid = trade["id"]
            sec_id = trade["sector_id"]

            demand_obj = calculate_district_trade_demand(dist, trade, horizon_months=horizon_months)
            supply_obj = calculate_effective_supply(lgd, tid, BASELINE_SEATS, horizon_months=horizon_months)

            d_val = demand_obj["p50_demand"]
            s_val = supply_obj["effective_supply"]

            total_demand += d_val
            total_supply += s_val
            sector_demand_map[sec_id] += d_val
            sector_supply_map[sec_id] += s_val

            band, _, _ = classify_gap_and_severity(d_val, s_val)
            if band == "CRITICAL_SHORTAGE":
                critical_shortages_count += 1
            elif band == "SHORTAGE_WATCH":
                shortage_watch_count += 1
            elif band == "BALANCED":
                balanced_count += 1
            elif band == "OVERSUPPLY_WATCH":
                oversupply_count += 1
            elif band == "CRITICAL_SURPLUS":
                critical_surplus_count += 1

    net_gap = total_demand - total_supply

    # Format sector metrics
    sector_breakdown = []
    for s in PILOT_SECTORS:
        sid = s["id"]
        d = sector_demand_map[sid]
        sp = sector_supply_map[sid]
        sector_breakdown.append({
            "sector_id": sid,
            "sector_name": s["name"],
            "sector_name_hi": s["name_hi"],
            "color": s["color"],
            "demand": d,
            "supply": sp,
            "gap": d - sp
        })

    # State level summary cards
    state_summaries = []
    for st in PILOT_STATES:
        st_districts = [d for d in PILOT_DISTRICTS if d["state_code"] == st["code"]]
        st_demand = 0
        st_supply = 0
        st_critical = 0

        for d in st_districts:
            for t in PILOT_TRADES:
                dem = calculate_district_trade_demand(d, t, horizon_months=horizon_months)["p50_demand"]
                sup = calculate_effective_supply(d["lgd"], t["id"], BASELINE_SEATS, horizon_months=horizon_months)["effective_supply"]
                st_demand += dem
                st_supply += sup
                b, _, _ = classify_gap_and_severity(dem, sup)
                if b == "CRITICAL_SHORTAGE":
                    st_critical += 1

        state_summaries.append({
            "state_code": st["code"],
            "state_name": st["name"],
            "districts_count": len(st_districts),
            "demand": st_demand,
            "supply": st_supply,
            "net_gap": st_demand - st_supply,
            "critical_shortages": st_critical
        })

    return {
        "horizon_months": horizon_months,
        "selected_state": state_code or "ALL",
        "data_origin": "synthetic-calibrated",
        "kpis": {
            "total_projected_demand": total_demand,
            "total_effective_supply": total_supply,
            "net_mismatch_gap": net_gap,
            "critical_shortage_trades": critical_shortages_count,
            "shortage_watch_trades": shortage_watch_count,
            "balanced_trades": balanced_count,
            "oversupply_trades": oversupply_count + critical_surplus_count,
            "monitored_districts": len(districts),
            "monitored_trades": len(PILOT_TRADES)
        },
        "severity_distribution": {
            "CRITICAL_SHORTAGE": critical_shortages_count,
            "SHORTAGE_WATCH": shortage_watch_count,
            "BALANCED": balanced_count,
            "OVERSUPPLY_WATCH": oversupply_count,
            "CRITICAL_SURPLUS": critical_surplus_count
        },
        "sector_breakdown": sector_breakdown,
        "state_summaries": state_summaries
    }
