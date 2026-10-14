"""
Supply & Capacity Model for Kaushal Setu
Calculates effective, market-ready training supply from sanctioned seats,
enrolments, completions, and historic absorption rates.
"""

from typing import Dict, Any

def calculate_effective_supply(
    district_lgd: int,
    trade_id: str,
    baseline_seats: Dict[str, Dict[str, Any]],
    horizon_months: int = 6,
    seat_delta: int = 0
) -> Dict[str, Any]:
    """
    Computes effective training supply over the horizon.
    Includes what-if seat_delta modifier.
    """
    key = f"{district_lgd}:{trade_id}"
    seat_info = baseline_seats.get(key, {
        "sanctioned": 150,
        "enrolled": 135,
        "certified": 120,
        "placement_rate": 0.75
    })

    sanctioned = max(10, seat_info["sanctioned"] + seat_delta)
    utilisation = seat_info["enrolled"] / max(1, seat_info["sanctioned"])
    completion_rate = seat_info["certified"] / max(1, seat_info["enrolled"])
    placement_rate = seat_info.get("placement_rate", 0.75)

    # Scale annual capacity to the forecast horizon
    horizon_factor = horizon_months / 12.0
    effective_trained = sanctioned * utilisation * completion_rate * horizon_factor
    
    # Job-ready certified graduates from training centres in this horizon
    effective_supply = round(effective_trained)

    return {
        "sanctioned_seats": sanctioned,
        "enrolled_est": round(sanctioned * utilisation * horizon_factor),
        "certified_est": round(effective_trained),
        "effective_supply": max(5, effective_supply),
        "placement_rate_pct": round(placement_rate * 100, 1),
        "utilisation_pct": round(utilisation * 100, 1)
    }
