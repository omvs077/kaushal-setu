"""
What-If Simulation Sandbox Engine
Allows planners to test policy interventions (adding seats, shifting capacity, or modeling economic surges)
with sub-second response times per SRS FR-SIM.
"""

from typing import Dict, Any
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, BASELINE_SEATS
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity, SEVERITY_BANDS

def run_simulation(
    district_lgd: int,
    trade_id: str,
    seat_delta: int = 0,
    economic_shock_pct: float = 0.0,
    horizon_months: int = 6
) -> Dict[str, Any]:
    """
    Executes what-if scenario comparing baseline vs simulated intervention.
    """
    district_map = {d["lgd"]: d for d in PILOT_DISTRICTS}
    trade_map = {t["id"]: t for t in PILOT_TRADES}

    if district_lgd not in district_map:
        raise ValueError(f"District LGD {district_lgd} not found in pilot dataset")
    if trade_id not in trade_map:
        raise ValueError(f"Trade ID {trade_id} not found in pilot dataset")

    dist = district_map[district_lgd]
    trade = trade_map[trade_id]

    # Baseline evaluation
    base_demand_obj = calculate_district_trade_demand(dist, trade, horizon_months=horizon_months, signal_multiplier=1.0)
    base_supply_obj = calculate_effective_supply(district_lgd, trade_id, BASELINE_SEATS, horizon_months=horizon_months, seat_delta=0)
    base_band, base_ratio, base_gap = classify_gap_and_severity(base_demand_obj["p50_demand"], base_supply_obj["effective_supply"])

    # Simulated evaluation with interventions
    signal_multiplier = 1.0 + (economic_shock_pct / 100.0)
    sim_demand_obj = calculate_district_trade_demand(dist, trade, horizon_months=horizon_months, signal_multiplier=signal_multiplier)
    sim_supply_obj = calculate_effective_supply(district_lgd, trade_id, BASELINE_SEATS, horizon_months=horizon_months, seat_delta=seat_delta)
    sim_band, sim_ratio, sim_gap = classify_gap_and_severity(sim_demand_obj["p50_demand"], sim_supply_obj["effective_supply"])

    # Transition narrative
    if base_band != sim_band:
        outcome_en = f"Intervention successfully shifted status from {SEVERITY_BANDS[base_band]['label']} to {SEVERITY_BANDS[sim_band]['label']} (Net gap changed by {sim_gap - base_gap:+d} seats)."
        outcome_hi = f"हस्तक्षेप ने स्थिति को {SEVERITY_BANDS[base_band]['label_hi']} से {SEVERITY_BANDS[sim_band]['label_hi']} में बदल दिया (शुद्ध अंतर में {sim_gap - base_gap:+d} सीटों का परिवर्तन)।"
    else:
        outcome_en = f"Status remains in {SEVERITY_BANDS[sim_band]['label']}; gap adjusted from {base_gap:+d} to {sim_gap:+d} seats."
        outcome_hi = f"स्थिति {SEVERITY_BANDS[sim_band]['label_hi']} में बनी हुई है; अंतर {base_gap:+d} से {sim_gap:+d} सीटों में समायोजित हुआ।"

    return {
        "district_lgd": district_lgd,
        "district_name": dist["name"],
        "district_name_hi": dist["name_hi"],
        "trade_id": trade_id,
        "trade_name": trade["name"],
        "trade_name_hi": trade["name_hi"],
        "horizon_months": horizon_months,
        "interventions": {
            "seat_delta": seat_delta,
            "economic_shock_pct": economic_shock_pct
        },
        "baseline": {
            "demand": base_demand_obj["p50_demand"],
            "effective_supply": base_supply_obj["effective_supply"],
            "sanctioned_seats": base_supply_obj["sanctioned_seats"],
            "net_gap": base_gap,
            "mismatch_ratio": base_ratio,
            "severity_band": base_band,
            "severity_label": SEVERITY_BANDS[base_band]["label"],
            "severity_label_hi": SEVERITY_BANDS[base_band]["label_hi"],
            "color": SEVERITY_BANDS[base_band]["color"]
        },
        "simulated": {
            "demand": sim_demand_obj["p50_demand"],
            "effective_supply": sim_supply_obj["effective_supply"],
            "sanctioned_seats": sim_supply_obj["sanctioned_seats"],
            "net_gap": sim_gap,
            "mismatch_ratio": sim_ratio,
            "severity_band": sim_band,
            "severity_label": SEVERITY_BANDS[sim_band]["label"],
            "severity_label_hi": SEVERITY_BANDS[sim_band]["label_hi"],
            "color": SEVERITY_BANDS[sim_band]["color"]
        },
        "narrative_en": outcome_en,
        "narrative_hi": outcome_hi
    }
