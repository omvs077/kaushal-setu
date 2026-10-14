# Kaushal Setu (कौशल सेतु): System Architecture & Engineering Design

*Official Project Name: Kaushal Setu (कौशल सेतु) · Planning Code Name: LMI-NEXUS · SIH PS 26246 · MSDE · Labour Market Intelligence & Skill Demand-Supply Forecasting Engine · Version 1.0 (design baseline) with Part II (v2 revisions)*

# Part I: Design Baseline

## 1. Architecture Summary

**What we are building:** a governed analytics platform that turns leading economic signals into district-level skill demand forecasts, compares them to training supply (PMKVY/ITI/NCVET seats), ranks mismatches, and recommends seat reallocation, all with an audit trail a government planner can defend.

**Key architectural decisions**

| # | Decision | Why |
|---|---|---|
| 1 | **Modular monolith + separate batch pipeline** (not microservices) | Small team, one domain, strong transactional needs. Modules have clean boundaries so they can be split later. |
| 2 | **Offline compute, online serving**: forecasts are computed in scheduled "runs", published as immutable versioned snapshots, and the API only reads snapshots | Gives sub-10 ms reads, reproducibility, and a clean audit story. The API never recomputes on request. |
| 3 | **Medallion data layers** (raw → clean → core → marts) in PostgreSQL + object storage | Lineage, replay, and re-computation when coefficients change. |
| 4 | **Deterministic core with explicit uncertainty**: Leontief + min-cost flow, plus confidence bands | Keeps "zero hallucination, fully auditable", but admits data error honestly. |
| 5 | **Security by design**: OIDC SSO, RBAC + state/district scoping, immutable audit log, aggregated data only (no personal data in the analytics path) | Government deployment, DPDP Act 2023, CERT-In, STQC audit readiness. |
| 6 | **Two deployment profiles**: Docker Compose on one VM (hackathon demo) and Kubernetes on a MeitY-empanelled cloud/NIC (production) | Same containers, different orchestration. |

## 2. Review of the Current Blueprint: What to Keep, What to Fix

The ECPSF idea is strong. These are the points a technical jury (or a real MSDE data team) will probe. Fixing them in the design makes the project far more credible.

| Issue | Risk | Recommended fix |
|---|---|---|
| **Data access is assumed.** District-level GST e-way bill data and DISCOM industrial load are not freely available via open APIs; they are held by GSTN and individual DISCOMs. | Pipeline has no data on day one. | Build a **Source Registry** with an access mode per source (open API / bulk file / MoU required / synthetic). Ship adapters for open sources (PLFS, ASI, RBI DBIE, Udyam, PMKVY/NCS/Skill India data, VAHAN, Grid-India state-level) and **pluggable adapters + a documented data-sharing request** for restricted ones. Confirm each source's availability with its owner before claiming it. |
| **"Predicts 3-6 months ahead"** is a claim, not a result. | Unprovable in a demo. | Add a **backtesting module**: replay historical signals, compare predicted vs observed employment/PLFS/EPFO changes, publish lead-time and error metrics per sector. Show them in the UI. |
| **Leontief is a static, demand-side model.** Coefficients (A) are national, and I-O tables are periodic. | District outputs can be wrong in a structured way. | Treat A and the sector-to-occupation matrix B as **versioned, approved parameters** with sensitivity analysis and Monte Carlo bands. Localise with location quotients using district sector employment (Economic Census/PLFS/ASI). |
| **Missing nowcasting step.** Telemetry (kWh, tonnes moved) is not output growth. | Unit mismatch between signals and matrix input. | Add a **Signal-to-Output layer**: seasonally adjusted, lag-aware elasticities (ridge/elastic-net, calibrated on history). Still explainable and deterministic given a fixed training set. |
| **Max-flow is not the right objective.** Max-flow ignores cost, distance, willingness to move, and trade compatibility. | Recommendations can be unrealistic. | Use **min-cost max-flow** (transportation problem) with edge cost = travel time/cost, capacity = realistic mobility or seat cap, and a trade-compatibility mask. NetworkX for prototype, OR-Tools/HiGHS for scale. |
| **"Sub-10 ms" drill-down.** True only for precomputed reads. | Missed expectation if computing live. | Serve from materialised snapshot tables + Redis. Keep what-if simulations as a separate async/short-latency endpoint (target < 500 ms). |
| **Two conflicting palettes** (light Neumorphic-Lite and a dark Spotify/cyan scheme) appear in the document. | Inconsistent design system. | Standardise on the **light Neumorphic-Lite tokens**; keep a dark theme as an optional token set, not a second design. |
| **Neumorphism contrast risk.** Soft shadows with low contrast fail accessibility. | Fails GIGW/WCAG for a government product. | Use neumorphic styling for decoration only; all text, controls and chart marks must meet **WCAG 2.1 AA** contrast and have visible focus states. |

## 3. Requirements

### 3.1 Functional (mapped to the 8 PS outcomes)

| PS outcome | System capability | Component |
|---|---|---|
| Aggregate & normalise demand signals | Source registry, ingestion adapters, validation, canonical schemas | Ingestion pipeline |
| Cross-reference demand vs training capacity | Supply model joined to demand by district × trade (NCO/NSQF) | Core warehouse, Gap engine |
| Forward-looking forecasts, periodic | Scheduled runs with 3/6/12-month horizons | Forecast engine |
| Rank by severity | Severity Index per district × trade, with confidence | Gap engine |
| Interactive dashboard, national→district drill-down | Next.js app + map | Frontend |
| Early-warning flags | Rules/threshold alert service, notifications | Alert service |
| API/export for target-setting | Versioned REST API, async PDF/Excel/CSV export | API + Export worker |
| Multilingual, accessible UI | i18n (EN, HI + regional), WCAG 2.1 AA, GIGW 3.0 | Frontend |

### 3.2 Non-functional targets

| Area | Target |
|---|---|
| Read latency (dashboard APIs) | p95 < 200 ms; cached drill-down p95 < 50 ms |
| What-if simulation | p95 < 500 ms for one district; < 5 s for state-wide |
| Forecast run (national, ~780 districts × ~150 trades) | < 15 min end to end |
| Availability | 99.9% (production), planned maintenance windows outside working hours |
| Data freshness | Per source SLA, shown in the UI ("last updated") |
| Reproducibility | Any published number can be regenerated from its run manifest |
| RPO / RTO | RPO ≤ 15 min, RTO ≤ 4 h |
| Scale (initial) | ~200 concurrent planners; read-heavy |

### 3.3 Users and roles

| Role | Scope | Capabilities |
|---|---|---|
| National Planner (MSDE) | All states | View everything, run what-if, approve model versions, export |
| State Planner (SSDM) | Own state | View/export own state, what-if in own state |
| District Officer | Own district | View, acknowledge alerts, comment |
| Data Steward | Source/pipeline | Manage sources, review quality failures, upload bulk files |
| Model Governor | Model parameters | Propose/approve coefficient sets (four-eyes rule) |
| Auditor (read-only) | All, incl. logs | Read run manifests and audit trail |
| Platform Admin | Infrastructure | No access to business data by default (break-glass only) |

## 4. System Architecture

### 4.1 Logical view

