"""
Districts API Route
Provides district list, geospatial data, and drill-down with "Why?" explainability factors.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, PILOT_SECTORS, BASELINE_SEATS
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity, SEVERITY_BANDS

router = APIRouter(prefix="/districts", tags=["Districts"])

@router.get("")
def list_districts(
    state_code: Optional[str] = Query(None)
):
    districts = PILOT_DISTRICTS
    if state_code:
        districts = [d for d in districts if d["state_code"].upper() == state_code.upper()]

    results = []
    for d in districts:
        lgd = d["lgd"]
        total_d = 0
        total_s = 0
        crit_count = 0
        for t in PILOT_TRADES:
            dem = calculate_district_trade_demand(d, t, horizon_months=6)["p50_demand"]
            sup = calculate_effective_supply(lgd, t["id"], BASELINE_SEATS, horizon_months=6)["effective_supply"]
            total_d += dem
            total_s += sup
            b, _, _ = classify_gap_and_severity(dem, sup)
            if b == "CRITICAL_SHORTAGE":
                crit_count += 1

        results.append({
            "lgd": d["lgd"],
            "state_code": d["state_code"],
            "name": d["name"],
            "name_hi": d["name_hi"],
            "profile": d["profile"],
            "lat": d["lat"],
            "lng": d["lng"],
            "signals": d["signals"],
            "coverage_score": d["coverage_score"],
            "data_health": d["data_health"],
            "aggregate_demand": total_d,
            "aggregate_supply": total_s,
            "aggregate_gap": total_d - total_s,
            "critical_shortages": crit_count
        })
    return results

@router.get("/{lgd}")
def get_district_detail(
    lgd: int,
    horizon_months: int = Query(6, ge=3, le=12)
):
    district_map = {d["lgd"]: d for d in PILOT_DISTRICTS}
    if lgd not in district_map:
        raise HTTPException(status_code=404, detail="District not found")

    dist = district_map[lgd]
    sector_map = {s["id"]: s for s in PILOT_SECTORS}

    trade_details = []
    total_demand = 0
    total_supply = 0
    crit_count = 0

    for trade in PILOT_TRADES:
        tid = trade["id"]
        sec = sector_map.get(trade["sector_id"], {})
        demand_obj = calculate_district_trade_demand(dist, trade, horizon_months=horizon_months)
        supply_obj = calculate_effective_supply(lgd, tid, BASELINE_SEATS, horizon_months=horizon_months)

        d_p50 = demand_obj["p50_demand"]
        s_eff = supply_obj["effective_supply"]
        band_code, ratio, net_gap = classify_gap_and_severity(d_p50, s_eff)

        total_demand += d_p50
        total_supply += s_eff
        if band_code == "CRITICAL_SHORTAGE":
            crit_count += 1

        trade_details.append({
            "trade_id": tid,
            "trade_name": trade["name"],
            "trade_name_hi": trade["name_hi"],
            "sector_id": trade["sector_id"],
            "sector_name": sec.get("name", ""),
            "nco_code": trade["nco"],
            "nsqf": trade["nsqf"],
            "demand_p50": d_p50,
            "demand_p10": demand_obj["p10_demand"],
            "demand_p90": demand_obj["p90_demand"],
            "sanctioned_seats": supply_obj["sanctioned_seats"],
            "effective_supply": s_eff,
            "net_gap": net_gap,
            "mismatch_ratio": ratio,
            "severity_band": band_code,
            "severity_label": SEVERITY_BANDS[band_code]["label"],
            "severity_label_hi": SEVERITY_BANDS[band_code]["label_hi"],
            "severity_color": SEVERITY_BANDS[band_code]["color"],
            "confidence_score": demand_obj["confidence_score"],
            "factors": demand_obj["factors"]
        })

    trade_details.sort(key=lambda x: x["net_gap"], reverse=True)

    return {
        "district": dist,
        "horizon_months": horizon_months,
        "summary": {
            "total_demand": total_demand,
            "total_supply": total_supply,
            "net_gap": total_demand - total_supply,
            "critical_shortages": crit_count
        },
        "trades": trade_details
    }
