"""
Pilot Data Repository for Kaushal Setu (कौशल सेतु)
Covers 3 Pilot States (Maharashtra, Uttar Pradesh, Tamil Nadu), 12 Industrial/Skilling Districts,
5 Focus Sectors, and 25 Key NSQF/NCO Trades.
Carries data_origin="synthetic-calibrated" compliant with PRD & Architecture specifications.
"""

from typing import Dict, Any, List

PILOT_STATES = [
    {"code": "MH", "name": "Maharashtra", "capital": "Mumbai"},
    {"code": "UP", "name": "Uttar Pradesh", "capital": "Lucknow"},
    {"code": "TN", "name": "Tamil Nadu", "capital": "Chennai"}
]

PILOT_SECTORS = [
    {"id": "auto", "nic_code": "29", "name": "Automotive & EV Mobility", "name_hi": "ऑटोमोटिव एवं ईवी मोबिलिटी", "color": "#2563eb"},
    {"id": "capgoods", "nic_code": "28", "name": "Capital Goods & Precision Machining", "name_hi": "पूंजीगत सामान और मशीनिंग", "color": "#7c3aed"},
    {"id": "esdm", "nic_code": "26", "name": "Electronics & ESDM", "name_hi": "इलेक्ट्रॉनिक्स और ईएसडीएम", "color": "#059669"},
    {"id": "healthcare", "nic_code": "86", "name": "Healthcare & Allied Medical", "name_hi": "स्वास्थ्य सेवा एवं संबद्ध चिकित्सा", "color": "#dc2626"},
    {"id": "logistics", "nic_code": "52", "name": "Logistics & Warehousing", "name_hi": "लॉजिस्टिक्स एवं वेयरहाउसिंग", "color": "#d97706"}
]