```
  USERS (browser)                         EXTERNAL DATA OWNERS
     │ HTTPS                              (Grid-India/DISCOMs, GSTN, RBI, MoSPI,
     ▼                                     NSDC, NCS, e-Shram, Udyam, VAHAN ...)
┌─────────────┐                                    │ API / SFTP / bulk files
│ CDN + WAF   │                                    ▼
└─────┬───────┘                      ┌─────────────────────────────┐
      ▼                              │  INGESTION & ORCHESTRATION  │
┌─────────────┐   OIDC               │  Dagster + source adapters  │
│ Next.js 15  │◄────────► Keycloak   │  validation, quarantine     │
│ (SSR + BFF) │                      └──────────────┬──────────────┘
└─────┬───────┘                                     ▼
      │ REST/SSE                    ┌────────────────────────────────┐
      ▼                             │ OBJECT STORE (raw, immutable)  │
┌─────────────────────┐             └──────────────┬─────────────────┘
│ API (FastAPI)       │                            ▼
│ modular monolith    │◄──reads──┐   ┌────────────────────────────────┐
│ authz, audit, export│          └───│ POSTGRES + PostGIS             │
└───┬─────────┬───────┘              │ raw→clean→core→marts, audit    │
    │         │                      └──────────────┬─────────────────┘
    ▼         ▼                                     ▲ writes snapshots
  Redis    Job queue ──► Workers ──► ┌──────────────┴─────────────────┐
 (cache,   (exports,      (PDF/XLSX) │ FORECAST ENGINE (batch)        │
  limits)   what-if)                 │ signals→output→Leontief→gap→flow│
                                     └────────────────────────────────┘
   Observability: OpenTelemetry → Prometheus / Loki / Tempo / Grafana, Sentry
```

### 4.2 Component responsibilities

| Component | Responsibility | Tech |
|---|---|---|
| Edge | TLS termination, WAF, DDoS, static assets | Cloud WAF + CDN (or NIC equivalent) |
| Frontend/BFF | UI, SSR, session handling (HttpOnly cookies), server-side calls to the API | Next.js 15, React 19 |
| Identity | SSO, MFA, tokens, role claims | Keycloak (OIDC), optionally NIC/Parichay SSO federation |
| API service | Authz, read APIs, what-if, alerts, export jobs, audit logging | FastAPI, Pydantic v2 |
| Orchestrator | Scheduling, dependencies, retries, lineage | Dagster (or Airflow) |
| Forecast engine | Pure-function computation library, run manifests | NumPy, SciPy, pandas/Polars, OR-Tools/NetworkX |
| Workers | Long-running jobs (exports, what-if batches) | Arq/Celery on Redis |
| Database | System of record, geospatial, snapshots | PostgreSQL 16 + PostGIS |
| Cache | Hot snapshot reads, rate limits, job state | Redis 7 |
| Object store | Raw files, model artefacts, exports | S3-compatible (MinIO/cloud) |
| Observability | Metrics, logs, traces, alerts | OpenTelemetry stack |

## 5. Data Pipeline

### 5.1 Source registry

Every source is a row in `ref.source` with: owner, access mode, format, refresh cadence, geography grain, licence/MoU status, quality score, and an adapter name. The UI shows source health. *Availability below is the design assumption; confirm with each owner.*

| Signal group | Example sources | Grain / cadence | Access mode |
|---|---|---|---|
| Energy | Grid-India/state load despatch (state level); DISCOM industrial feeder data | State daily; district monthly (needs DISCOM data sharing) | Open (state), MoU (district) |
| Logistics | GSTN e-way bill aggregates; VAHAN commercial-vehicle registrations; port/rail freight stats | District/sector monthly | MoU (GSTN), open (VAHAN dashboards) |
| Credit & enterprise | RBI district credit statistics; Udyam registrations; MUDRA/PMMY disbursals | District quarterly/monthly | Open/bulk |
| Employment structure | PLFS, Economic Census, ASI | State/district annual | Open/bulk |
| Economic structure | MoSPI National Accounts I-O tables | National, periodic | Open |
| Training supply | Skill India Digital, PMKVY, ITI (DGT), NCVET awarding bodies | Centre/district monthly | Government MoU/API |
| Labour registry (aggregated) | NCS, e-Shram | District, aggregated only | MoU |
| Geography & transport | LGD district codes, district boundaries, rail/highway network | Static, annual | Open |

**Fallback rule:** if a leading signal is missing, the engine degrades gracefully by reweighting available signals, lowers the confidence score, and shows a "reduced signal coverage" badge. It never silently imputes.

### 5.2 Pipeline stages

```
[1 EXTRACT] adapter pulls file/API → store untouched in object store (raw/, checksum, timestamp)
[2 VALIDATE] schema + range + freshness + duplicate checks (pandera / Great Expectations)
             fail → quarantine + alert Data Steward; pass → continue
[3 STANDARDISE] map to LGD district codes, NIC-2008 sector, NCO-2015/NSQF trade codes;
             unit conversion; calendar alignment (monthly)
[4 CLEAN tables] typed, deduplicated, versioned by load_id
[5 FEATURES] seasonal adjustment (STL/X-13), YoY and MoM change, rolling z-scores,
             outlier flags (robust MAD), coverage score
[6 FORECAST RUN] see section 6; produces run_id with manifest
[7 PUBLISH] validation gates pass → mark run 'published' (atomic pointer switch);
             refresh materialised views, warm Redis, trigger alert evaluation
[8 NOTIFY] alerts to subscribed planners (in-app SSE, email)
```

**Pipeline principles**

- **Idempotent and replayable:** every stage keyed by `(source, period, load_id)`; re-running produces identical outputs.
- **Immutable raw layer:** corrections are new loads, never overwrites.
- **Data contracts:** each adapter output has a versioned schema; breaking changes fail CI.
- **Quarantine, don't drop:** bad records go to `quarantine.*` with the reason code.
- **Backfill support:** a parameterised run can recompute any past period with the coefficient set that was valid then (or a new one, for comparison).
- **Lineage:** every published number links to run → inputs → source loads (Dagster asset lineage + `core.run_manifest`).

## 6. Forecast and Analytics Engine

The engine is a pure, versioned Python library (`nexus_engine`) with no database or network calls inside the math. It takes arrays in and returns arrays out, which makes it trivially testable and auditable.

### 6.1 Stages

1. **Signal normalisation.** For each district *d*, signal *s*, month *t*: seasonally adjust, compute growth `g(d,s,t)`, standardise against the district's own history.
2. **Signal-to-output nowcast.** Sector output growth `ΔY(d,k)` = Σ over signals of `β(k,s,lag) · g(d,s,t-lag)`. The coefficients β are fitted offline (ridge/elastic net), frozen, versioned and approved. Lags 1-6 months give the lead time.
3. **Leontief demand expansion.** With technical-coefficient matrix **A** (sector × sector), total required output change is `ΔX = (I − A)⁻¹ · ΔY`. Pre-compute and cache the Leontief inverse `L = (I − A)⁻¹` per coefficient version; use a linear solve rather than explicit inversion if A changes.
4. **Occupation conversion.** Manpower requirement per district: `M(d) = B_d · ΔX(d)`, where **B** (occupation × sector) comes from PLFS/ASI employment-per-output ratios and is localised by location quotient so a district's sector mix is respected. Occupations are mapped to NCO-2015 and then to NSQF trades/job roles.
5. **Supply model.** Per district × trade: current seats, enrolment, certification throughput by course duration (so a 6-month course started now yields workers in 6 months), historical placement rate, attrition. Projected supply at horizon *h* = pipeline output + expected new batches.
6. **Gap and Severity Index.** `Gap(d,trade,h) = Demand − Supply`. `Severity = Gap / max(Demand, ε)` scaled to −1…+1, then bucketed. Bucket thresholds are configuration, not code, and are approved like model parameters.

