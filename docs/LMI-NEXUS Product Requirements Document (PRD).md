# Kaushal Setu (कौशल सेतु): Product Requirements Document (PRD)

*Official Project Name: Kaushal Setu (कौशल सेतु) · Planning Code Name: LMI-NEXUS · SIH PS 26246 · MSDE · Version 1.0 · Companion to the SRS, Architecture, Design and Planning documents*

## 1. Product Overview

### 1.1 Vision

Give every skilling planner in India an early, trustworthy, district-level view of where labour demand is heading, so training seats follow jobs instead of chasing them.

### 1.2 Problem

India trains lakhs of candidates every year, but capacity is frequently misaligned with demand at the district and sector level. Some trades are chronically oversupplied; emerging trades stay under-served. Planners discover mismatches only after placement outcomes are reported, which is too late to change annual targets, NSQF course revisions or centre capacity. Existing data (PLFS, NCO-coded postings, hiring signals, e-Shram) is fragmented and rarely turned into a decision-ready form.

### 1.3 Solution in one paragraph

Kaushal Setu (कौशल सेतु) fuses observed demand (NCO-coded postings and registries) with leading economic signals (industrial power, freight, credit) and structural coefficients into one auditable **Composite Demand Index**. It compares the forecast with training seats by district and trade, ranks mismatches, raises early-warning flags, recommends where to shift seats, and delivers all of it through a multilingual, accessible dashboard and a Target Pack export that plugs into scheme target-setting.

### 1.4 What makes it different

| Differentiator | Why it matters to a planner |
| --- | --- |
| **Leading plus observed signals in one index** | Sees what is hiring now and what will hire in 3 to 6 months |
| **Explainable by construction** | Every number has a "Why?" breakdown and a run manifest; no black box, no generative text in the numbers |
| **Decision-ready output** | Ranked severity, plain-language recommendations, and a Target Pack for target-setting |
| **Honest about uncertainty** | P10-P90 ranges, confidence ratings, synthetic/low-coverage badges |
| **Built for government deployment** | Aggregated data only, audit trail, role and scope control, self-hosted, accessible, multilingual |

### 1.5 "AI-enabled": our position

The PS title says AI-enabled. LMI-NEXUS uses **explainable AI and operations research**, not generative AI: regularised statistical learning for signal-to-output nowcasting, empirical-Bayes shrinkage for sparse districts, anomaly detection for data quality, deterministic fuzzy matching for taxonomy mapping, Monte Carlo for uncertainty, and min-cost flow optimisation for reallocation. Reason: government policy numbers must be reproducible and auditable. A governed, optional gradient-boosting nowcaster with feature-attribution explanations is on the Full roadmap.

## 2. Goals, Non-Goals and Success Metrics

### 2.1 Goals

1. Cover **every** requirement and expected outcome of PS 26246 with evidence a jury can see.
2. Demonstrate an end-to-end story: signal change → demand → gap → ranked flag → recommendation → exported target.
3. Show production-grade thinking: security, accessibility, governance, testing, deployability.
4. Keep the design extensible from 3 pilot states to the whole country without re-architecture.

### 2.2 Non-goals

- Matching individual candidates to jobs; any person-level data.
- Scraping job portals; using generative AI to produce numbers.
- Replacing the judgement of planners: the system recommends and explains, humans decide.
- Real-time (sub-minute) streaming; the cadence is monthly, with the ability to run more often.

### 2.3 Success metrics

| Layer | Metric | Target |
| --- | --- | --- |
| Hackathon | PS requirements demonstrably covered | 5 of 5 description items and 5 of 5 expected outcomes |
| Hackathon | Live demo reliability | Zero manual fixes during the scripted demo; offline fallback ready |
| Hackathon | Security evidence | Register items marked M implemented; short evidence pack shown |
| Hackathon | Accessibility evidence | Zero critical axe violations; keyboard walkthrough shown |
| Product | Time to find top-5 shortage districts for a state | Under 60 seconds, untrained |
| Product | Forecast quality (on real data, Phase 1) | WAPE better than last-year and trend baselines at state × sector |
| Product | Early-warning precision (Phase 1) | At least 60% of flags confirmed within 6 months (to be validated) |
| Product | Data freshness | Every source within 1.5 × its cadence |
| Product | Planner adoption (pilot) | Weekly active planners in each pilot state; at least one Target Pack used per cycle |
| Platform | Availability and latency | 99.9%, p95 under 200 ms for reads |

## 3. Users and Personas

Personas are illustrative composites for design purposes, not real individuals.