PILOT_TRADES = [
    # Automotive
    {"id": "TRD-AUTO-01", "name": "CNC Operator - Turning", "name_hi": "सीएनसी ऑपरेटर (टर्निंग)", "sector_id": "auto", "nco": "7223.0100", "nsqf": 4, "cluster": "machining"},
    {"id": "TRD-AUTO-02", "name": "EV Assembly Technician", "name_hi": "ईवी असेंबली तकनीशियन", "sector_id": "auto", "nco": "7231.0200", "nsqf": 4, "cluster": "automotive_assembly"},
    {"id": "TRD-AUTO-03", "name": "Automotive Welder (MIG/TIG)", "name_hi": "ऑटोमोटिव वेल्डर (एमआईजी/टीआईजी)", "sector_id": "auto", "nco": "7212.0100", "nsqf": 3, "cluster": "welding"},
    {"id": "TRD-AUTO-04", "name": "Automotive Service Technician", "name_hi": "ऑटोमोटिव सर्विस तकनीशियन", "sector_id": "auto", "nco": "7231.0100", "nsqf": 4, "cluster": "maintenance"},

    # Capital Goods
    {"id": "TRD-CAP-01", "name": "Tool & Die Maker", "name_hi": "टूल एवं डाई मेकर", "sector_id": "capgoods", "nco": "7222.0200", "nsqf": 5, "cluster": "machining"},
    {"id": "TRD-CAP-02", "name": "Industrial Automation Specialist", "name_hi": "औद्योगिक स्वचालन विशेषज्ञ", "sector_id": "capgoods", "nco": "7412.0200", "nsqf": 5, "cluster": "automation"},
    {"id": "TRD-CAP-03", "name": "Fitter - Mechanical", "name_hi": "मैकेनिकल फिटर", "sector_id": "capgoods", "nco": "7233.0100", "nsqf": 3, "cluster": "maintenance"},
    {"id": "TRD-CAP-04", "name": "Solar PV Installer", "name_hi": "सोलर पीवी इंस्टॉलर", "sector_id": "capgoods", "nco": "7411.0100", "nsqf": 4, "cluster": "electrical"},

    # Electronics
    {"id": "TRD-ESDM-01", "name": "SMT Assembly Operator", "name_hi": "एसएमटी असेंबली ऑपरेटर", "sector_id": "esdm", "nco": "8212.0200", "nsqf": 3, "cluster": "electronics_assembly"},
    {"id": "TRD-ESDM-02", "name": "PCB Repair & Rework Technician", "name_hi": "पीसीबी रिपेयर तकनीशियन", "sector_id": "esdm", "nco": "7421.0100", "nsqf": 4, "cluster": "electronics_assembly"},
    {"id": "TRD-ESDM-03", "name": "Quality Control Inspector (Electronics)", "name_hi": "गुणवत्ता नियंत्रण निरीक्षक (इलेक्ट्रॉनिक्स)", "sector_id": "esdm", "nco": "7543.0100", "nsqf": 4, "cluster": "quality"},
    {"id": "TRD-ESDM-04", "name": "Mobile Device Hardware Tech", "name_hi": "मोबाइल डिवाइस हार्डवेयर तकनीशियन", "sector_id": "esdm", "nco": "7422.0100", "nsqf": 4, "cluster": "maintenance"},

    # Healthcare
    {"id": "TRD-HLTH-01", "name": "General Duty Assistant (GDA)", "name_hi": "जनरल ड्यूटी असिस्टेंट", "sector_id": "healthcare", "nco": "5321.0100", "nsqf": 3, "cluster": "caregiving"},
    {"id": "TRD-HLTH-02", "name": "Phlebotomy & Lab Technician", "name_hi": "फ्लेबोटोमी एवं लैब तकनीशियन", "sector_id": "healthcare", "nco": "3212.0100", "nsqf": 4, "cluster": "clinical"},
    {"id": "TRD-HLTH-03", "name": "Emergency Medical Technician (Basic)", "name_hi": "आपातकालीन चिकित्सा तकनीशियन", "sector_id": "healthcare", "nco": "3258.0100", "nsqf": 4, "cluster": "clinical"},
    {"id": "TRD-HLTH-04", "name": "Biomedical Equipment Support Tech", "name_hi": "बायोमेडिकल उपकरण सहायता तकनीशियन", "sector_id": "healthcare", "nco": "3115.0300", "nsqf": 5, "cluster": "maintenance"},

    # Logistics
    {"id": "TRD-LOG-01", "name": "Warehouse Supervisor", "name_hi": "गोदाम पर्यवेक्षक", "sector_id": "logistics", "nco": "4321.0100", "nsqf": 5, "cluster": "logistics_mgmt"},
    {"id": "TRD-LOG-02", "name": "Forklift & Material Handling Operator", "name_hi": "फोर्कलिफ्ट ऑपरेटर", "sector_id": "logistics", "nco": "8344.0100", "nsqf": 3, "cluster": "material_handling"},
    {"id": "TRD-LOG-03", "name": "Inventory & Dispatch Associate", "name_hi": "इन्वेंटरी एवं डिस्पैच सहयोगी", "sector_id": "logistics", "nco": "4321.0200", "nsqf": 3, "cluster": "logistics_mgmt"},
    {"id": "TRD-LOG-04", "name": "Cold Chain Logistics Coordinator", "name_hi": "कोल्ड चेन लॉजिस्टिक्स समन्वयक", "sector_id": "logistics", "nco": "3331.0200", "nsqf": 4, "cluster": "logistics_mgmt"}
]