| Band | Meaning | Colour token |
|---|---|---|
| Critical deficit | Severity above the deficit threshold | `status-alert` |
| Approaching saturation | Surplus nearing threshold | `status-warning` |
| Balanced | Within tolerance | `status-optimal` |

7. **Reallocation (min-cost flow).** Nodes are districts; edges follow rail/highway links with `cost = travel time/cost`, `capacity = min(surplus, receiving seats or mobility cap)`; edges exist only between trade-compatible nodes. Solve per trade (or per trade cluster). Output: a ranked list of recommended seat shifts or mobility corridors, each with expected gap reduction and cost.
8. **Uncertainty.** Monte Carlo (e.g. 500 draws) perturbing β, A and B within their documented error bands; publish P10/P50/P90. A recommendation is shown as "high confidence" only if the sign of the gap is stable across draws.
9. **Explanation payload.** For each output, store the contribution breakdown: which signals, which sectors, which matrix rows drove the number. The UI's "Why?" drawer renders this directly; plain-English text comes from **templates** filled with these numbers, so there is no free-text generation.

### 6.2 Model governance

- Coefficient sets (A, B, β, thresholds) are rows in `model.param_set` with status `draft → under_review → approved → retired`. Approval requires a second person (four-eyes).
- A published run records `param_set_id`, code git SHA, input load IDs and a content hash. Same inputs + same version = byte-identical outputs (enforced in CI by a golden-file test).
- Scheduled **backtests** and **drift checks** (signal distribution, residuals) run after each load; failures block publish and alert the Model Governor.
- Human-in-the-loop: planners can attach a documented **override** (e.g. a known upcoming plant closure). Overrides are stored separately, flagged in the UI and never mutate the base run.

## 7. Data Model

### 7.1 Schemas

| Schema | Purpose |
|---|---|
| `ref` | Reference data: districts (LGD), sectors (NIC), occupations (NCO), trades (NSQF), sources, corridors |
| `raw` / `quarantine` | Landed and rejected records, with load metadata |
| `core` | Standardised signals, employment structure, training supply, runs, manifests |
| `model` | Parameter sets, approvals, backtest results |
| `mart` | Published snapshots optimised for reads |
| `app` | Users' alert subscriptions, saved views, comments, overrides, export jobs |
| `audit` | Append-only audit events |

### 7.2 Key tables

| Table | Key columns | Notes |
|---|---|---|
| `ref.district` | `lgd_code`, `state_code`, `geom` (PostGIS MultiPolygon), `centroid` | GiST index on geometry; boundaries simplified per zoom level |
| `core.signal_obs` | `district_id, signal_id, period, value, source_load_id, quality_flag` | Partitioned by period (monthly) |
| `core.training_supply` | `district_id, trade_id, scheme, centre_id, seats, enrolled, certified, period` | Partitioned by period |
| `core.run` | `run_id, horizon, param_set_id, code_sha, input_hash, status, published_at` | One "current" pointer per scope |
| `mart.gap_snapshot` | `run_id, district_id, trade_id, horizon, demand_p10/p50/p90, supply, gap, severity, band, confidence` | Primary read table; indexes on `(run_id, district_id)` and `(run_id, trade_id, severity DESC)` |
| `mart.flow_reco` | `run_id, trade_id, from_district, to_district, units, cost, gap_reduction` | |
| `mart.explain` | `run_id, district_id, trade_id, contributions JSONB` | Rendered by the "Why?" drawer |
| `audit.event` | `ts, actor, role, action, resource, scope, ip, request_id, outcome` | Append-only, hash-chained |

**Performance notes:** materialised rollups at state and national levels per run; Redis keys follow `snap:{run_id}:{level}:{id}:{filters_hash}` and are immutable (new run = new keys, so no invalidation bugs); the "current run" pointer is the only mutable key. (Part II, V-25, extends the key with scope and mask profile.)

## 8. API Design

Versioned REST (`/api/v1`), OpenAPI 3.1 generated from Pydantic models, errors in RFC 9457 problem-details format, cursor pagination, ETag/If-None-Match for snapshot reads.

| Endpoint | Purpose |
|---|---|
| `GET /geo/regions?level=state\|district` | Hierarchy and geometry (vector tiles/GeoJSON) |
| `GET /overview?run=current` | National KPIs, band counts, top-N critical areas |
| `GET /districts/{lgd}/gaps?horizon=3m&sector=&trade=` | District drill-down |
| `GET /trades/{id}/ranking?level=state&order=severity` | Rank geographies by severity |
| `GET /districts/{lgd}/explain?trade=` | Contribution breakdown ("Why?") |
| `GET /recommendations?state=&trade=` | Seat-shift and mobility recommendations |
| `POST /simulations` | What-if (change a signal or seat count); returns result or job ID |
| `GET /alerts`, `PUT /alerts/subscriptions` | Early warnings and subscriptions |
| `POST /exports` → `GET /exports/{id}` | Async PDF/Excel/CSV; signed, expiring download URL |
| `GET /runs`, `GET /runs/{id}/manifest` | Run history and audit manifest |
| `GET /sources/health` | Freshness and quality per source |
| `POST /admin/param-sets/*` | Governance workflow (Model Governor only) |

**Cross-cutting:** every request carries `X-Request-Id`; the API returns `run_id` and `data_as_of` with every analytic response; rate limits per user and per IP; an idempotency key on `POST /exports` and `/simulations`; **SSE** for alert push (simpler and firewall-friendlier than WebSockets for one-way updates).

## 9. Backend Structure

```
nexus/
  apps/
    api/            FastAPI app: routers, deps (auth, scope), schemas
    worker/         job handlers (export, simulation)
    pipeline/       Dagster assets/jobs, source adapters
  libs/
    engine/         pure math: nowcast, leontief, gap, flow, montecarlo
    domain/         entities, services, ports (repositories)
    infra/          db, cache, storage, auth adapters
    contracts/      data schemas shared by pipeline and API
  migrations/       Alembic
  tests/            unit, property, golden, contract, e2e
  deploy/           Dockerfiles, Helm charts, Terraform
```

Rules: the engine imports nothing from infra (hexagonal/ports-and-adapters). The API depends on `domain` ports. Scope filtering (state/district) is enforced in one place, a repository-level query filter, not scattered across routes.

## 10. Frontend Architecture

