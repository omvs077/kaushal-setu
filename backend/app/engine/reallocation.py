"""
Seat Reallocation Engine using Min-Cost Flow
Optimizes shifting surplus training seats to high-deficit districts within cluster and distance constraints.
Reference implementation per SRS FR-RA and Technical Architecture Section 11.3.
"""

from typing import List, Dict, Any
import networkx as nx
from backend.app.data.pilot_data import PILOT_DISTRICTS, PILOT_TRADES, BASELINE_SEATS, get_distance_km
from backend.app.engine.cdi import calculate_district_trade_demand
from backend.app.engine.supply import calculate_effective_supply
from backend.app.engine.gap import classify_gap_and_severity

def compute_reallocation_recommendations(horizon_months: int = 6) -> List[Dict[str, Any]]:
    """
    Solves min-cost flow problem for trade clusters to propose concrete seat moves.
    """
    district_map = {d["lgd"]: d for d in PILOT_DISTRICTS}
    trade_map = {t["id"]: t for t in PILOT_TRADES}

    # Group trades by cluster
    clusters: Dict[str, List[str]] = {}
    for t in PILOT_TRADES:
        c = t.get("cluster", t["sector_id"])
        clusters.setdefault(c, []).append(t["id"])

    recommendations: List[Dict[str, Any]] = []

    for cluster_name, trade_ids in clusters.items():
        surplus_nodes = {}  # (lgd, trade_id): surplus_units
        deficit_nodes = {}  # (lgd, trade_id): deficit_units

        for lgd, dist in district_map.items():
            for tid in trade_ids:
                trade = trade_map[tid]
                demand = calculate_district_trade_demand(dist, trade, horizon_months)["p50_demand"]
                supply = calculate_effective_supply(lgd, tid, BASELINE_SEATS, horizon_months)["effective_supply"]
                band, ratio, net_gap = classify_gap_and_severity(demand, supply)

                if net_gap >= 15: # Deficit
                    deficit_nodes[(lgd, tid)] = min(net_gap, 100)
                elif net_gap <= -15: # Surplus
                    surplus_nodes[(lgd, tid)] = min(abs(net_gap), 100)

        if not surplus_nodes or not deficit_nodes:
            continue

        # Build Min-Cost Flow Digraph
        G = nx.DiGraph()
        total_surplus = sum(surplus_nodes.values())
        total_deficit = sum(deficit_nodes.values())

        for (u_lgd, u_tid), s_qty in surplus_nodes.items():
            u_name = f"S:{u_lgd}:{u_tid}"
            G.add_node(u_name, demand=-s_qty)

        for (v_lgd, v_tid), d_qty in deficit_nodes.items():
            v_name = f"D:{v_lgd}:{v_tid}"
            G.add_node(v_name, demand=d_qty)

        # Edges between surplus and deficit
        for (u_lgd, u_tid), s_qty in surplus_nodes.items():
            u_name = f"S:{u_lgd}:{u_tid}"
            u_dist = district_map[u_lgd]

            for (v_lgd, v_tid), d_qty in deficit_nodes.items():
                v_name = f"D:{v_lgd}:{v_tid}"
                v_dist = district_map[v_lgd]

                # Distance cost
                dist_km = get_distance_km(u_lgd, v_lgd)
                
                # State penalty if cross-state (prefer within state)
                state_penalty = 0 if u_dist["state_code"] == v_dist["state_code"] else 120
                
                # Trade divergence penalty (if different trades in same cluster)
                trade_penalty = 0 if u_tid == v_tid else 50
                
                cost = dist_km + state_penalty + trade_penalty
                cap = min(s_qty, d_qty)
                G.add_edge(u_name, v_name, weight=int(cost), capacity=int(cap))

        # Balance total supply and demand in the network
        imbalance = total_deficit - total_surplus
        if imbalance > 0:
            # More deficit than surplus: dummy supplier covers unmet deficit at penalty cost
            G.add_node('_UNMET', demand=-imbalance)
            for (v_lgd, v_tid), d_qty in deficit_nodes.items():
                v_name = f"D:{v_lgd}:{v_tid}"
                G.add_edge('_UNMET', v_name, weight=10000, capacity=d_qty)
        elif imbalance < 0:
            # More surplus than deficit: dummy sink absorbs unused surplus at zero cost
            G.add_node('_UNUSED', demand=abs(imbalance))
            for (u_lgd, u_tid), s_qty in surplus_nodes.items():
                u_name = f"S:{u_lgd}:{u_tid}"
                G.add_edge(u_name, '_UNUSED', weight=0, capacity=s_qty)

        try:
            flow_dict = nx.min_cost_flow(G)
        except Exception:
            continue

        # Extract real moves
        for u_name, nbrs in flow_dict.items():
            if not u_name.startswith("S:"):
                continue
            parts_u = u_name.split(":")
            u_lgd, u_tid = int(parts_u[1]), parts_u[2]

            for v_name, flow_amount in nbrs.items():
                if not v_name.startswith("D:") or flow_amount <= 0:
                    continue
                parts_v = v_name.split(":")
                v_lgd, v_tid = int(parts_v[1]), parts_v[2]

                dist_u = district_map[u_lgd]
                dist_v = district_map[v_lgd]
                trade_u = trade_map[u_tid]
                trade_v = trade_map[v_tid]
                dist_km = get_distance_km(u_lgd, v_lgd)

                # Est capex savings: avg new centre setup capex is ₹45,000 per seat
                est_savings_lakhs = round((flow_amount * 42000) / 100000, 2)

                rec_id = f"REC-{u_lgd}-{v_lgd}-{u_tid}"
                recommendations.append({
                    "id": rec_id,
                    "source_district_lgd": u_lgd,
                    "source_district_name": dist_u["name"],
                    "source_district_name_hi": dist_u["name_hi"],
                    "source_state": dist_u["state_code"],
                    "target_district_lgd": v_lgd,
                    "target_district_name": dist_v["name"],
                    "target_district_name_hi": dist_v["name_hi"],
                    "target_state": dist_v["state_code"],
                    "source_trade_id": u_tid,
                    "source_trade_name": trade_u["name"],
                    "source_trade_name_hi": trade_u["name_hi"],
                    "target_trade_id": v_tid,
                    "target_trade_name": trade_v["name"],
                    "target_trade_name_hi": trade_v["name_hi"],
                    "seats_to_shift": int(flow_amount),
                    "distance_km": dist_km,
                    "estimated_capex_savings_lakhs": est_savings_lakhs,
                    "rationale_en": f"Reallocate {flow_amount} underutilised seats from {dist_u['name']} to deficit hub {dist_v['name']}. Mitigates shortage with {dist_km} km transit radius, saving ₹{est_savings_lakhs} Lakhs in new centre capital expense.",
                    "rationale_hi": f"{dist_u['name_hi']} से {dist_v['name_hi']} में {flow_amount} कम उपयोग की गई सीटों का स्थानांतरण करें। {dist_km} किमी दायरे में कमी को पूरा करता है और ₹{est_savings_lakhs} लाख की पूंजी बचत करता है।"
                })

    # Sort recommendations by seat volume descending
    recommendations.sort(key=lambda x: x["seats_to_shift"], reverse=True)
    return recommendations