PILOT_DISTRICTS = [
    # Maharashtra
    {
        "lgd": 490, "state_code": "MH", "name": "Pune", "name_hi": "पुणे", "profile": "Industrial Mega-Hub & Auto/Engineering Corridor",
        "lat": 18.5204, "lng": 73.8567,
        "signals": {"power_kwh_index": 128.5, "power_growth_pct": 22.4, "eway_bills_growth_pct": 18.2, "cv_reg_growth_pct": 14.1, "msme_credit_growth_pct": 16.5, "online_postings_index": 142.0},
        "coverage_score": 0.96, "data_health": "Healthy"
    },
    {
        "lgd": 486, "state_code": "MH", "name": "Nashik", "name_hi": "नासिक", "profile": "Manufacturing & Defense/Electrical Belt",
        "lat": 19.9975, "lng": 73.7898,
        "signals": {"power_kwh_index": 104.2, "power_growth_pct": 3.8, "eway_bills_growth_pct": 4.5, "cv_reg_growth_pct": 2.1, "msme_credit_growth_pct": 5.0, "online_postings_index": 98.4},
        "coverage_score": 0.94, "data_health": "Healthy"
    },
    {
        "lgd": 480, "state_code": "MH", "name": "Nagpur", "name_hi": "नागपुर", "profile": "Multi-Modal Logistics Hub & Central Freight Node",
        "lat": 21.1458, "lng": 79.0882,
        "signals": {"power_kwh_index": 115.0, "power_growth_pct": 12.1, "eway_bills_growth_pct": 24.6, "cv_reg_growth_pct": 19.8, "msme_credit_growth_pct": 11.2, "online_postings_index": 126.3},
        "coverage_score": 0.92, "data_health": "Healthy"
    },
    {
        "lgd": 466, "state_code": "MH", "name": "Chhatrapati Sambhajinagar", "name_hi": "छत्रपति संभाजीनगर", "profile": "Auto Components, Tooling & Pharma",
        "lat": 19.8762, "lng": 75.3433,
        "signals": {"power_kwh_index": 109.8, "power_growth_pct": 8.3, "eway_bills_growth_pct": 7.1, "cv_reg_growth_pct": 6.2, "msme_credit_growth_pct": 7.8, "online_postings_index": 105.0},
        "coverage_score": 0.90, "data_health": "Healthy"
    },

    # Uttar Pradesh
    {
        "lgd": 141, "state_code": "UP", "name": "Gautam Buddha Nagar (Noida)", "name_hi": "गौतम बुद्ध नगर (नोएडा)", "profile": "National ESDM, Mobile Manufacturing & Tech Hardware Hub",
        "lat": 28.5355, "lng": 77.3910,
        "signals": {"power_kwh_index": 136.2, "power_growth_pct": 26.8, "eway_bills_growth_pct": 29.5, "cv_reg_growth_pct": 16.4, "msme_credit_growth_pct": 21.3, "online_postings_index": 158.0},
        "coverage_score": 0.97, "data_health": "Healthy"
    },
    {
        "lgd": 147, "state_code": "UP", "name": "Kanpur Nagar", "name_hi": "कानपुर नगर", "profile": "Heavy Engineering, Defence Corridor & Industrial Legacy",
        "lat": 26.4499, "lng": 80.3319,
        "signals": {"power_kwh_index": 102.1, "power_growth_pct": 2.4, "eway_bills_growth_pct": 1.8, "cv_reg_growth_pct": -0.8, "msme_credit_growth_pct": 4.1, "online_postings_index": 94.2},
        "coverage_score": 0.91, "data_health": "Healthy"
    },
    {
        "lgd": 157, "state_code": "UP", "name": "Lucknow", "name_hi": "लखनऊ", "profile": "State Capital, Medical Services & Urban Consumer Logistics",
        "lat": 26.8467, "lng": 80.9462,
        "signals": {"power_kwh_index": 118.4, "power_growth_pct": 14.5, "eway_bills_growth_pct": 11.2, "cv_reg_growth_pct": 9.3, "msme_credit_growth_pct": 12.0, "online_postings_index": 121.5},
        "coverage_score": 0.95, "data_health": "Healthy"
    },
    {
        "lgd": 186, "state_code": "UP", "name": "Varanasi", "name_hi": "वाराणसी", "profile": "Eastern UP Commercial Hub, Micro-machining & Textiles",
        "lat": 25.3176, "lng": 82.9739,
        "signals": {"power_kwh_index": 106.3, "power_growth_pct": 6.1, "eway_bills_growth_pct": 5.4, "cv_reg_growth_pct": 4.8, "msme_credit_growth_pct": 6.9, "online_postings_index": 101.2},
        "coverage_score": 0.88, "data_health": "Moderate"
    },

    # Tamil Nadu
    {
        "lgd": 574, "state_code": "TN", "name": "Kanchipuram (Sriperumbudur)", "name_hi": "कांचीपुरम (श्रीपेरंबुदूर)", "profile": "Global Auto & Electronics Manufacturing Corridor (Foxconn, Hyundai)",
        "lat": 12.9675, "lng": 79.9406,
        "signals": {"power_kwh_index": 141.0, "power_growth_pct": 28.5, "eway_bills_growth_pct": 31.2, "cv_reg_growth_pct": 22.0, "msme_credit_growth_pct": 19.4, "online_postings_index": 164.8},
        "coverage_score": 0.98, "data_health": "Healthy"
    },
    {
        "lgd": 569, "state_code": "TN", "name": "Coimbatore", "name_hi": "कोयंबटूर", "profile": "Pumps, Motors, Precision Foundries & Tooling Capital",
        "lat": 11.0168, "lng": 76.9558,
        "signals": {"power_kwh_index": 114.7, "power_growth_pct": 10.9, "eway_bills_growth_pct": 9.8, "cv_reg_growth_pct": 7.5, "msme_credit_growth_pct": 11.3, "online_postings_index": 118.0},
        "coverage_score": 0.95, "data_health": "Healthy"
    },
    {
        "lgd": 568, "state_code": "TN", "name": "Chennai", "name_hi": "चेन्नई", "profile": "Automobile Capital of South Asia, EV & Port Logistics",
        "lat": 13.0827, "lng": 80.2707,
        "signals": {"power_kwh_index": 124.3, "power_growth_pct": 16.2, "eway_bills_growth_pct": 15.0, "cv_reg_growth_pct": 11.8, "msme_credit_growth_pct": 14.5, "online_postings_index": 138.2},
        "coverage_score": 0.96, "data_health": "Healthy"
    },
    {
        "lgd": 576, "state_code": "TN", "name": "Krishnagiri (Hosur)", "name_hi": "कृष्णागिरी (होसुर)", "profile": "EV Two-Wheeler Capital & Advanced Precision Engineering (Ather, Ola)",
        "lat": 12.5266, "lng": 78.2146,
        "signals": {"power_kwh_index": 138.0, "power_growth_pct": 32.4, "eway_bills_growth_pct": 27.8, "cv_reg_growth_pct": 24.1, "msme_credit_growth_pct": 25.0, "online_postings_index": 152.0},
        "coverage_score": 0.94, "data_health": "Healthy"
    }
]