- **Stack:** Next.js 15 App Router. Server Components fetch snapshot data via the BFF; client components for the map, charts and what-if controls. The browser never holds tokens: the BFF keeps the session in an HttpOnly, Secure, SameSite cookie.
- **Map:** consider **MapLibre GL with vector tiles (PMTiles)** instead of Leaflet for ~780 district polygons with live choropleth recolouring; Leaflet is fine if geometries are simplified and the map stays the 20% auxiliary panel.
- **State:** server state via TanStack Query; URL as source of truth for filters (shareable links); minimal client store.
- **Layout:** split-window (80% analytics / 20% map), drill-down national → state → district → trade, synchronised selection between map and cards, plain-English action drawer with a "Why?" tab and a confidence indicator.
- **Design tokens:** the light Neumorphic-Lite tokens from the blueprint, exposed as CSS variables in Tailwind v4 `@theme`. Never rely on colour alone: bands also use icons and labels (colour-blind safe).
- **Accessibility and compliance:** WCAG 2.1 AA, keyboard navigation, ARIA for charts with a data-table alternative, **GIGW 3.0** guidelines.
- **i18n:** `next-intl`/i18next with ICU message format, Devanagari and regional fonts (Noto), locale-aware numerals and dates, RTL-ready for Urdu. Translation keys live in the repo and go through a review workflow; policy templates are translated per language, not machine-translated at runtime.
- **Performance budget:** LCP < 2.5 s on a 4G connection, JS < 250 KB per route (initial), charts lazy-loaded, map tiles cached.

## 11. Security Architecture

### 11.1 Threat model (STRIDE summary)

| Threat | Example | Primary controls |
|---|---|---|
| **Spoofing** | Stolen credentials, forged tokens | SSO + MFA, short-lived JWTs (5-15 min) with rotation, signature + audience + issuer validation, session binding |
| **Tampering** | Altering coefficients or published snapshots; poisoned source data | Four-eyes approval, immutable runs, hash-chained audit log, DB role separation (API has no write on `mart`/`model`), input validation + anomaly checks, source checksums |
| **Repudiation** | "I never changed that threshold" | Append-only audit events with actor, role, scope, request ID; log shipping to a separate account/WORM storage |
| **Information disclosure** | Cross-state data leak, IDOR, export abuse | RBAC + ABAC scope on every query, row-level security as defence in depth, signed expiring export URLs, field-level masking, no PII in analytics path |
| **Denial of service** | Heavy simulations, scraper floods | WAF, per-user and per-IP rate limits, query cost limits, timeouts, job queue back-pressure, autoscaling |
| **Elevation of privilege** | Role claim tampering, SSRF, injection | Server-side role resolution, deny-by-default, parameterised queries only, SSRF allow-list for adapters, least-privilege service accounts |

### 11.2 Controls by layer

**Identity and access**

- OIDC via Keycloak (federating with the government SSO where available); mandatory MFA for privileged roles; session timeout and re-auth for sensitive actions (approving a parameter set).
- RBAC for capabilities plus ABAC for scope (`state_code`, `district_code`) from token claims; enforced in the API **and** as PostgreSQL row-level security policies set per connection (`SET LOCAL app.scope`).
- Break-glass admin access: time-boxed, approved, fully logged, alerts on use.

**Application and API (OWASP ASVS L2, API Top 10)**

- Strict Pydantic validation, output schemas (no accidental field exposure), object-level and function-level authorisation tests for every route.
- CSP with nonces, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, strict CORS allow-list, CSRF protection for cookie sessions, SameSite cookies.
- Safe file handling: uploads (data stewards) limited by type and size, antivirus scan, parsed in a sandboxed worker, never executed; Excel/CSV formula-injection sanitisation on exports.
- Prevent SSRF in adapters through allow-listed hosts and an egress policy.

**Data protection**

- TLS 1.2+ (prefer 1.3) everywhere including internal hops (mTLS in the cluster); AES-256 at rest for DB, object store and backups, keys in KMS/HSM with rotation.
- **Data minimisation:** NCS/e-Shram feeds are ingested **only as district-level aggregates**; individual-level records stay with the data owner. Small-cell suppression (e.g. counts < 10 masked) to prevent re-identification.
- Classification labels per dataset (`public`, `internal`, `restricted`) driving access and export rules.
- Backups encrypted, immutable, with a tested restore each quarter.

**Secrets and configuration**

- No secrets in Git or images; Vault/cloud secrets manager with dynamic DB credentials; per-environment isolation; secret scanning in CI (gitleaks).

**Network and infrastructure**

- Private subnets for DB/cache/workers; only the edge is public. Default-deny network policies, egress allow-lists, bastion-less admin via zero-trust access.
- Hardened, minimal, non-root, read-only-filesystem containers; image signing (cosign) and an admission policy that only runs signed images.

**Supply chain and SDLC**

- Pinned and hashed dependencies, SBOM (CycloneDX), SCA (pip-audit, npm audit, Trivy), SAST (Semgrep, Bandit, CodeQL), DAST (OWASP ZAP) in CI, mandatory code review, branch protection, signed commits on release branches.
- Third-party scripts and fonts self-hosted; no runtime CDN dependency on the production path.

**Monitoring and response**

- Central logs, SIEM rules (impossible travel, mass export, repeated 403s, privilege changes), alerting to an on-call rotation.
- Incident response runbook aligned with **CERT-In** directions (report cyber incidents within 6 hours; retain logs for 180 days within India).
- Annual third-party penetration test and a **STQC/CERT-In empanelled auditor** assessment before go-live; vulnerability disclosure policy.

### 11.3 Compliance and hosting (India)

| Area | Requirement and approach |
|---|---|
| Data residency | Host in India on a **MeitY-empanelled cloud** or NIC/MeghRaj; no cross-border transfer of restricted data |
| DPDP Act 2023 | Aggregate-only design minimises exposure; document lawful basis, retention and a grievance contact if personal data is ever handled |
| IT Act / CERT-In directions | Log retention, incident reporting, NTP sync to NIC/NPL time sources |
| GIGW 3.0 / WCAG | Accessibility audit before release |
| Open data | Respect NDSAP and data-owner licences; record the licence per source |
| Audit | Maintain evidence packs: architecture, threat model, test reports, change log |

*Compliance items should be validated with MSDE's IT/legal team and the chosen hosting provider; requirements evolve.*

## 12. Infrastructure and DevOps

### 12.1 Environments

| Environment | Purpose | Notes |
|---|---|---|
| Local | Developer | Docker Compose, synthetic seed data |
| CI | Per-PR | Ephemeral DB, full test suite |
| Staging | Pre-release | Production-like, anonymised/synthetic data |
| Production | Live | Multi-AZ, restricted access |

### 12.2 Deployment profiles

| | Hackathon demo | Production |
|---|---|---|
| Runtime | Docker Compose on one VM (or free-tier cloud) | Kubernetes (3+ nodes, 2 AZs) |
| DB | Single PostgreSQL + PostGIS | Managed/HA Postgres with streaming replica + PITR |
| Cache/queue | One Redis | Redis with persistence/replica |
| Pipeline | Dagster dev instance, seeded schedules | Dagster on K8s with alerting |
| Auth | Keycloak dev realm | Keycloak HA + federated SSO |
| Cost | Minimal | Autoscaled, reserved capacity for DB |

### 12.3 CI/CD pipeline

```
PR     → lint/format → type-check (mypy, tsc) → unit + property + golden tests
       → secret scan → SAST → dependency/SCA scan → build images → container scan + SBOM
       → integration + contract tests (Schemathesis) → e2e (Playwright) → preview env
Merge  → sign image → deploy to staging (GitOps: Argo CD) → smoke + DAST + load test (k6)
Release→ manual approval → progressive rollout (canary 10% → 100%) → auto-rollback on SLO breach
```

Infrastructure is Terraform; Kubernetes config is Helm/Kustomize in a separate GitOps repository; DB migrations are Alembic with expand/contract so rollouts never break running versions.