| Persona | Role | Job to be done | Pain today | What success looks like |
| --- | --- | --- | --- | --- |
| **Meera** | National Planner, MSDE/NCVET | Set national and state-wise annual training targets and prioritise schemes | Fragmented reports; mismatches found after outcomes; no common index | Ranked view across states and trades, a defensible number for every target, export into the target-setting workflow |
| **Rajesh** | State Planner, State Skill Development Mission | Allocate seats across districts and approve new centres | Cannot see which districts will need which trades; relies on anecdote | A short list of districts and trades to act on, with reasons and a seat-shift recommendation |
| **Farida** | District Skill Officer | Run centres, advise trainees, report to the state | Learns of shortages from employers too late | Early alerts for her district and plain-language guidance in her language |
| **Vikram** | Sector Skill Council analyst | Align curricula and QPs with industry needs | No cross-state view of sector demand | Sector view across states, trend of demand index, evidence for QP revisions (Full) |
| **Anil** | Data Steward / Admin | Keep sources healthy and trusted | Silent data failures | Source health page, quality reports, controlled approval of parameters |
| **Auditor** | Internal or external reviewer | Verify numbers and access | No trail | Read-only manifests and audit log |

## 4. Key Scenarios

**S1. Annual target-setting (Meera).** Opens the national overview for the 12-month horizon, sees critical shortage clusters in two sectors, opens the ranking for Welding and CNC Operators, notices three states with the highest shortage severity, opens one state, reads the "Why?" (power load up, e-way bills up, postings rising), exports the Target Pack for the planning workflow.

**S2. Mid-cycle correction (Rajesh).** Receives an alert that a district's severity moved from Balanced to Shortage watch for two runs. Opens the recommendation: shift seats from an oversupplied adjacent district, with cost and gap reduction. Runs a what-if (+30 seats) and sees the band return to Balanced. Exports and shares the link.

**S3. Local guidance (Farida).** Opens the app in Hindi, sees her district's top three shortage trades and the alert history, and uses the plain-language text in a review meeting.

**S4. Trust and audit (Anil, Auditor).** Anil sees a source gone stale, reads the quality report, re-runs after correction. The Auditor opens the run manifest and verifies that the parameter set was approved by a second person.

## 5. Product Principles

1. **Explain every number.** No metric without its "Why?", source and confidence.
2. **Decision first.** Lead with what to do, then show the evidence.
3. **Honesty about data.** Synthetic, low-coverage and stale data are always visible.
4. **Boring where it counts.** Deterministic, reproducible, auditable core.
5. **Accessible and multilingual by default**, not as an afterthought.
6. **Secure and private by design**: aggregates only, least privilege, full audit.

## 6. Feature Set and Release Scope

| # | Feature | User value | MVP | Full | SRS reference |
| --- | --- | --- | --- | --- | --- |
| F1 | Source registry, ingestion, quality gates, quarantine | Trust in inputs | Provided dataset, public data, synthetic telemetry, file adapters | Live connectors, Dagster, backfill, bulk upload UI | FR-ING, FR-DQ |
| F2 | Taxonomy mapping (NCO, NSQF, NIC, LGD) | One common language across sources | Rules + alias + fuzzy, coverage report | Steward review workflow | FR-TAX |
| F3 | Composite Demand Index | Single index from heterogeneous sources | Fusion, Leontief, shrinkage, Monte Carlo, explanation | Backtest-calibrated weights, drift monitor | FR-FC |
| F4 | Supply and capacity model | Compare demand with seats | Seats, throughput, absorption | Centre-level capacity planning | FR-SUP |
| F5 | Gap, severity, ranking | Know where to act first | Five bands, rankings, roll-ups | Custom thresholds per scheme | FR-GAP |
| F6 | Early-warning alerts | Act before outcomes arrive | In-app alerts with persistence rule | Subscriptions, notifications, acknowledgement | FR-EW |
| F7 | Reallocation recommendations | Concrete seat-shift advice | Min-cost flow, plain language | Constraint editing, expansion candidates | FR-RA |
| F8 | What-if simulation | Test decisions before making them | Seat change, signal scaling | Saved scenarios, comparison | FR-SIM |
| F9 | Dashboard with drill-down and map | Navigate national to district | Overview, drill-down, ranking, district detail, Why?, map | Saved views, print, comparison, backtest page | FR-UI |
| F10 | API and exports | Feed target-setting workflows | OpenAPI, CSV/XLSX/PDF, Target Pack | API keys, webhooks, integrations | FR-API |
| F11 | Multilingual and accessible UI | Usable by state units | English + Hindi; WCAG 2.1 AA | All languages; GIGW audit | FR-LOC, FR-ACC |
| F12 | Security, roles, audit | Safe for government use | Roles, scope, MFA for privileged, audit chain | OIDC SSO, RLS, SIEM, pen test | FR-AUTH, FR-GOV |
| F13 | Governance of model parameters | Defensible methodology | Versioned sets, four-eyes, manifests | Governance UI, overrides, lineage | FR-GOV |
| F14 | Methodology and source-health pages | Transparency | Both pages | Public methodology portal | FR-UI-12, 13 |

