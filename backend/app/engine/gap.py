"""
Demand-Supply Gap, Severity Classification & Early Warning Flag Engine
Conforms strictly to 5-band severity classification in SRS FR-GAP and Technical Architecture.
"""

from typing import Dict, Any, Tuple

SEVERITY_BANDS = {
    "CRITICAL_SHORTAGE": {
        "label": "Critical Shortage",
        "label_hi": "गंभीर कमी",
        "color": "#ef4444",
        "badge_class": "badge-danger",
        "level": 5
    },
    "SHORTAGE_WATCH": {
        "label": "Shortage Watch",
        "label_hi": "कमी निगरानी",
        "color": "#f97316",
        "badge_class": "badge-warning",
        "level": 4
    },
    "BALANCED": {
        "label": "Balanced",
        "label_hi": "संतुलित",
        "color": "#10b981",
        "badge_class": "badge-success",
        "level": 3
    },
    "OVERSUPPLY_WATCH": {
        "label": "Oversupply Watch",
        "label_hi": "अधिशेष निगरानी",
        "color": "#3b82f6",
        "badge_class": "badge-info",
        "level": 2
    },
    "CRITICAL_SURPLUS": {
        "label": "Critical Surplus",
        "label_hi": "गंभीर अधिशेष",
        "color": "#6366f1",
        "badge_class": "badge-purple",
        "level": 1
    }
}

def classify_gap_and_severity(demand_p50: int, effective_supply: int) -> Tuple[str, float, int]:
    """
    Returns (severity_band_code, mismatch_ratio, net_gap).
    net_gap > 0 indicates Shortage (demand > supply).
    net_gap < 0 indicates Surplus (supply > demand).
    """
    net_gap = demand_p50 - effective_supply
    mismatch_ratio = round(demand_p50 / max(1, effective_supply), 2)

    if net_gap >= 75 or mismatch_ratio >= 1.65:
        band = "CRITICAL_SHORTAGE"
    elif net_gap >= 25 or mismatch_ratio >= 1.20:
        band = "SHORTAGE_WATCH"
    elif net_gap <= -75 or mismatch_ratio <= 0.60:
        band = "CRITICAL_SURPLUS"
    elif net_gap <= -25 or mismatch_ratio <= 0.85:
        band = "OVERSUPPLY_WATCH"
    else:
        band = "BALANCED"

    return band, mismatch_ratio, net_gap

def generate_alert_trigger_reason(
    district_name: str,
    trade_name: str,
    band: str,
    net_gap: int,
    signals: Dict[str, Any]
) -> Dict[str, str]:
    """
    Produces deterministic, plain-language explanation of why this alert was raised (EN + HI).
    No generative hallucination.
    """
    p_growth = signals.get("power_growth_pct", 0)
    e_growth = signals.get("eway_bills_growth_pct", 0)

    if band in ("CRITICAL_SHORTAGE", "SHORTAGE_WATCH"):
        en = f"{district_name} displays acute {trade_name} deficit ({net_gap:+d} seats). Driven by +{p_growth:.1f}% industrial power surge and +{e_growth:.1f}% freight e-way bill growth, outpacing local training throughput."
        hi = f"{district_name} में {trade_name} की भारी कमी ({net_gap:+d} सीटें) देखी गई है। यह +{p_growth:.1f}% औद्योगिक बिजली वृद्धि और +{e_growth:.1f}% ई-वे बिल विस्तार के कारण है, जो वर्तमान प्रशिक्षण क्षमता से अधिक है।"
    elif band in ("CRITICAL_SURPLUS", "OVERSUPPLY_WATCH"):
        en = f"{district_name} displays excess capacity in {trade_name} ({net_gap:d} seats). Local industrial absorption is saturated; seats represent prime candidates for reallocation."
        hi = f"{district_name} में {trade_name} में अतिरिक्त प्रशिक्षण क्षमता ({net_gap:d} सीटें) है। स्थानीय औद्योगिक अवशोषण संतृप्त है; ये सीटें पुनर्वितरण के लिए उपयुक्त हैं।"
    else:
        en = f"{district_name} training capacity matches projected hiring in {trade_name} within acceptable bounds."
        hi = f"{district_name} में प्रशिक्षण क्षमता स्वीकार्य सीमा के भीतर {trade_name} में अनुमानित भर्ती से मेल खाती है।"

    return {"en": en, "hi": hi}