### 12.4 Observability and SLOs

- **Metrics:** request rate/latency/errors, queue depth, pipeline run duration, source freshness, DB saturation, cache hit ratio.
- **Logs:** structured JSON with request ID and a redaction filter for sensitive values.
- **Traces:** OpenTelemetry from browser/BFF through API to DB and workers.
- **Product metrics:** forecast backtest error, band stability, alert precision (were flagged shortages later confirmed?).
- **SLOs:** 99.9% API availability, p95 latency targets from section 3.2, pipeline freshness SLA per source, error-budget policy.
- **Resilience:** health/readiness probes, circuit breakers on external adapters, retries with exponential backoff and jitter, graceful degradation (serve the last published run with a "stale" banner if a new run fails).

### 12.5 Backup and disaster recovery

Continuous WAL archiving (PITR), daily full backups to a separate region/account, object-store versioning, quarterly restore drills, and runbooks for DB failure, bad model release (roll back the "current run" pointer), and credential compromise.

## 13. Testing Strategy

| Layer | Approach |
|---|---|
| Engine math | Unit tests with known I-O examples; **property-based tests** (Hypothesis): non-negative demand, scale invariance, monotonicity; **golden-file** regression on a reference district set |
| Pipeline | Contract tests per adapter with recorded fixtures; data-quality tests; idempotency (run twice, same result) |
| API | Unit + contract (OpenAPI/Schemathesis fuzzing); authorisation matrix tests (every role × every route × in/out of scope) |
| Frontend | Component tests, Playwright e2e (incl. keyboard-only and Hindi locale), axe accessibility checks, visual regression |
| Performance | k6 load profiles (steady, spike, soak); DB query plans reviewed for hot paths |
| Security | SAST/DAST/SCA in CI, annual pen test, abuse-case tests (IDOR, mass export, injection) |
| Model quality | Rolling-origin backtests; calibration of confidence bands; sensitivity analysis report |

## 14. Delivery Roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **0: Hackathon MVP** | Seeded data (real public datasets where open, synthetic signals clearly labelled); engine with Leontief + min-cost flow; snapshot API; dashboard with map, drill-down and "Why?" drawer; roles and login; PDF/Excel export; EN + HI | Live demo of a state-level story: signal spike → demand → gap → recommendation, with confidence bands |
| **1: Pilot (2-3 states)** | Real adapters for open sources, MoU-based feeds with one DISCOM/state, governance workflow, alerts, backtesting dashboard, security hardening and audit | Backtest metrics published; pen test passed; planner UAT |
| **2: National scale** | All states, regional languages, HA deployment, DR drills, integrations with Skill India Digital and scheme target-setting workflows | SLOs met for 3 months; STQC clearance |
| **3: Evolution** | Optional ML nowcasting with explainability, scenario planning, informal-sector survey inputs | Approved through the same model-governance process |

**Hackathon build order:** (1) the engine library with tests, (2) the snapshot schema and API, (3) one end-to-end demo path with the "Why?" explainability, (4) the cheap, visible security basics: SSO/roles, scope enforcement, audit log, rate limits, CSP. Present everything else as the documented roadmap.

## 15. Open Questions and Decisions (superseded by section 22)

| Question | Options | Recommendation |
|---|---|---|
| Orchestrator | Dagster vs Airflow | Dagster: asset lineage fits the audit story |
| Map library | Leaflet vs MapLibre | MapLibre + PMTiles if the choropleth must be smooth; otherwise keep Leaflet |
| Flow solver | NetworkX vs OR-Tools/HiGHS | NetworkX for MVP, OR-Tools when scaling |
| Auth for demo | Keycloak vs simple JWT | Keycloak in Compose: shows production intent |
| Hosting | Public cloud vs NIC/MeghRaj | Decided by MSDE; keep the design cloud-agnostic |
| Which signals are actually obtainable | Confirm with GSTN, DISCOMs, RBI, NSDC | Resolve first; it shapes the pilot scope |

*Natural next documents from this baseline: the OpenAPI specification, PostgreSQL DDL, the Dagster asset graph, a formal threat-model workbook, and a reference implementation of the Leontief engine with tests.*

---

# Part II: Version 2 Revisions

*Part II supersedes any conflicting statement in Part I. It adds the stack decisions, the vulnerability fixes, the corrected demand methodology, and the MVP / Full split. Companion documents: SRD, PRD, Design (UI/UX), Planning & Implementation.*

## 16. Alignment with the Official Problem Statement

A review of the official PS 26246 text against Part I found one material gap and two refinements.

| # | Finding | Impact | Decision |
|---|---|---|---|
| 1 | The PS explicitly asks to aggregate demand signals from **job portals, industry hiring data, NCO/NSQF-coded postings, e-Shram and NCS**. Part I dropped postings entirely and relied on telemetry alone. | A jury will check requirement 1 literally. A telemetry-only design can be read as non-compliant. | Adopt a **hybrid Composite Demand Index (CDI)**: observed postings and registries (what is hiring now) plus leading telemetry (what will hire next) plus structural coefficients, fused into one auditable index. **No scrapers and no LLMs remain a hard rule**: postings come from the hackathon dummy dataset, NCS, and licensed or partner feeds. |
| 2 | The PS expects "a documented methodology for combining heterogeneous sources into a single demand index" as a named deliverable. | Part I described the math but not the fusion. | Section 17 is that methodology document. |
| 3 | The PS says dummy data will be provided for evaluation, and asks for "at least a few pilot sectors and States". | Real telemetry feeds are unrealistic inside a hackathon. | MVP runs on the provided dummy data plus public datasets plus a clearly labelled synthetic telemetry generator, for 3 pilot states and 5 sectors. |

**Positioning line for the pitch:** *Postings tell us who is hiring now. Telemetry tells us who will hire next. LMI-NEXUS fuses both into one index a planner can audit.*

## 17. Methodology: Composite Demand Index (CDI)

### 17.1 Signal tiers

| Tier | Signals | Role | Typical lead | Fusion weight basis |
|---|---|---|---|---|
| A. Observed demand | NCO-coded postings (NCS, provided dummy dataset, licensed portal aggregates), industry hiring data, apprenticeship demand | Coincident anchor, ties the index to real occupations | 0 to 1 month | Inverse backtest variance |
| B. Leading telemetry | Industrial power load, e-way bill velocity, VAHAN commercial registrations, credit/MSME disbursal, Udyam registrations | Early warning of expansion | 2 to 6 months | Inverse backtest variance, per lag |
| C. Structural | I-O technical coefficients **A**, occupation-by-sector matrix **B**, PLFS employment structure, Economic Census | Converts output change to occupation demand; baseline | Static, versioned | Fixed, approved parameter set |
| D. Labour pool (supply side) | e-Shram registrations (aggregated), NCS job-seeker counts, certified candidates, placement outcomes | Candidate availability and absorption | Monthly | Not fused into demand; enters the supply model |
| E. Training capacity | PMKVY, ITI, NCVET awarding body seats, enrolment, centre data | Supply pipeline | Monthly | Supply model |

### 17.2 Common taxonomy and crosswalks

All sources are mapped to one key: **(district LGD code, NCO-2015 occupation, NSQF job role / qualification pack)**, with the sector from NIC-2008.