## 7. Epics and User Stories

Priority: **M** MVP, **S** stretch, **F** Full.

### E1. Data and trust

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-101 | As a Data Steward, I want to see which sources are fresh, stale or missing so that I can act on failures | Health page lists each source with last load and status; stale after 1.5 × cadence | M | FR-DQ-06 |
| US-102 | As a Data Steward, I want bad records quarantined with reasons so that nothing is silently lost | Rows in = loaded + quarantined; reasons shown | M | FR-DQ-02 |
| US-103 | As a planner, I want to know if a value is synthetic so that I do not over-trust it | Badge on every derived value in UI, API, exports | M | BR-07 |
| US-104 | As a Data Steward, I want to add a new file source with configuration only | New source works via adapter config; no core change | M | FR-ING-05 |
| US-105 | As a Data Steward, I want to approve new aliases so that mapping improves | Approved alias applies next run | F | FR-TAX-04 |

### E2. Forecasting and explanation

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-201 | As a planner, I want 3, 6 and 12-month forecasts per district and trade so that I can plan different cycles | All cells and horizons present | M | FR-FC-01 |
| US-202 | As a planner, I want a range and a confidence rating so that I know how much to rely on a number | P10-P90 and High/Medium/Low with reasons | M | FR-FC-09, 10 |
| US-203 | As a planner, I want a "Why?" breakdown so that I can defend a target | Contributions by tier and signal sum to demand | M | FR-FC-11 |
| US-204 | As an Auditor, I want a run manifest so that I can reproduce a number | Manifest with parameter set, code revision, input hashes | M | FR-FC-13 |
| US-205 | As a Model Governor, I want parameter sets approved by a second person so that coefficients cannot be changed unilaterally | Self-approval refused; approved sets immutable | M | FR-GOV-01 to 03 |
| US-206 | As a planner, I want to see backtest metrics so that I can judge accuracy | Metrics page labelled "on provided data" | S | FR-FC-14 |

### E3. Gaps, ranking and alerts

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-301 | As a planner, I want trades and districts ranked by severity so that I know where to act first | Ranking by severity with absolute-gap tie-break; roll-ups consistent | M | FR-GAP-03, 04 |
| US-302 | As a planner, I want five clearly labelled bands so that I can read status at a glance | Band by label, icon and colour | M | FR-GAP-02 |
| US-303 | As a district officer, I want alerts for my district so that I hear early | Alerts scoped to district; persistence rule applied | M | FR-EW-01 to 05 |
| US-304 | As a state planner, I want to acknowledge and assign alerts so that follow-up is tracked | Status and audit entry | F | FR-EW-06 |
| US-305 | As a planner, I want email or SMS for new critical alerts so that I do not need to log in | Notification delivered | F | FR-EW-07 |

### E4. Recommendations and what-if

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-401 | As a state planner, I want a recommendation of where to shift seats so that I can reduce a gap without new centres | Source, destination, units, gap reduction, cost, confidence | M | FR-RA-02, 03 |
| US-402 | As a planner, I want recommendations in my language so that I can share them locally | EN and HI template text | M | FR-RA-04 |
| US-403 | As a planner, I want to change seats and see the new band so that I can test a decision | Result under 500 ms; labelled simulation | M | FR-SIM-01 |
| US-404 | As a planner, I want to scale a signal such as industrial load so that I can test a scenario | Demand change matches engine | M | FR-SIM-02 |
| US-405 | As a planner, I want to edit constraints and compare scenarios | Re-solve and side by side | F | FR-RA-06, FR-SIM-05 |

### E5. Dashboard and navigation

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-501 | As a national planner, I want an overview with KPIs and top shortages so that I get the picture in one screen | Widgets from current run | M | FR-UI-01 |
| US-502 | As a planner, I want to drill down from national to trade with breadcrumbs so that I can follow a thread | URL reproduces the view | M | FR-UI-02 |
| US-503 | As a planner, I want a map linked to the list so that I see geography | Selection syncs both ways | M | FR-UI-03 |
| US-504 | As a planner, I want filters by state, sector, scheme, level and horizon so that I focus | Combined filters work | M | FR-UI-10 |
| US-505 | As a planner, I want to share a link to my view so that colleagues see the same thing | Shareable URL respecting their permissions | M | FR-UI-02 |
| US-506 | As a planner, I want to compare two districts | Side-by-side view | F | FR-UI-15 |
| US-507 | As a planner, I want to read the methodology in the product so that I can trust it | Methodology page reviewed by an expert | M | FR-UI-13 |

