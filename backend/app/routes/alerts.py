"""
Early Warning Alerts API Route
Provides persistent, rule-based alerts triggered by economic and capacity anomalies.
"""

from fastapi import APIRouter, Query
from typing import Optional
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, BASELINE_SEATS
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity, generate_alert_trigger_reason, SEVERITY_BANDS

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("")
def get_alerts(
    state_code: Optional[str] = Query(None),
    min_severity: str = Query("SHORTAGE_WATCH", description="SHORTAGE_WATCH or CRITICAL_SHORTAGE")
):
    districts = PILOT_DISTRICTS
    if state_code:
        districts = [d for d in districts if d["state_code"].upper() == state_code.upper()]

    alerts = []
    alert_counter = 1

    for dist in districts:
        lgd = dist["lgd"]
        for trade in PILOT_TRADES:
            tid = trade["id"]
            demand = calculate_district_trade_demand(dist, trade, horizon_months=6)["p50_demand"]
            supply = calculate_effective_supply(lgd, tid, BASELINE_SEATS, horizon_months=6)["effective_supply"]
            band_code, ratio, net_gap = classify_gap_and_severity(demand, supply)

            # Check if this qualifies as an early warning alert
            if band_code in ("CRITICAL_SHORTAGE", "SHORTAGE_WATCH", "CRITICAL_SURPLUS"):
                if min_severity == "CRITICAL_SHORTAGE" and band_code != "CRITICAL_SHORTAGE":
                    continue

                reasons = generate_alert_trigger_reason(
                    district_name=dist["name"],
                    trade_name=trade["name"],
                    band=band_code,
                    net_gap=net_gap,
                    signals=dist["signals"]
                )

                band_info = SEVERITY_BANDS[band_code]

                alerts.append({
                    "id": f"ALT-2026-{alert_counter:04d}",
                    "district_lgd": lgd,
                    "district_name": dist["name"],
                    "district_name_hi": dist["name_hi"],
                    "state_code": dist["state_code"],
                    "trade_id": tid,
                    "trade_name": trade["name"],
                    "trade_name_hi": trade["name_hi"],
                    "severity_band": band_code,
                    "severity_label": band_info["label"],
                    "severity_label_hi": band_info["label_hi"],
                    "severity_color": band_info["color"],
                    "net_gap": net_gap,
                    "mismatch_ratio": ratio,
                    "trigger_reason_en": reasons["en"],
                    "trigger_reason_hi": reasons["hi"],
                    "status": "Active",
                    "consecutive_runs": 2 if band_code == "CRITICAL_SHORTAGE" else 1,
                    "timestamp": "2026-10-14T06:00:00Z"
                })
                alert_counter += 1

    alerts.sort(key=lambda x: abs(x["net_gap"]), reverse=True)

    return {
        "count": len(alerts),
        "alerts": alerts
    }