- Crosswalk tables (`ref.xwalk_*`) are many-to-many with weights that sum to 1 per source code, so a posting for an ambiguous title is split across candidate occupations instead of forced into one.
- Every crosswalk has a version, an owner, and a coverage report (share of records mapped, share dropped). Unmapped records go to quarantine, never silently away.
- Mapping is rules and dictionary based (code lookup, alias table, fuzzy match with a fixed threshold and a human-reviewed alias list). **No generative model is involved.**

### 17.3 Computation, step by step

All tiers are converted to one common unit before fusion: **incremental workers required per year, by district and occupation**. Fusing in a common unit is what makes heterogeneous sources comparable.

1. **Standardise signals.** For each telemetry signal: seasonal adjustment (STL), growth `g`, robust z-score (median/MAD) over a rolling 36-month window. Outliers flagged, not deleted.
2. **Postings to demand.** `D_post(d,o) = V(d,o) / c_src`, where `V` is observed vacancies (annualised) and `c_src` is a **coverage factor** for that source, calibrated as portal vacancies divided by estimated hires from PLFS structure for the same cell. The coverage factor is published; where no calibration exists, the factor is set conservatively and the cell is flagged "low coverage".
3. **Telemetry to demand.** Nowcast sector output change `ΔY(d,k) = Σ β(k,s,lag) · g(d,s,t-lag)`, then `ΔX = (I − A)⁻¹ ΔY`, then `D_tel(d,o) = B_d · ΔX(d)`.
4. **Structural baseline.** `D_base(d,o)` = replacement plus trend demand from PLFS structure (retirements, attrition, historical growth).
5. **Fuse.** `D(d,o,h) = D_base + Σ_i w_i · (D_i − D_base)` over the available tiers, with `w_i ∝ 1 / MSE_i` from the latest approved backtest, renormalised across available signals. If a tier is missing, its weight is redistributed and confidence drops.
6. **Small-area shrinkage.** For sparse districts: `D̂(d,o) = λ · D(d,o) + (1 − λ) · share(d) · D(state,o)` with `λ = n / (n + κ)` (empirical Bayes; `n` is effective observations, `κ` fitted). Prevents noisy small-district swings.
7. **Supply.** `S(d,o,h)` = trainees completing within horizon `h` (by course duration) × certification rate × placement/absorption rate, plus the existing certified stock still seeking work (e-Shram and NCS aggregates, de-duplicated by definition, never by person).
8. **Gap and severity.** `Gap = D̂ − S`; `Severity = clip(Gap / max(D̂, ε), −1, +1)`; thresholds from the approved parameter set.
9. **Demand Index.** `DI = 100 · D̂ / D_base` for display (100 means no change versus baseline), alongside the absolute headcount.
10. **Reallocation.** Min-cost flow over the district graph for each trade cluster (Part I, 6.1 step 7).

### 17.4 Confidence and explanation

- **Confidence score** per cell: `conf = Σ w_i · coverage_i · freshness_i · agreement`, where `agreement` falls when tiers disagree in sign. Shown as High/Medium/Low with the reason ("postings only", "telemetry stale 45 days").
- **Intervals:** Monte Carlo over β, A, B, `c_src`, and supply rates (vectorised, 200 draws in MVP, 500+ in Full). Publish P10/P50/P90.
- **Explanation payload:** per cell, the contribution of each tier and signal to `D̂`, plus supply components. The UI "Why?" drawer renders this; sentences come from fixed templates.

### 17.5 Validation protocol

| Test | Metric | Baselines it must beat |
|---|---|---|
| Rolling-origin backtest at state × sector | WAPE, bias | Last-year value, linear trend, postings-only model |
| Severity ranking quality | Spearman rank correlation vs realised placement shortfall | Random, last-year ranking |
| Early-warning precision/recall | Share of flagged cells later confirmed within 6 months | Threshold-on-postings |
| Interval calibration | P10-P90 empirical coverage (target about 80%) | Nominal |
| Lead time | Months by which telemetry signal precedes postings | Cross-correlation per signal |

On hackathon dummy data these metrics are produced as a **demonstration of the protocol**; the UI labels them "on provided data" and never claims real-world accuracy.

### 17.6 Known limitations (stated openly)

- Input-output coefficients are national and periodic; local technology mix may differ.
- Informal-sector demand is represented only through structural baselines and survey-based coverage factors.
- Telemetry proxies capture expansion in formal and semi-formal industry better than agriculture and household services.
- Migration willingness is approximated by cost and a mobility cap, not observed behaviour.

## 18. Technology Stack: Decisions

Principles: boring and proven over novel; fewest moving parts that still meet the requirements; open source; self-hostable in India; every dependency pinned. Versions are pinned to the **latest stable at build time** and recorded in lockfiles, not in this document.

| Layer | MVP choice | Full choice | Rationale and rejected options |
|---|---|---|---|
| Frontend framework | Next.js (App Router) + TypeScript strict | Same | Mature SSR, i18n and routing. Rejected: plain SPA (weaker initial load and session handling). |
| Styling / components | Tailwind v4 + shadcn/ui (Radix primitives) | Same + internal design-system package | Radix gives accessible keyboard and ARIA behaviour for free, which matters for GIGW. |
| Charts | Recharts (with accessibility layer) + d3-sankey for flows | Add Apache ECharts only if heavy interactivity is needed | Simple, React-native. ApexCharts dropped to keep one chart library. |
| Map | MapLibre GL JS, **no third-party basemap**, self-hosted PMTiles of district boundaries | Same | Choropleth on a blank background is faster, avoids tile-server data leakage, and avoids mis-depicted borders. Boundary data must follow the official Survey of India depiction; verify the licence before use. Rejected: Leaflet with OSM or Google tiles. |
| Data fetching / state | TanStack Query, URL state via `nuqs`, minimal Zustand | Same | Shareable filter URLs, easy caching. |
| i18n | `next-intl` (ICU messages) | Same + translation management workflow | First-class App Router support. |
| Backend framework | FastAPI, Pydantic v2 (`extra=forbid`), Python 3.12+ | Same | Typed contracts and automatic OpenAPI. |
| ORM / migrations | SQLAlchemy 2.0 + Alembic; psycopg 3 | Same | Parameterised queries by default. |
| Numerics | NumPy, SciPy, Polars (pipeline), pandas where a library requires it, statsmodels (STL), scikit-learn (ridge/elastic net) | Same | Standard, auditable. |
| Flow solver | NetworkX (network simplex min-cost flow) | OR-Tools or HiGHS for scale | NetworkX is enough for about 100 districts. |
| Job runner | Celery + Redis (exports, what-if) | Same | Industry standard. For MVP, exports under a size limit may run in-request. |
| Pipeline orchestration | `nexus` CLI (Typer) scheduled by a cron container | Dagster | Dagster's asset lineage is ideal for audit but costs setup time. |
| Validation | pandera | pandera + Great Expectations reports | |
| Database | PostgreSQL + PostGIS | HA Postgres (streaming replica, PITR), pgaudit | One store for relational, geospatial and snapshots. |
| Cache / sessions / rate limits | Redis (password, internal network) | Redis with replica | |
| Object storage | Local volume | MinIO or cloud S3-compatible, versioned | |
| AuthN | First-party: Argon2id, server-side sessions in Redis, TOTP for privileged roles, behind an `AuthProvider` interface | OIDC with Keycloak, federated to government SSO | Keycloak costs setup time and memory in a hackathon. Rolling your own is risky, so MVP uses vetted primitives, no self-registration, seeded accounts only, and an interface so OIDC drops in. |
| AuthZ | RBAC + scope (state/district) in one policy module | Add PostgreSQL row-level security | |
| PDF / Excel | WeasyPrint (network fetch disabled), XlsxWriter (formula parsing off) | Same | Prevents SSRF and formula injection by construction. |
| Edge | Caddy (automatic TLS, safe defaults) | Gateway API implementation (e.g. Envoy Gateway) + WAF | The Kubernetes community retired Ingress-NGINX; prefer Gateway API for new work. |
| Observability | JSON logs + Prometheus metrics + Grafana | OpenTelemetry, Loki, Tempo, **self-hosted** error tracking | Hosted SaaS error tracking sends data outside India. |
| CI/CD | GitHub Actions | Same + Argo CD (GitOps) | |
| Security tooling | gitleaks, Semgrep, pip-audit, OSV-Scanner, Trivy, ZAP baseline | Add CodeQL, SBOM (CycloneDX), cosign | |
| Testing | pytest, Hypothesis, Vitest, Playwright + axe, Schemathesis, k6 | Same | |
| IaC / runtime | Docker Compose on one VM | Terraform/OpenTofu, Kubernetes, Helm | |
| Package management | `uv` with hashed lockfile, `pnpm` with `--ignore-scripts` in CI | Same + private mirror | |

