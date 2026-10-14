import hashlib
import json
import time
from typing import Any, List, Optional
from pydantic import BaseModel, Field

class AuditRecord(BaseModel):
    id: int
    timestamp: str
    action: str
    actor: str
    role: str
    scope: str
    details: dict[str, Any]
    prev_hash: str
    entry_hash: str

class AuditChain:
    def __init__(self):
        self._chain: List[AuditRecord] = []
        # Seed genesis record
        self._add_genesis()

    def _add_genesis(self):
        genesis_prev = "0" * 64
        genesis_event = {
            "id": 0,
            "timestamp": "2026-10-14T00:00:00Z",
            "action": "SYSTEM_INITIALIZATION",
            "actor": "system",
            "role": "platform_admin",
            "scope": "ALL",
            "details": {"system": "Kaushal Setu (कौशल सेतु)", "version": "1.0.0-mvp", "message": "Genesis block created"}
        }
        h = self._hash_payload(genesis_prev, genesis_event)
        record = AuditRecord(
            id=0,
            timestamp=genesis_event["timestamp"],
            action=genesis_event["action"],
            actor=genesis_event["actor"],
            role=genesis_event["role"],
            scope=genesis_event["scope"],
            details=genesis_event["details"],
            prev_hash=genesis_prev,
            entry_hash=h
        )
        self._chain.append(record)

    def _hash_payload(self, prev_hash: str, event_data: dict) -> str:
        payload = json.dumps({"prev": prev_hash, "data": event_data}, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def log(self, action: str, actor: str, role: str, scope: str, details: dict[str, Any]) -> AuditRecord:
        prev_hash = self._chain[-1].entry_hash if self._chain else "0" * 64
        rec_id = len(self._chain)
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        event_dict = {
            "id": rec_id,
            "timestamp": timestamp,
            "action": action,
            "actor": actor,
            "role": role,
            "scope": scope,
            "details": details
        }
        entry_hash = self._hash_payload(prev_hash, event_dict)
        rec = AuditRecord(
            id=rec_id,
            timestamp=timestamp,
            action=action,
            actor=actor,
            role=role,
            scope=scope,
            details=details,
            prev_hash=prev_hash,
            entry_hash=entry_hash
        )
        self._chain.append(rec)
        return rec

    def get_records(self, limit: int = 50) -> List[AuditRecord]:
        return list(reversed(self._chain[-limit:]))

    def verify_integrity(self) -> bool:
        if not self._chain:
            return True
        for i in range(1, len(self._chain)):
            curr = self._chain[i]
            prev = self._chain[i-1]
            if curr.prev_hash != prev.entry_hash:
                return False
            expected_hash = self._hash_payload(curr.prev_hash, {
                "id": curr.id,
                "timestamp": curr.timestamp,
                "action": curr.action,
                "actor": curr.actor,
                "role": curr.role,
                "scope": curr.scope,
                "details": curr.details
            })
            if curr.entry_hash != expected_hash:
                return False
        return True

audit_chain = AuditChain()
