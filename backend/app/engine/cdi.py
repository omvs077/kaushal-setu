"""
Composite Demand Index (CDI) & Leading Signal Nowcasting Engine
Deterministic, explainable, and fully auditable implementation per SRS FR-FC and Technical Architecture.
"""

import math
from typing import Dict, Any, Tuple

# Technical Leontief multiplier approximations for Indian industrial sectors
# (Direct + Indirect employment generation coefficient per unit final output shock)
LEONTIEF_MULTIPLIERS = {
    "auto": 1.48,       # Automotive has deep tier-1/tier-2 supply chain linkages
    "capgoods": 1.42,   # Heavy machinery draws heavily on basic metals & electricals
    "esdm": 1.35,       # Electronics hardware assembly & component fabrication
    "healthcare": 1.22, # Medical services & diagnostics
    "logistics": 1.31   # Freight transport, warehousing & packaging
}

# Calibrated signal elasticities for nowcasting employment demand
# beta_power: electricity kWh elasticity
# beta_eway: e-way bill volume elasticity
# beta_postings: high-frequency job posting momentum
# beta_credit: bank credit deployment elasticity
ELASTICITIES = {
    "auto": {"power": 0.35, "eway": 0.25, "postings": 0.25, "credit": 0.15},
    "capgoods": {"power": 0.38, "eway": 0.22, "postings": 0.22, "credit": 0.18},
    "esdm": {"power": 0.20, "eway": 0.35, "postings": 0.30, "credit": 0.15},
    "healthcare": {"power": 0.10, "eway": 0.15, "postings": 0.50, "credit": 0.25},
    "logistics": {"power": 0.15, "eway": 0.45, "postings": 0.25, "credit": 0.15}
}

def calculate_district_trade_demand(
    district: Dict[str, Any],
    trade: Dict[str, Any],
    horizon_months: int = 6,
    signal_multiplier: float = 1.0
) -> Dict[str, Any]:
    """
    Computes projected worker demand for a (district, trade) pair over a specified horizon.
    Produces P10, P50 (point forecast), P90 confidence intervals,
    and a factor attribution breakdown for explainability.
    """
    sector_id = trade["sector_id"]
    signals = district["signals"]
    weights = ELASTICITIES.get(sector_id, {"power": 0.25, "eway": 0.25, "postings": 0.25, "credit": 0.25})
    leontief_mult = LEONTIEF_MULTIPLIERS.get(sector_id, 1.30)

    # District size/tier factor
    dist_name = district.get("name", "")
    if any(h in dist_name for h in ["Pune", "Noida", "Kanchipuram", "Hosur", "Chennai"]):
        tier_factor = 1.45
    elif any(h in dist_name for h in ["Nagpur", "Coimbatore", "Lucknow"]):
        tier_factor = 1.05
    else:
        tier_factor = 0.65

    # Base annual demand for typical trade in district (derived from trade NSQF & district size)
    base_demand = (130 + (trade["nsqf"] * 20)) * tier_factor
    
    # Calculate composite leading indicator momentum
    p_growth = (signals.get("power_growth_pct", 5.0) / 100.0) * signal_multiplier
    e_growth = (signals.get("eway_bills_growth_pct", 5.0) / 100.0) * signal_multiplier
    c_growth = (signals.get("msme_credit_growth_pct", 5.0) / 100.0) * signal_multiplier
    postings_idx = signals.get("online_postings_index", 100.0) / 100.0
    postings_growth = (postings_idx - 1.0) * signal_multiplier

    # Weighted economic leading shift
    weighted_shift = (
        weights["power"] * p_growth +
        weights["eway"] * e_growth +
        weights["credit"] * c_growth +
        weights["postings"] * postings_growth
    )

    # Scale to horizon (3M, 6M, 12M)
    horizon_factor = horizon_months / 12.0

    # Total predicted demand (Point estimate P50)
    # Direct demand = base * (1 + weighted_shift)
    # With Leontief indirect multiplier effect
    direct_demand = base_demand * max(0.4, (1.0 + weighted_shift)) * horizon_factor
    total_projected_demand = direct_demand * (1.0 + (leontief_mult - 1.0) * 0.45)
    
    p50 = round(total_projected_demand)

    # Confidence bounds (P10 - P90) based on district data health and coverage score
    coverage = district.get("coverage_score", 0.90)
    uncertainty_pct = max(0.08, (1.05 - coverage) * 0.40)
    p10 = max(10, round(p50 * (1.0 - uncertainty_pct)))
    p90 = round(p50 * (1.0 + uncertainty_pct))

    # Factor attribution breakdown ("Why?" drawer explainability)
    power_impact_pct = round(weights["power"] * (p_growth * 100), 1)
    eway_impact_pct = round(weights["eway"] * (e_growth * 100), 1)
    postings_impact_pct = round(weights["postings"] * (postings_growth * 100), 1)
    credit_impact_pct = round(weights["credit"] * (c_growth * 100), 1)
    leontief_boost_pct = round((leontief_mult - 1.0) * 45, 1)

    return {
        "p50_demand": p50,
        "p10_demand": p10,
        "p90_demand": p90,
        "confidence_score": round(coverage, 2),
        "horizon_months": horizon_months,
        "factors": {
            "power_telemetry_contrib_pct": power_impact_pct,
            "eway_bill_contrib_pct": eway_impact_pct,
            "postings_momentum_contrib_pct": postings_impact_pct,
            "bank_credit_contrib_pct": credit_impact_pct,
            "indirect_supply_chain_multiplier": leontief_mult,
            "leontief_boost_pct": leontief_boost_pct
        }
    }