**Explicitly excluded:** web scrapers, LLM calls, third-party analytics and tag managers, external CDNs and fonts at runtime, browser storage of tokens.

## 19. Vulnerability Register and Fixes

No code exists yet, so these are **design-level weaknesses** found in Part I and in the typical stack, each with a binding fix and how it is verified. Severity: C critical, H high, M medium, L low. Phase: **M** = required in MVP, **F** = Full.

### 19.1 Identity, session and access

| ID | Weakness | Sev | Fix and verification | Phase |
|---|---|---|---|---|
| V-01 | Tokens stored in browser storage can be stolen via XSS | H | No tokens in JS. Opaque session ID in a `__Host-` cookie: `Secure; HttpOnly; SameSite=Lax; Path=/`. Test: cookie attribute assertion in e2e. | M |
| V-02 | Session fixation and non-expiring sessions | H | Rotate ID on login and on privilege change; idle timeout 30 min, absolute 8 h; server-side revoke on logout. | M |
| V-03 | CSRF on cookie-authenticated state-changing calls | H | `Origin`/`Referer` check plus double-submit token header on every non-GET. Test: cross-origin POST must return 403. | M |
| V-04 | Weak credential handling | H | Argon2id (m=19 MiB, t=2, p=1 at minimum), password length 12+ with breached-password check, generic login errors, no self-registration. | M |
| V-05 | Brute force and account enumeration | H | Rate limit 5 attempts per minute per IP and per account, exponential lockout, constant-time responses. | M |
| V-06 | No MFA for privileged roles | H | TOTP mandatory for Model Governor, Data Steward, Admin; step-up re-auth for approvals and exports above a size. | M |
| V-07 | Broken object-level authorisation (IDOR) on district/trade resources | C | One `Scope` object resolved server-side from the session; every repository query takes it. Authorisation matrix test (role × route × in/out of scope) runs in CI. RLS added in Full. | M |
| V-08 | Broken function-level authorisation on admin endpoints | C | Admin routes in a separate router with an explicit role dependency, deny by default; automated check that every route declares a policy. | M |
| V-09 | Default or demo credentials left in production | H | Seed accounts only in the `dev`/`demo` profile with generated passwords printed once; startup refuses to run in the `prod` profile if seed accounts exist. | M |
| V-10 | Open redirect via login `next` parameter | M | Accept only relative paths from an allow-list. | M |
| V-11 | Reliance on a single custom auth implementation | M | `AuthProvider` interface; OIDC provider implemented in Full; security review of the auth module before pilot. | F |

### 19.2 Input, output and injection

| ID | Weakness | Sev | Fix and verification | Phase |
|---|---|---|---|---|
| V-12 | SQL injection | C | ORM and bound parameters only; lint rule forbids string-built SQL; DB role without DDL rights. Semgrep rule + Schemathesis fuzzing. | M |
| V-13 | Mass assignment and unexpected fields | M | Pydantic models with `extra=forbid`, separate request and response schemas. | M |
| V-14 | Stored and reflected XSS (comments, policy text, filter values) | H | React escaping, no `dangerouslySetInnerHTML`, comments are plain text, nonce-based CSP. Test: payload corpus in e2e. | M |
| V-15 | Formula injection in CSV and Excel exports | H | XlsxWriter with `strings_to_formulas=False`; prefix cells starting with `=`, `+`, `-` or `@` with an apostrophe in CSV. | M |
| V-16 | SSRF through PDF rendering or adapters | H | WeasyPrint `url_fetcher` that refuses everything except local static assets; adapters accept **only registry-defined hosts**, no user-supplied URLs. | M |
| V-17 | Malicious uploads (bulk data files) | H | Admin-only; extension and magic-byte check; size cap; ClamAV scan; `defusedxml` for XLSX (blocks XXE and entity bombs); zip-bomb limits; parse in a worker with CPU and memory limits. | M |
| V-18 | Insecure deserialisation (pickle, joblib) for model artefacts | H | Parameters stored as JSON/Parquet/`.npz` with `allow_pickle=False`; artefact hash recorded in the run manifest and verified at load. | M |
| V-19 | Log injection and sensitive data in logs | M | Structured JSON, newline stripping, redaction filter (tokens, emails), no request bodies logged by default. | M |
| V-20 | Unsafe i18n content (bidi or look-alike characters in translation files) | L | Lint translation files for control and bidi characters; review workflow. | F |

### 19.3 Data, model and domain-specific

| ID | Weakness | Sev | Fix and verification | Phase |
|---|---|---|---|---|
| V-21 | Poisoned or tampered source data | H | Source checksums, schema and range checks, anomaly detection (robust z-score on level and growth), quarantine, Data Steward sign-off for source config changes, immutable raw layer. | M |
| V-22 | Model parameter tampering | C | Parameter sets immutable once approved; four-eyes approval; content hash in every run manifest; DB role cannot update `model.*` after approval. | M |
| V-23 | Invalid Leontief inputs yield nonsense (spectral radius of **A** at or above 1, negative inverse, NaN/Inf) | H | Validate at parameter approval: `ρ(A) < 1` (Hawkins-Simon), non-negative `(I−A)⁻¹`; runtime guards for NaN/Inf; solve with `linalg.solve`, not an explicit inverse. Property tests. | M |
| V-24 | Re-identification from small cells | H | Aggregates only; suppress or merge cells with counts below a configured threshold; no person-level data in any table. | M |
| V-25 | Cache key collision leaks scoped or masked data across roles (the Part I key omitted scope) | H | Cache key = `snap:{run}:{level}:{id}:{filters_hash}:{scope_hash}:{mask_profile}`; never cache a response without its scope. Test: two roles, same query, different results. | M |
| V-26 | Partial publish exposes a half-written snapshot | M | Publish in one transaction by flipping the `current_run` pointer; readers only see published runs. | M |
| V-27 | Unbounded compute (Monte Carlo draws, what-if range) driven by user input | M | Server-side caps and defaults; per-user quota; job timeout. | M |
| V-28 | Audit trail can be altered | H | `INSERT`-only DB privilege on `audit.*`, hash chain (each row hashes the previous), nightly export to separate storage. | M |
| V-29 | Override abuse (planner edits shown as model output) | M | Overrides stored separately, require reason and approver, always labelled in UI and exports. | F |