### E6. API and export

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-601 | As a planner, I want to export a ranking to Excel so that I can use it in my own workflow | Content equals the view; formula-safe | M | FR-API-05 |
| US-602 | As a national planner, I want a Target Pack so that forecasts feed target-setting | Documented schema; recommended seats per district and trade | M | FR-API-07 |
| US-603 | As an integrator, I want a documented API so that I can connect scheme systems | OpenAPI published | M | FR-API-01 |
| US-604 | As an integrator, I want API keys and webhooks | Scoped keys; signed webhooks | F | FR-API-09, 10 |

### E7. Access, security and language

| ID | Story | Acceptance criteria | Pri | SRS |
| --- | --- | --- | --- | --- |
| US-701 | As an Admin, I want role- and scope-based access so that users only see what they should | Authorisation matrix passes | M | FR-AUTH-03 |
| US-702 | As an Admin, I want a second factor for privileged roles | TOTP enforced | M | FR-AUTH-04 |
| US-703 | As an Auditor, I want a tamper-evident log | Chain verification passes | M | FR-GOV-05 |
| US-704 | As a state user, I want the UI in Hindi (and later my state's language) | Complete EN and HI | M | FR-LOC-02 |
| US-705 | As a user with a disability, I want to operate everything by keyboard and screen reader | WCAG 2.1 AA; map alternative | M | FR-ACC-01, 02 |
| US-706 | As a planner, I want single sign-on with my government account | OIDC login | F | FR-AUTH-08 |

## 8. Release Plan

| Release | Scope | Exit criteria |
| --- | --- | --- |
| **R0: MVP (hackathon)** | F1 to F14 at MVP level; 3 states, 5 sectors, about 40 trades; provided and synthetic data | All AT-01 to AT-15 scenarios pass; demo script runs clean |
| **R1: Pilot** | Real adapters for open sources and one or two MoU feeds; backtests on real data; governance UI; alerts with notifications; third and fourth language | Backtest beats baselines; penetration test passed; planner UAT in 2 to 3 states |
| **R2: National** | All states and UTs; HA deployment; SSO; API keys and webhooks; scheme integrations | SLOs met for 3 months; GIGW audit and STQC clearance |
| **R3: Evolution** | Governed ML nowcaster with attributions; scenario library; informal-sector survey inputs; sector-council views | Approved through the governance process; measured gain over R2 |

## 9. Measurement and Instrumentation

Product analytics are **first party and privacy-preserving**: no third-party SDKs, no personal identifiers in analytics events, aggregated counts only.

| Question | Signal |
| --- | --- |
| Do planners reach insight quickly? | Time from login to first drill-down; use of Why? drawer |
| Are recommendations used? | Exports of Target Pack; recommendation views |
| Is the system trusted? | Share of views with Low confidence; support questions about numbers |
| Is the data healthy? | Source freshness, quarantine rate, mapping coverage |
| Is the model good? | WAPE, rank correlation, interval coverage, alert precision |
| Is it fast and available? | p95 latency, error rate, availability |

## 10. Landscape and Differentiation

| Reference system | What it does well | Gap relative to this PS | LMI-NEXUS response |
| --- | --- | --- | --- |
| National Career Service (NCS) | Official postings and registrations | Portal-centric; limited forward view and training-capacity linkage | Uses NCS as a coincident input and adds leading signals and supply |
| e-Shram | Unorganised-worker registry | Registry, not a demand forecast | Aggregated as labour-pool input |
| Skill India Digital Hub | Candidate and training hub | Operational platform, not a planning engine | Supplies capacity data; consumes Target Pack |
| Lightcast, LinkedIn Economic Graph | Rich postings analytics | Commercial, posting-based, white-collar bias, not auditable for policy | Hybrid index, explainable, government-owned |
| CEDEFOP Skills Intelligence | Mature skills forecasting | European data and context | Methodological reference; adapted to NCO/NSQF/LGD |
| O\*NET | Occupation detail | US taxonomy | Taxonomy inspiration only; NCO is the standard here |

## 11. Hackathon Strategy

### 11.1 Judging lens

| What juries typically look for | How we show it |
| --- | --- |
| Problem understanding | Open with the planner's lag problem and the PS requirement map |
| Innovation | Hybrid index with leading telemetry; reallocation optimisation; explainability |
| Feasibility | Runs on provided dummy data; clear path to real feeds; stack proven and self-hostable |
| Technical depth | Methodology page, run manifest, tests, security evidence |
| Impact and scalability | Pilot-to-national architecture split; Target Pack for target-setting |
| UX and accessibility | Bilingual, keyboard-operable, "Why?" drawer, honest badges |
| Completeness | All five description items and five outcomes demonstrated |

### 11.2 Demo script (7 minutes)

| Time | Beat | Show |
| --- | --- | --- |
| 0:00 | The problem in one sentence | Planner learns of mismatch after outcomes arrive |
| 0:40 | Overview | KPIs, band distribution, top shortages, alerts |
| 1:30 | Drill-down | National → pilot state → district → trade; map and list in sync |
| 2:30 | Why? | Contributions: postings, power load, e-way bills; confidence and freshness |
| 3:30 | Recommendation | Seat shift between two districts; cost and gap reduction |
| 4:15 | What-if | +20% industrial load or +30 seats; band changes; labelled simulation |
| 5:00 | Export | Target Pack CSV and PDF; methodology footnote |
| 5:30 | Trust | Source health, quality report, run manifest, audit log |
| 6:15 | Language and access | Switch to Hindi; keyboard-only navigation |
| 6:45 | Roadmap and close | MVP versus Full; security posture; ask |

### 11.3 Likely questions and answers

| Question | Answer |
| --- | --- |
| Where is the AI? | Explainable statistical learning and optimisation: regularised nowcasting, empirical Bayes, anomaly detection, Monte Carlo, min-cost flow. We exclude generative AI from numbers so that every figure is reproducible and auditable. |
| How accurate is it? | The protocol is built in (rolling backtests against last-year, trend and postings-only baselines). On the provided data we show the metrics labelled as such; real-data accuracy is a Phase 1 deliverable. |
| Is the telemetry real? | In the MVP, leading signals are synthetic and labelled so; the system is designed for MoU feeds (DISCOM, GSTN) and public sources, and works with reduced coverage and lower confidence when they are absent. |
| Why not scrape job portals? | Fragile, legally uncertain and white-collar biased. Postings enter through the dataset, NCS and licensed feeds, with coverage factors. |
| What if data is missing or wrong? | Quality gates, quarantine, anomaly flags, reweighting with lower confidence, and publishing is blocked on severe failures. |
| How is it secured? | Role and scope enforcement, MFA for privileged roles, tamper-evident audit, aggregates only, hardened containers, scanned dependencies; the register lists 40 controls with MVP and Full phases. |
| Can it scale nationally? | Stateless API, partitioned data, snapshot reads; about 350,000 cells per run, which is small for PostgreSQL. |
| How do planners trust a number? | The Why? drawer, confidence rating, P10-P90 range and the run manifest. |
| How does it feed our workflows? | Target Pack export now; API keys and webhooks in Full. |

## 12. Rollout and Change Management (Full)

1. **Pilot** with two or three State Skill Development Missions; a named data steward in each; fortnightly feedback sessions.
2. **Training:** a 60-minute onboarding in the state's language, a one-page quick guide, and in-product methodology.
3. **Governance:** a small review board (MSDE, NCVET, SSC, state) approves parameter sets and band thresholds yearly.
4. **Support:** documented issue path, response targets, data-owner escalation contacts.
5. **Feedback loop:** usage metrics plus planner interviews feed the roadmap.

## 13. Assumptions, Dependencies and Risks

| Item | Detail | Mitigation |
| --- | --- | --- |
| Data access | Restricted sources require data-sharing agreements | Start requests early; synthetic fallback; reduced-coverage mode |
| Methodology acceptance | Domain experts may question coefficients | Published methodology, sensitivity analysis, governance board |
| Adoption | Planners may distrust new tools | Explainability, pilot co-design, training |
| Taxonomy complexity | Crosswalks are many-to-many | Weighted mapping, coverage reporting |
| Time | Hackathon limits scope | M/S/F tiers and the cut list |
| Dependency | Dummy dataset timing and schema | Adapter abstraction; synthetic equivalent |

## 14. Open Questions

1. Which three states and five sectors best match the provided dataset?
2. What are the planners' actual severity thresholds, absorption rates and mobility caps?
3. Which scheme target-setting file format should the Target Pack match?
4. Which regional languages are priority after Hindi?
5. Who owns each restricted data source, and what is the data-sharing process?