# Baseline Seat allocations & capacity per (district_lgd, trade_id)
# This represents current PMKVY + ITI capacity
BASELINE_SEATS: Dict[str, Dict[str, int]] = {
    # District 490 (Pune)
    "490:TRD-AUTO-01": {"sanctioned": 320, "enrolled": 305, "certified": 280, "placement_rate": 0.88},
    "490:TRD-AUTO-02": {"sanctioned": 140, "enrolled": 135, "certified": 120, "placement_rate": 0.92},
    "490:TRD-AUTO-03": {"sanctioned": 200, "enrolled": 190, "certified": 175, "placement_rate": 0.85},
    "490:TRD-CAP-01":  {"sanctioned": 180, "enrolled": 170, "certified": 155, "placement_rate": 0.89},
    "490:TRD-CAP-02":  {"sanctioned": 90,  "enrolled": 85,  "certified": 78,  "placement_rate": 0.91},
    "490:TRD-LOG-01":  {"sanctioned": 120, "enrolled": 110, "certified": 100, "placement_rate": 0.82},

    # District 486 (Nashik - has excess/surplus capacity in Machining & Welder)
    "486:TRD-AUTO-01": {"sanctioned": 450, "enrolled": 390, "certified": 360, "placement_rate": 0.62},
    "486:TRD-AUTO-03": {"sanctioned": 380, "enrolled": 320, "certified": 290, "placement_rate": 0.58},
    "486:TRD-CAP-03":  {"sanctioned": 310, "enrolled": 270, "certified": 245, "placement_rate": 0.64},

    # District 480 (Nagpur - booming logistics demand, lagging warehouse seats)
    "480:TRD-LOG-01":  {"sanctioned": 100, "enrolled": 95,  "certified": 88,  "placement_rate": 0.94},
    "480:TRD-LOG-02":  {"sanctioned": 150, "enrolled": 145, "certified": 138, "placement_rate": 0.96},
    "480:TRD-LOG-03":  {"sanctioned": 110, "enrolled": 105, "certified": 98,  "placement_rate": 0.90},

    # District 141 (Noida - huge ESDM shortage)
    "141:TRD-ESDM-01": {"sanctioned": 260, "enrolled": 250, "certified": 230, "placement_rate": 0.95},
    "141:TRD-ESDM-02": {"sanctioned": 120, "enrolled": 115, "certified": 105, "placement_rate": 0.93},
    "141:TRD-ESDM-03": {"sanctioned": 110, "enrolled": 100, "certified": 92,  "placement_rate": 0.90},

    # District 147 (Kanpur - surplus legacy fitter/mechanical, deficit in CNC)
    "147:TRD-CAP-03":  {"sanctioned": 520, "enrolled": 430, "certified": 390, "placement_rate": 0.54},
    "147:TRD-AUTO-03": {"sanctioned": 340, "enrolled": 290, "certified": 260, "placement_rate": 0.56},
    "147:TRD-AUTO-01": {"sanctioned": 150, "enrolled": 140, "certified": 128, "placement_rate": 0.82},

    # District 157 (Lucknow - healthcare demand)
    "157:TRD-HLTH-01": {"sanctioned": 300, "enrolled": 285, "certified": 260, "placement_rate": 0.88},
    "157:TRD-HLTH-02": {"sanctioned": 140, "enrolled": 130, "certified": 120, "placement_rate": 0.89},
    "157:TRD-HLTH-03": {"sanctioned": 90,  "enrolled": 85,  "certified": 76,  "placement_rate": 0.91},

    # District 574 (Sriperumbudur / Kanchipuram - critical shortage in electronics & auto assembly)
    "574:TRD-ESDM-01": {"sanctioned": 280, "enrolled": 270, "certified": 250, "placement_rate": 0.97},
    "574:TRD-ESDM-03": {"sanctioned": 130, "enrolled": 125, "certified": 115, "placement_rate": 0.94},
    "574:TRD-AUTO-02": {"sanctioned": 160, "enrolled": 155, "certified": 140, "placement_rate": 0.95},

    # District 569 (Coimbatore - tooling & precision machinery)
    "569:TRD-CAP-01":  {"sanctioned": 290, "enrolled": 275, "certified": 255, "placement_rate": 0.89},
    "569:TRD-AUTO-01": {"sanctioned": 310, "enrolled": 295, "certified": 270, "placement_rate": 0.87},

    # District 576 (Hosur / Krishnagiri - critical shortage in EV technicians)
    "576:TRD-AUTO-02": {"sanctioned": 150, "enrolled": 145, "certified": 135, "placement_rate": 0.98},
    "576:TRD-CAP-02":  {"sanctioned": 80,  "enrolled": 78,  "certified": 72,  "placement_rate": 0.96}
}

