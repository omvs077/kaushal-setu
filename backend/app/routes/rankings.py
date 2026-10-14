"""
Rankings API Route
Delivers prioritized, ranked district x trade mismatch table with confidence intervals.
"""

from fastapi import APIRouter, Query
from typing import Optional, List
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, PILOT_SECTORS, BASELINE_SEATS
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity, SEVERITY_BANDS

router = APIRouter(prefix="/rankings", tags=["Rankings"])

@router.get("")
def get_rankings(
    state_code: Optional[str] = Query(None, description="MH, UP, TN"),
    sector_id: Optional[str] = Query(None, description="auto, capgoods, esdm, healthcare, logistics"),
    severity_band: Optional[str] = Query(None, description="CRITICAL_SHORTAGE, SHORTAGE_WATCH, etc."),
    horizon_months: int = Query(6, ge=3, le=12),
    sort_by: str = Query("gap_desc", description="gap_desc, gap_asc, demand_desc, ratio_desc"),
    limit: int = Query(50, ge=1, le=200)
):
    districts = PILOT_DISTRICTS
    if state_code:
        districts = [d for d in districts if d["state_code"].upper() == state_code.upper()]

    trades = PILOT_TRADES
    if sector_id:
        trades = [t for t in trades if t["sector_id"].lower() == sector_id.lower()]

    sector_map = {s["id"]: s for s in PILOT_SECTORS}

    items = []
    for dist in districts:
        lgd = dist["lgd"]
        for trade in trades:
            tid = trade["id"]
            sec = sector_map.get(trade["sector_id"], {})

            demand_obj = calculate_district_trade_demand(dist, trade, horizon_months=horizon_months)
            supply_obj = calculate_effective_supply(lgd, tid, BASELINE_SEATS, horizon_months=horizon_months)

            d_p50 = demand_obj["p50_demand"]
            s_eff = supply_obj["effective_supply"]

            band_code, ratio, net_gap = classify_gap_and_severity(d_p50, s_eff)

            if severity_band and band_code != severity_band:
                continue

            band_info = SEVERITY_BANDS.get(band_code, {})

            items.append({
                "district_lgd": lgd,
                "district_name": dist["name"],
                "district_name_hi": dist["name_hi"],
                "state_code": dist["state_code"],
                "trade_id": tid,
                "trade_name": trade["name"],
                "trade_name_hi": trade["name_hi"],
                "sector_id": trade["sector_id"],
                "sector_name": sec.get("name", ""),
                "sector_name_hi": sec.get("name_hi", ""),
                "sector_color": sec.get("color", "#64748b"),
                "nco_code": trade["nco"],
                "nsqf_level": trade["nsqf"],
                "demand_p50": d_p50,
                "demand_p10": demand_obj["demand_p10"] if "demand_p10" in demand_obj else demand_obj["p10_demand"],
                "demand_p90": demand_obj["demand_p90"] if "demand_p90" in demand_obj else demand_obj["p90_demand"],
                "sanctioned_seats": supply_obj["sanctioned_seats"],
                "effective_supply": s_eff,
                "net_gap": net_gap,
                "mismatch_ratio": ratio,
                "severity_band": band_code,
                "severity_label": band_info.get("label", band_code),
                "severity_label_hi": band_info.get("label_hi", band_code),
                "severity_color": band_info.get("color", "#64748b"),
                "confidence_score": demand_obj["confidence_score"],
                "factors": demand_obj["factors"]
            })

    # Sort
    if sort_by == "gap_desc":
        items.sort(key=lambda x: x["net_gap"], reverse=True)
    elif sort_by == "gap_asc":
        items.sort(key=lambda x: x["net_gap"])
    elif sort_by == "demand_desc":
        items.sort(key=lambda x: x["demand_p50"], reverse=True)
    elif sort_by == "ratio_desc":
        items.sort(key=lambda x: x["mismatch_ratio"], reverse=True)

    # Assign rank index
    ranked_results = []
    for rank, it in enumerate(items[:limit], start=1):
        it["rank"] = rank
        ranked_results.append(it)

    return {
        "count": len(ranked_results),
        "total_available": len(items),
        "horizon_months": horizon_months,
        "items": ranked_results
    }
