"""
Audit Trail API Route
Provides read access to the tamper-evident SHA-256 hash-chained audit log and integrity proof.
"""

from fastapi import APIRouter, Query
from backend.app.core.audit import audit_chain

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/logs")
def get_audit_logs(limit: int = Query(50, ge=1, le=200)):
    records = audit_chain.get_records(limit=limit)
    return {
        "count": len(records),
        "chain_intact": audit_chain.verify_integrity(),
        "latest_hash": records[0].entry_hash if records else None,
        "logs": records
    }

@router.get("/verify")
def verify_audit_integrity():
    is_valid = audit_chain.verify_integrity()
    return {
        "status": "SECURE" if is_valid else "CORRUPTED",
        "verified": is_valid,
        "algorithm": "SHA-256 (Merkle/Hash-Chain)",
        "message": "Audit chain cryptographic verification succeeded with zero tampered blocks." if is_valid else "Cryptographic hash mismatch detected!"
    }