# Distance matrix between pilot districts in km (used for Min-Cost Flow seat reallocation)
DISTRICT_DISTANCES: Dict[str, int] = {
    "490-486": 210,  # Pune - Nashik
    "490-480": 710,  # Pune - Nagpur
    "490-466": 235,  # Pune - Chhatrapati Sambhajinagar
    "486-466": 158,  # Nashik - Chhatrapati Sambhajinagar
    "486-480": 680,  # Nashik - Nagpur

    "141-147": 430,  # Noida - Kanpur
    "141-157": 490,  # Noida - Lucknow
    "147-157": 85,   # Kanpur - Lucknow
    "147-186": 320,  # Kanpur - Varanasi
    "157-186": 305,  # Lucknow - Varanasi

    "574-568": 55,   # Kanchipuram - Chennai
    "574-576": 240,  # Kanchipuram - Hosur
    "568-576": 300,  # Chennai - Hosur
    "569-576": 230,  # Coimbatore - Hosur
    "569-574": 460,  # Coimbatore - Kanchipuram
    "569-568": 500   # Coimbatore - Chennai
}

def get_distance_km(d1: int, d2: int) -> int:
    if d1 == d2:
        return 0
    k1 = f"{d1}-{d2}"
    k2 = f"{d2}-{d1}"
    return DISTRICT_DISTANCES.get(k1, DISTRICT_DISTANCES.get(k2, 450))
