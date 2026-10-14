export type Language = 'en' | 'hi';

export type UserRole = 'national_planner' | 'state_planner' | 'district_officer' | 'auditor';

export interface UserProfile {
  name: string;
  role: UserRole;
  title: string;
  scope: string;
  state_code?: string | null;
  district_lgd?: number;
  badge: string;
}

export interface OverviewKPIs {
  total_projected_demand: number;
  total_effective_supply: number;
  net_mismatch_gap: number;
  critical_shortage_trades: number;
  shortage_watch_trades: number;
  balanced_trades: number;
  oversupply_trades: number;
  monitored_districts: number;
  monitored_trades: number;
}

export interface SectorBreakdown {
  sector_id: string;
  sector_name: string;
  sector_name_hi: string;
  color: string;
  demand: number;
  supply: number;
  gap: number;
}

export interface StateSummary {
  state_code: string;
  state_name: string;
  districts_count: number;
  demand: number;
  supply: number;
  net_gap: number;
  critical_shortages: number;
}

export interface OverviewData {
  horizon_months: number;
  selected_state: string;
  data_origin: string;
  kpis: OverviewKPIs;
  severity_distribution: Record<string, number>;
  sector_breakdown: SectorBreakdown[];
  state_summaries: StateSummary[];
}

export interface RankingFactors {
  power_telemetry_contrib_pct: number;
  eway_bill_contrib_pct: number;
  postings_momentum_contrib_pct: number;
  bank_credit_contrib_pct: number;
  indirect_supply_chain_multiplier: number;
  leontief_boost_pct: number;
}

export interface RankingItem {
  rank: number;
  district_lgd: number;
  district_name: string;
  district_name_hi: string;
  state_code: string;
  trade_id: string;
  trade_name: string;
  trade_name_hi: string;
  sector_id: string;
  sector_name: string;
  sector_name_hi: string;
  sector_color: string;
  nco_code: string;
  nsqf_level: number;
  demand_p50: number;
  demand_p10: number;
  demand_p90: number;
  sanctioned_seats: number;
  effective_supply: number;
  net_gap: number;
  mismatch_ratio: number;
  severity_band: 'CRITICAL_SHORTAGE' | 'SHORTAGE_WATCH' | 'BALANCED' | 'OVERSUPPLY_WATCH' | 'CRITICAL_SURPLUS';
  severity_label: string;
  severity_label_hi: string;
  severity_color: string;
  confidence_score: number;
  factors: RankingFactors;
}

export interface DistrictSummary {
  lgd: number;
  state_code: string;
  name: string;
  name_hi: string;
  profile: string;
  lat: number;
  lng: number;
  signals: Record<string, number>;
  coverage_score: number;
  data_health: string;
  aggregate_demand: number;
  aggregate_supply: number;
  aggregate_gap: number;
  critical_shortages: number;
}

export interface RecommendationItem {
  id: string;
  source_district_lgd: number;
  source_district_name: string;
  source_district_name_hi: string;
  source_state: string;
  target_district_lgd: number;
  target_district_name: string;
  target_district_name_hi: string;
  target_state: string;
  source_trade_id: string;
  source_trade_name: string;
  source_trade_name_hi: string;
  target_trade_id: string;
  target_trade_name: string;
  target_trade_name_hi: string;
  seats_to_shift: number;
  distance_km: number;
  estimated_capex_savings_lakhs: number;
  rationale_en: string;
  rationale_hi: string;
}

export interface AlertItem {
  id: string;
  district_lgd: number;
  district_name: string;
  district_name_hi: string;
  state_code: string;
  trade_id: string;
  trade_name: string;
  trade_name_hi: string;
  severity_band: string;
  severity_label: string;
  severity_label_hi: string;
  severity_color: string;
  net_gap: number;
  mismatch_ratio: number;
  trigger_reason_en: string;
  trigger_reason_hi: string;
  status: string;
  consecutive_runs: number;
  timestamp: string;
}

export interface SimulationResult {
  district_lgd: number;
  district_name: string;
  district_name_hi: string;
  trade_id: string;
  trade_name: string;
  trade_name_hi: string;
  horizon_months: number;
  interventions: {
    seat_delta: number;
    economic_shock_pct: number;
  };
  baseline: {
    demand: number;
    effective_supply: number;
    sanctioned_seats: number;
    net_gap: number;
    mismatch_ratio: number;
    severity_band: string;
    severity_label: string;
    severity_label_hi: string;
    color: string;
  };
  simulated: {
    demand: number;
    effective_supply: number;
    sanctioned_seats: number;
    net_gap: number;
    mismatch_ratio: number;
    severity_band: string;
    severity_label: string;
    severity_label_hi: string;
    color: string;
  };
  narrative_en: string;
  narrative_hi: string;
}

export interface SourceItem {
  id: string;
  name: string;
  name_hi: string;
  owner: string;
  access_mode: string;
  granularity: string;
  cadence_days: number;
  last_synced: string;
  health: string;
  quality_score: number;
  quarantined_records: number;
  unit: string;
}

export interface AuditRecord {
  id: number;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  scope: string;
  details: Record<string, any>;
  prev_hash: string;
  entry_hash: string;
}
