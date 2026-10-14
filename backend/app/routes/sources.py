"""
Source Registry & Telemetry Health API Route
Shows source provenance, freshness SLA, quality score, and access modes.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/sources", tags=["Sources"])

REGISTRY_SOURCES = [
    {
        "id": "SRC-DISCOM-POWER",
        "name": "State DISCOM Industrial Power Telemetry",
        "name_hi": "राज्य डिस्कॉम औद्योगिक विद्युत डेटा",
        "owner": "CEA / State Electricity Boards",
        "access_mode": "Synthetic-Calibrated (MoU Profile)",
        "granularity": "District x Monthly",
        "cadence_days": 30,
        "last_synced": "2026-10-12T14:30:00Z",
        "health": "Healthy",
        "quality_score": 0.98,
        "quarantined_records": 0,
        "unit": "Million kWh / Consumption Index"
    },
    {
        "id": "SRC-GSTN-EWAY",
        "name": "GSTN Inter-State Freight E-Way Bills",
        "name_hi": "जीएसटीएन ई-वे बिल फ्रेट डेटा",
        "owner": "Goods and Services Tax Network",
        "access_mode": "Synthetic-Calibrated (MoU Profile)",
        "granularity": "District x Monthly",
        "cadence_days": 30,
        "last_synced": "2026-10-13T09:15:00Z",
        "health": "Healthy",
        "quality_score": 0.96,
        "quarantined_records": 0,
        "unit": "E-way Bill Volume & Value"
    },
    {
        "id": "SRC-RBI-CREDIT",
        "name": "RBI District-wise MSME Bank Credit Outstandings",
        "name_hi": "आरबीआई जिला-वार एमएसएमई बैंक ऋण डेटा",
        "owner": "Reserve Bank of India (DBIE)",
        "access_mode": "Open Data / Public Extract",
        "granularity": "District x Quarterly",
        "cadence_days": 90,
        "last_synced": "2026-10-01T00:00:00Z",
        "health": "Healthy",
        "quality_score": 0.94,
        "quarantined_records": 0,
        "unit": "Crores INR"
    },
    {
        "id": "SRC-VAHAN-CV",
        "name": "MoRTH VAHAN Commercial Vehicle Registrations",
        "name_hi": "सड़क परिवहन मंत्रालय वाहन वाणिज्यिक वाहन पंजीकरण",
        "owner": "Ministry of Road Transport and Highways",
        "access_mode": "Open API / Dashboard Extract",
        "granularity": "District x Monthly",
        "cadence_days": 30,
        "last_synced": "2026-10-11T18:00:00Z",
        "health": "Healthy",
        "quality_score": 0.92,
        "quarantined_records": 2,
        "unit": "Vehicle Units"
    },
    {
        "id": "SRC-MSDE-SKILL",
        "name": "Skill India Digital & PMKVY/ITI Registry",
        "name_hi": "स्किल इंडिया डिजिटल एवं पीएमकेवीवाई/आईटीआई रजिस्ट्री",
        "owner": "MSDE / NCVET / NSDC",
        "access_mode": "System of Record",
        "granularity": "Centre x Trade x Candidate",
        "cadence_days": 15,
        "last_synced": "2026-10-14T02:00:00Z",
        "health": "Healthy",
        "quality_score": 0.99,
        "quarantined_records": 0,
        "unit": "Seats / Enrolments / Certifications"
    },
    {
        "id": "SRC-NCS-PORTAL",
        "name": "National Career Service (NCS) Demand Postings",
        "name_hi": "राष्ट्रीय करियर सेवा (एनसीएस) जॉब पोस्टिंग",
        "owner": "Ministry of Labour and Employment (MoLE)",
        "access_mode": "Open API / Public Aggregates",
        "granularity": "District x NCO-2015",
        "cadence_days": 7,
        "last_synced": "2026-10-13T22:00:00Z",
        "health": "Healthy",
        "quality_score": 0.91,
        "quarantined_records": 4,
        "unit": "NCO-coded Job Vacancy Index"
    }
]

@router.get("")
def get_sources():
    avg_quality = round(sum(s["quality_score"] for s in REGISTRY_SOURCES) / len(REGISTRY_SOURCES), 2)
    return {
        "count": len(REGISTRY_SOURCES),
        "overall_health": "Healthy",
        "average_quality_score": avg_quality,
        "sources": REGISTRY_SOURCES
    }