### 19.4 Platform, supply chain and operations

| ID | Weakness | Sev | Fix and verification | Phase |
|---|---|---|---|---|
| V-30 | Database or Redis reachable from outside the VM | C | No published ports except Caddy 80/443; internal Docker network; Redis password; Postgres `scram-sha-256`. Test: external port scan after each deploy. | M |
| V-31 | Containers run as root with a writable filesystem | H | Non-root user, `read_only: true`, `cap_drop: [ALL]`, `no-new-privileges`, resource limits, slim base images. | M |
| V-32 | Secrets in repo, images or a committed `.env` | C | gitleaks pre-commit and CI; secrets via Docker secrets or a vault; `.env.example` only. | M |
| V-33 | Vulnerable or malicious dependencies | H | Lockfiles with hashes, `pip-audit`, OSV-Scanner, Trivy, Renovate with review, `--ignore-scripts` for npm in CI, minimum release age of 14 days for new versions. | M |
| V-34 | Missing security headers, permissive CORS, clickjacking | M | Headers in section 20.1; CORS allow-list (no wildcard with credentials); `frame-ancestors 'none'`. Test: header assertions. | M |
| V-35 | Third-party scripts, fonts, tiles or analytics leak usage and add attack surface | M | Everything self-hosted; CSP blocks external origins; no analytics SDKs. | M |
| V-36 | Expensive endpoints enable denial of service | M | Rate limits (20.2), request size caps, timeouts, queue limits, per-user concurrent job cap. | M |
| V-37 | Event-stream (SSE) connection exhaustion | M | Authenticated, one stream per session, heartbeat and idle timeout, global cap. MVP may use polling instead. | M |
| V-38 | Keycloak or admin consoles exposed publicly | H | Admin interfaces on a private network or VPN only. | F |
| V-39 | Unencrypted or exposed backups | H | Encrypted at rest, separate account and region, restore drill. | F |
| V-40 | No detection or response capability | M | Alert rules (mass export, repeated 403, privilege change), incident runbook, CERT-In reporting path, annual pen test and STQC-empanelled audit. | F |

*Security acceptance gate for MVP: every item marked M is implemented or has a written, owner-approved exception. Exceptions are tracked in the risk register of the Planning document.*

## 20. Security Configuration Baselines

### 20.1 HTTP headers

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'nonce-{per-request}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'` (inline styles are a known framework constraint; revisit with style nonces) |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment all disabled |
| Cross-Origin-Opener-Policy / Resource-Policy | `same-origin` |
| Cache-Control (authenticated API) | `no-store` for personal or scoped responses; ETag allowed only for scope-keyed snapshots |

### 20.2 Rate limits (per user unless stated)

| Endpoint group | Limit |
|---|---|
| Login | 5 per minute per IP and per account, then exponential backoff |
| Read APIs | 120 per minute |
| What-if simulation | 10 per minute, 1 concurrent |
| Export creation | 5 per hour, 2 concurrent |
| Admin actions | 30 per minute, MFA step-up |

### 20.3 Database roles

| Role | Privileges |
|---|---|
| `nexus_owner` | DDL only; used by migrations, never at runtime |
| `nexus_api` | `SELECT` on `ref`, `mart`; read/write on `app` only; `INSERT` on `audit` |
| `nexus_pipeline` | Write on `raw`, `core`, `model` (draft only), `mart`; no access to `app` |
| `nexus_readonly` | `SELECT` on `mart` for exports and BI |

### 20.4 Container and host baseline

`user: non-root`, `read_only: true` with tmpfs for scratch, `cap_drop: [ALL]`, `security_opt: [no-new-privileges:true]`, memory and CPU limits, healthchecks, images pinned by digest, no `privileged`, no host mounts except named volumes, host firewall allowing only 22 (key-only, restricted source), 80 and 443; automatic OS security updates.

## 21. MVP versus Full: Architecture Split

### 21.1 MVP topology (single VM, Docker Compose)

```
 Internet ─► Caddy (TLS, headers, rate limit) ─┬─► Next.js (SSR + BFF)
                                               └─► FastAPI ─┬─► Postgres + PostGIS
                                                             ├─► Redis (sessions, limits, cache)
                                                             └─► Celery worker (exports, what-if)
 Cron container ─► `nexus pipeline run` ─► raw files (volume) ─► Postgres (core ► mart)
 Prometheus + Grafana (internal only)       Nightly encrypted backup ─► off-VM storage
```

### 21.2 Capability split

| Capability | MVP (hackathon) | Full (product) |
|---|---|---|
| Geography | 3 pilot states (about 100 districts) | All states and UTs (about 780 districts) |
| Sectors / trades | 5 sectors, about 40 trades | All NSQF sectors and trades |
| Data | Provided dummy data, public PLFS/NCO tables, labelled synthetic telemetry | Live adapters, MoU feeds, scheduled refresh |
| Methodology | CDI fusion, Leontief (aggregated I-O), shrinkage, min-cost flow, Monte Carlo (200 draws), explanation payload | Backtest-calibrated weights, full I-O, 500+ draws, drift monitoring |
| Governance | Parameter sets in seed files, approval recorded in DB, manifests | Governance UI, four-eyes workflow, override workflow |
| Dashboard | National to district drill-down, map, ranking, alerts, "Why?", recommendations, limited what-if | Saved views, comments, scenario comparison, backtest dashboard |
| Alerts | In-app flags | Subscriptions, email/SMS channels where approved |
| API / export | OpenAPI REST, CSV, Excel, PDF | Scheme-workflow integrations, API keys, webhooks |
| Languages | English and Hindi live; framework ready for more | All required regional languages with review workflow |
| Identity | First-party auth, 4 roles, TOTP for privileged | OIDC, SSO, full role model, RLS |
| Pipeline | CLI + cron | Dagster, lineage, SLAs |
| Deployment | Compose, single VM, Caddy | Kubernetes, HA, WAF, DR |
| Security | All items marked M in section 19 | All items; pen test, STQC, SIEM |
| Observability | Logs + Prometheus + Grafana | Traces, SLOs, on-call |

## 22. Decision Log (supersedes section 15)

| Decision | Resolved as |
|---|---|
| Approach | Hybrid CDI: postings and registries + telemetry + structural |
| Orchestrator | CLI + cron (MVP), Dagster (Full) |
| Map library | MapLibre GL, self-hosted boundaries, no basemap |
| Flow solver | Min-cost flow: NetworkX (MVP), OR-Tools/HiGHS (Full) |
| Auth | First-party behind `AuthProvider` (MVP), OIDC/Keycloak (Full) |
| Hosting | Cloud-agnostic containers; Full targets a MeitY-empanelled provider or NIC |
| Charts | Recharts + d3-sankey |
| Job runner | Celery + Redis |
| Error tracking | Self-hosted only |
| Open item | Confirm with MSDE the exact dummy dataset schema as soon as it is released; the adapter layer isolates the rest of the system from it |
