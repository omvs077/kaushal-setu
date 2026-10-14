# Kaushal Setu (कौशल सेतु): Planning and Implementation Plan

*Official Project Name: Kaushal Setu (कौशल सेतु) · Planning Code Name: LMI-NEXUS · SIH PS 26246 · MSDE · Version 1.0 · Companion to the SRS, PRD, Design and Architecture documents*

## 1. Planning Assumptions

The SIH schedule and the dummy-dataset release date are not known yet, so the plan is parameterised. Adjust the numbers below and the rest of the plan scales with them.

| Assumption | Value used | Effect if different |
| --- | --- | --- |
| Team size | 6 people (typical SIH team) | Fewer people: apply the cut list earlier |
| Build window to the finale | 4 weeks, about 30 productive hours per person per week | Longer: pull stretch (S) items in; shorter: drop to the "core demo" scope in section 8 |
| Finale format | A continuous on-site build and demo window (commonly 36 hours; confirm in the official schedule) | Use section 7 as the finale playbook |
| Capacity | 6 × 4 × 30 = 720 h, minus about 15% for meetings and rework = **about 610 h** | The planned backlog is about 720 h, so **about 100 h must be cut or deferred** (section 8) |
| Data | MSDE dummy dataset arrives during the window; schema unknown until then | Adapter layer isolates the schema; the synthetic generator is the fallback |
| Scope | MVP per the SRS: 3 states, 5 sectors, about 40 trades |  |

## 2. Delivery Strategy

1. **Walking skeleton first (end of week 1).** One fake number travels from raw file to pipeline to engine to snapshot to API to dashboard to export, deployed on the demo VM. Everything after is thickening this path.
2. **Vertical slices, not layers.** Each slice (for example "District shortage ranking") includes data, engine, API, UI, translation, test and security checks.
3. **Demo-driven.** The 7-minute demo script in the PRD is the acceptance spine; every week ends with the script run on the deployed build.
4. **Contracts before code.** The OpenAPI spec, database schema and engine function signatures are agreed on day one so frontend, backend and engine work in parallel against fixtures.
5. **Security and accessibility in the definition of done**, not a final phase.
6. **Freeze discipline.** Feature freeze at the end of week 3; week 4 is hardening, testing and rehearsal only.
7. **Always deployable.** Main branch is protected; every merge deploys to staging on the demo VM.

## 3. Roles and Responsibilities

| Role | Primary ownership | Backup |
| --- | --- | --- |
| **PL** Product and delivery lead | Requirements, domain validation, methodology page, pitch, demo script, risk and cut decisions | DM |
| **DM** Data and modelling engineer | Engine library, methodology maths, synthetic data design, backtest, parameter sets | BE |
| **BE** Backend and security engineer | API, auth, authorisation, audit, exports, admin | DQ |
| **FA** Frontend engineer A | Dashboard screens, charts, drill-down, Why drawer, recommendations | FB |
| **FB** Frontend and UX engineer | Design system, map, i18n, accessibility, usability testing | FA |
| **DQ** Data pipeline, DevOps and QA engineer | Ingestion, validation, CI/CD, deployment, hardening, E2E and load tests | BE |

### 3.1 RACI (R = does, A = accountable, C = consulted, I = informed)

| Deliverable | PL | DM | BE | FA | FB | DQ |
| --- | --- | --- | --- | --- | --- | --- |
| Requirements and acceptance scenarios | A/R | C | C | C | C | C |
| Methodology and parameter sets | A | R | C | I | I | I |
| Data pipeline and quality | C | C | I | I | I | A/R |
| Engine library | C | A/R | C | I | I | C |
| API and authorisation | C | C | A/R | C | I | C |
| Security controls (register items) | C | I | A/R | C | C | R |
| Dashboard and visualisation | C | C | C | A/R | R | I |
| Design system, i18n, accessibility | C | I | I | C | A/R | C |
| CI/CD, deployment, observability | I | I | C | I | I | A/R |
| Testing and acceptance run | A | C | R | R | R | R |
| Pitch, demo and documentation | A/R | C | C | C | C | C |

## 4. Work Breakdown Structure

| Workstream | Scope | Lead |
| --- | --- | --- |
| WS1 Data and pipeline | Reference data, taxonomy, adapters, validation, synthetic generator, feature pipeline, publishing | DQ |
| WS2 Engine | Nowcast, Leontief, fusion, supply, gap, Monte Carlo, explanation, reallocation, alerts, tests | DM |
| WS3 Backend and security | API, auth, scope, audit, exports, admin | BE |
| WS4 Frontend | Screens, charts, map, drill-down, drawers, i18n integration | FA/FB |
| WS5 Design | Tokens, components, hi-fi screens, usability test | FB |
| WS6 Platform and QA | Compose, Caddy, CI, scans, observability, E2E and load tests, runbook | DQ |
| WS7 Product and documentation | Methodology page, domain validation, pitch, API docs, README | PL |

## 5. Timeline and Milestones (MVP, 4 weeks)

| Week | Theme | Key deliverables | Milestone gate |
| --- | --- | --- | --- |
| **0** (2 to 3 days) | Decide and prepare | Repo, tooling, branch rules, CI skeleton; confirm pilot states and sectors; choose boundary file; request dataset schema; agree OpenAPI, DB schema, engine signatures | **G0**: contracts signed off; everyone can run the stack locally |
| **1** | Walking skeleton | Compose stack and demo VM; auth skeleton; fake snapshot through API to dashboard shell; tokens and layout; reference loaders; synthetic generator v1 | **G1**: skeleton demo: login, overview with fake data, export, deployed over HTTPS |
| **2** | Real data through the engine | Dummy-dataset adapters; validation and quarantine; taxonomy mapping; nowcast, Leontief, fusion, supply, gap; snapshot publishing; ranking and district APIs; overview, drill-down and map UI | **G2**: real (or synthetic-labelled) data produce rankings visible in the UI |
| **3** | Feature complete | Monte Carlo and confidence; explanation and Why drawer; reallocation; alerts; what-if; exports and Target Pack; roles and scope; audit chain; Hindi; accessibility pass 1 | **G3 (feature freeze)**: AT-01 to AT-15 attempted; all M items implemented or on the cut list |
| **4** | Harden and rehearse | Security verification; E2E and load tests; bug fixing; usability test and fixes; methodology page; README and runbooks; pitch and rehearsals; offline demo build | **G4 (release candidate)**: all AT scenarios pass on the deployed build; two clean rehearsals |

### 5.1 Weekly plan by workstream

| Workstream | Week 1 | Week 2 | Week 3 | Week 4 |
| --- | --- | --- | --- | --- |
| WS1 | Schemas, reference loaders, file-adapter framework, synthetic v1 | Dummy dataset adapters, pandera rules, taxonomy mapper, features | Publish step, CLI, run manifest, scheduling | Data fixes, final seed set, offline dataset |
| WS2 | Library skeleton, contracts, fixtures | Nowcast, Leontief, postings, fusion, supply, gap | Monte Carlo, explanation, flow, alerts | Golden tests, tuning, (stretch) backtest |
| WS3 | Skeleton, errors, logging, session auth | Read APIs, RBAC and scope | Exports, simulation, audit, admin, TOTP | Security fixes, contract tests |
| WS4 | Shell, tokens, i18n scaffold, login | Overview, map, drill-down, ranking | District, Why, recommendations, what-if, alerts, exports | Accessibility fixes, polish, Hindi QA |
| WS5 | Tokens, core components | Hi-fi: overview, district | Hi-fi: Why, recommendations; handoff | Usability test, fixes |
| WS6 | Compose, Caddy, CI, VM | Scans in CI, seed loader | E2E skeleton, observability | Full E2E, load test, backup, runbook |
| WS7 | Domain validation plan, thresholds | Methodology draft | Pitch outline | Demo script, rehearsals, Q&A drill |

## 6. Detailed Backlog

Estimates are ideal hours for one person. **S** marks stretch items. Dependencies reference IDs.

### 6.1 WS1 Data and pipeline (about 118 h)

| ID | Task | Owner | Est | Depends | SRS |
| --- | --- | --- | --- | --- | --- |
| D-01 | Alembic migrations for schemas ref, raw, core, model, mart, app, audit; DB roles | DQ | 10 | none | 20.3 |
| D-02 | Reference loaders: LGD, NCO, NSQF/QP, NIC, district boundaries to PostGIS and PMTiles | DQ | 14 | D-01 | FR-ING-03 |
| D-03 | Crosswalks, alias table, deterministic mapper with coverage report | DQ | 14 | D-02 | FR-TAX-01 to 03 |
| D-04 | File-adapter framework and source registry | DQ | 10 | D-01 | FR-ING-01, 05, 06 |
| D-05 | Adapters for each part of the dummy dataset (postings, hiring, seats, e-Shram and NCS aggregates) | DQ | 16 | D-04, dataset | FR-ING-02 |
| D-06 | Validation rules (pandera), quarantine tables, quality report, publish gate | DQ | 12 | D-05 | FR-DQ-01 to 05 |
| D-07 | Synthetic telemetry generator with seed, anomalies, demo storylines, labels | DM | 14 | D-01 | FR-ING-04 |
| D-08 | Feature pipeline: seasonal adjustment, growth, robust z, outlier flags | DM | 10 | D-05, D-07 | FR-FC-04 |
| D-09 | `nexus` CLI: load, validate, run, publish; run manifest | DQ | 10 | D-06, E-01 | FR-ING-07, FR-FC-13 |
| D-10 | Publish step: atomic pointer flip, materialised roll-ups, cache warm | DQ | 8 | D-09 | REL-01 |

### 6.2 WS2 Engine (about 130 h)

| ID | Task | Owner | Est | Depends | SRS |
| --- | --- | --- | --- | --- | --- |
| E-01 | Library skeleton, typed interfaces, property-test harness (Hypothesis) | DM | 6 | none | MNT-01 |
| E-02 | Nowcast: offline ridge fit, frozen β loader, lag handling | DM | 14 | D-08 | FR-FC-04 |
| E-03 | Leontief solve, ρ(A) validation, occupation conversion, location quotients | DM | 14 | E-01 | FR-FC-05, 06 |
| E-04 | Postings to demand with coverage factors | DM | 8 | D-05 | FR-FC-03 |
| E-05 | Fusion with weights and shrinkage | DM | 12 | E-02, E-03, E-04 | FR-FC-07, 08 |
| E-06 | Supply projection by course duration and absorption | DM | 10 | D-05 | FR-SUP-02 to 04 |
| E-07 | Gap, severity, bands, roll-ups | DM | 8 | E-05, E-06 | FR-GAP-01 to 05 |
| E-08 | Monte Carlo (vectorised) and confidence score | DM | 12 | E-05 | FR-FC-09, 10 |
| E-09 | Explanation payload | DM | 8 | E-05 | FR-FC-11 |
| E-10 | Min-cost flow reallocation and recommendation records | DM | 12 | E-07 | FR-RA-01 to 03 |
| E-11 | Alert rules and persistence logic | DM | 6 | E-07 | FR-EW-01 to 05 |
| E-12 | Golden-file, determinism and property tests | DM | 8 | E-07 | FR-FC-12 |
| E-13 (S) | Basic backtest on provided data, metrics page data | DM | 12 | E-08 | FR-FC-14 |

### 6.3 WS3 Backend and security (about 130 h)

| ID | Task | Owner | Est | Depends | SRS |
| --- | --- | --- | --- | --- | --- |
| B-01 | FastAPI skeleton: config, JSON logs, request ID, RFC 9457 errors | BE | 8 | none | FR-API-02 |
| B-02 | Auth: Argon2id, Redis sessions, CSRF, lockout, rate limit | BE | 18 | B-01 | FR-AUTH-01, 05, 06 |
| B-03 | TOTP and step-up for privileged roles | BE | 8 | B-02 | FR-AUTH-04 |
| B-04 | RBAC, `Scope`, repository filters, authorisation matrix tests | BE | 14 | B-02 | FR-AUTH-03 |
| B-05 | Read APIs: overview, geo, districts, trades, rankings | BE | 20 | B-04, D-01 | FR-API-01, 03, 04 |
| B-06 | Explain, recommendations, alerts endpoints | BE | 10 | B-05, E-09 | FR-UI-07, 08 |
| B-07 | Simulation endpoint with caps | BE | 8 | E-05 | FR-SIM-01 to 04 |
| B-08 | Exports (CSV, XLSX, PDF), Target Pack, safe-output controls | BE | 16 | B-05 | FR-API-05 to 08 |
| B-09 | Audit log with hash chain and viewer API | BE | 10 | B-04 | FR-GOV-04 to 06 |
| B-10 | Admin APIs: runs, parameter sets and approvals, users | BE | 12 | B-04 | FR-GOV-01 to 03, FR-AUTH-07 |
| B-11 | OpenAPI polish and contract tests (Schemathesis) | BE | 6 | B-06 | FR-API-01 |

### 6.4 WS4 Frontend and WS5 Design (about 226 h)

| ID | Task | Owner | Est | Depends | SRS |
| --- | --- | --- | --- | --- | --- |
| F-01 | Next.js shell, tokens, layout, i18n scaffold | FB | 12 | U-01 | FR-LOC-01 |
| F-02 | Login, session handling, CSP nonce middleware | FA | 10 | B-02 | FR-AUTH-01 |
| F-03 | Overview screen | FA | 16 | B-05 | FR-UI-01 |
| F-04 | Map panel: MapLibre, PMTiles, patterns, legend, sync | FB | 20 | D-02 | FR-UI-03, 04 |
| F-05 | Drill-down pages, breadcrumbs, URL state | FA | 16 | B-05 | FR-UI-02, 10 |
| F-06 | Ranking table | FA | 12 | B-05 | FR-UI-05 |
| F-07 | District detail and charts | FA | 16 | B-05 | FR-UI-06 |
| F-08 | Why drawer | FA | 10 | B-06 | FR-UI-07 |
| F-09 | Recommendations, sankey, what-if panel | FA | 18 | B-06, B-07 | FR-UI-08, FR-SIM |
| F-10 | Alerts, exports, sources, methodology pages | FB | 16 | B-06, B-08 | FR-UI-12, 13 |
| F-11 | Admin screens (read-only) | FB | 8 | B-10 | FR-UI-14 |
| F-12 | Hindi catalogue, number and date formatting, fonts | FB | 10 | F-01 | FR-LOC-02 to 05 |
| F-13 | Accessibility pass: keyboard, ARIA, axe fixes | FB | 12 | F-03 to F-10 | FR-ACC |
| U-01 | Tokens JSON, Figma variables, CSS generation | FB | 6 | none | 6.8 |
| U-02 | Core components in Storybook | FB | 14 | U-01 | Design 7 |
| U-03 | Hi-fi screens: overview, district, Why, recommendations | FB | 20 | U-01 | Design 8 |
| U-04 | Usability test (5 users) and fixes | FB | 10 | F-10 | USE-01 |

### 6.5 WS6 Platform, WS7 Product (about 116 h)

| ID | Task | Owner | Est | Depends | SRS |
| --- | --- | --- | --- | --- | --- |
| O-01 | Compose, Caddy, secrets, container hardening, internal networks | DQ | 12 | none | V-30, 31, 32 |
| O-02 | CI: lint, types, tests, gitleaks, Semgrep, pip-audit, OSV, Trivy | DQ | 12 | none | V-32, 33 |
| O-03 | Seed and demo data loader; offline demo build | DQ | 8 | D-09 | ASM-05 |
| O-04 | Metrics and dashboards (Prometheus, Grafana) | DQ | 6 | O-01 | OBS-01 |
| O-05 | Playwright E2E for AT-01 to AT-15 | DQ | 16 | G2 | Section 10 of SRS |
| O-06 | k6 load test and performance fixes | DQ | 6 | B-05 | PERF-01 to 03 |
| O-07 | Backup and restore scripts, deployment runbook | DQ | 6 | O-01 | AVAIL |
| O-08 | Security verification: ZAP baseline, port scan, header tests, authz matrix | DQ | 8 | B-04 | SEC-01 |
| P-01 | Methodology page and one-page methodology brief | PL | 12 | E-05 | FR-UI-13 |
| P-02 | Domain validation of thresholds, rates and mobility caps | PL | 6 | E-07 | RSK-04 |
| P-03 | Pitch deck, demo script, rehearsals, Q&A drill | PL | 16 | G3 | PRD 11 |
| P-04 | API docs, README, runbooks, evidence pack | PL | 8 | B-11 |  |

## 7. Finale Playbook (36-hour build and demo window)

The finale is for adapting to the real dummy data and polishing, not for building major new features.

| Hours | Focus | Output |
| --- | --- | --- |
| 0 to 2 | Deploy the release candidate; smoke test; assign finale owners | Green smoke test on the demo VM |
| 2 to 8 | **Adapt to the official dataset schema**: adjust adapters and mappings; re-run pipeline; check quality report | Real dataset flowing end to end |
| 8 to 14 | Review outputs with the domain lens: thresholds, rankings and recommendations that look wrong; tune parameter sets (through the approval path) | Sensible rankings and a clear demo storyline |
| 14 to 20 | Fix top defects from the checklist; accessibility and Hindi review; performance check | Zero known blockers |
| 20 to 26 | Rest rotation (at least two people always asleep or off in shifts); one person on pitch and documents | Rested team; updated pitch |
| 26 to 31 | Full AT-01 to AT-15 run; security verification run; backup and offline demo refresh | Evidence pack complete |
| 31 to 34 | Two timed rehearsals with Q&A drill | Clean 7-minute demo |
| 34 to 36 | **Freeze.** No code changes except demo-blocking fixes approved by the lead | Tagged release; fallback ready |

## 8. Capacity, Cut List and Scope Control

Planned backlog is about 720 h against about 610 h of capacity. Cut in this order, stopping when the plan fits. Items marked M in the SRS are protected: they may be simplified but not dropped.

| Order | Cut or simplify | Saves (h) |
| --- | --- | --- |
| 1 | E-13 backtest (stretch) | 12 |
| 2 | Sankey replaced by a ranked table in recommendations | 6 |
| 3 | F-11 admin screens replaced by API and CLI only | 8 |
| 4 | O-04 dashboards (keep logs and a metrics endpoint) | 6 |
| 5 | O-06 load test reduced to a smoke run | 4 |
| 6 | PDF export replaced by a print-friendly page | 8 |
| 7 | U-03 hi-fi limited to three screens | 8 |
| 8 | E-02 offline ridge fit replaced by documented fixed coefficients calibrated on synthetic data | 6 |
| 9 | B-10 user management UI replaced by CLI (seeded accounts) | 6 |
| 10 | U-04 usability test reduced to three users | 4 |
| 11 | B-11 contract tests reduced to the core endpoints | 4 |
| 12 | D-07 simplified anomaly and storyline injection (keep one storyline) | 4 |
| 13 | F-12 Hindi limited to UI chrome, recommendations and alerts (methodology page stays English) | 8 |
| 14 | F-13 accessibility pass reduced to automated checks plus a keyboard pass on primary flows | 6 |
|  | **Total available to cut** | **about 90 h** |

**Core demo scope (if the window shrinks further):** pipeline on the dataset, overview, district drill-down with the map, ranking, Why drawer, one recommendation, Target Pack CSV, English and Hindi, login with roles, audit log. Everything else is shown as roadmap.

**Scope control rule:** any new request must name what it replaces. The lead decides; the decision is logged.

## 9. Repository, Workflow and Standards

### 9.1 Repository layout (monorepo)

```
nexus/
  apps/
    web/            Next.js app (TypeScript strict)
    api/            FastAPI app
    worker/         Celery tasks (exports, what-if)
  libs/
    engine/         pure numerical library (no I/O)
    pipeline/       adapters, validators, features, CLI (Typer)
    contracts/      OpenAPI spec, JSON schemas, token JSON
  data/
    reference/      versioned reference extracts with checksums
    synthetic/      generator config and seeds
  deploy/           compose.yaml, Caddyfile, backup scripts, runbooks
  docs/             SRS, PRD, Design, Architecture, ADRs, evidence pack
  tests/            e2e (Playwright), load (k6), security
```

### 9.2 Working agreements

| Topic | Rule |
| --- | --- |
| Branching | Trunk-based with short-lived branches; `main` protected; squash merge |
| Commits and PRs | Conventional commits; PR template with checklist (tests, security, accessibility, translations, docs); one reviewer minimum, two for auth, authorisation, parameters and migrations |
| Definition of ready | Acceptance criteria written; dependencies available; fixture or mock exists |
| Definition of done | Tests pass in CI; types and lint clean; scans clean; accessibility check for UI; EN and HI strings; docs or ADR updated; demoable on staging |
| Code style | Ruff and mypy (strict on `libs/engine`); ESLint, Prettier, `tsc --noEmit`; no `any` in TypeScript without a comment |
| Decisions | Short ADR in `docs/adr` for any change to stack, schema or methodology |
| Cadence | 15-minute daily stand-up; Monday planning; Friday demo against the 7-minute script; retro every two weeks |
| Communication | One channel per workstream; blockers raised within the hour; the lead breaks ties |

## 10. Environment and Deployment

### 10.1 Local development

1. Install Docker, `uv`, Node with `pnpm`.
2. Copy `.env.example` to `.env` (placeholders only) and run `make secrets` to generate local secrets under `./secrets` (git-ignored).
3. `make up` starts Postgres/PostGIS, Redis, API, worker and web.
4. `make seed` loads reference data and the synthetic dataset; `make pipeline` runs the pipeline and publishes a run.
5. `make test` runs unit, property and contract tests; `make e2e` runs Playwright against the local stack.

### 10.2 Hardened Compose reference

```yaml
services:
  caddy:
    image: caddy:2            # pin by digest for releases
    ports: ['80:80', '443:443']
    volumes: ['./deploy/Caddyfile:/etc/caddy/Caddyfile:ro', 'caddy_data:/data']
    networks: [edge, internal]
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
    security_opt: ['no-new-privileges:true']
  api:
    build: ./apps/api
    user: '10001:10001'
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: ['no-new-privileges:true']
    networks: [internal]
    secrets: [db_password, session_key, redis_password]
    deploy: { resources: { limits: { cpus: '1.0', memory: 1g } } }
  web:       # same hardening flags as api
    build: ./apps/web
    user: '10001:10001'
    read_only: true
    tmpfs: [/tmp, /app/.next/cache]
    cap_drop: [ALL]
    security_opt: ['no-new-privileges:true']
    networks: [internal]
  worker:    # same hardening flags as api
    build: ./apps/worker
    user: '10001:10001'
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: ['no-new-privileges:true']
    networks: [internal]
    secrets: [db_password, redis_password]
  db:
    image: postgis/postgis:<pinned-tag>
    networks: [internal]
    volumes: ['pgdata:/var/lib/postgresql/data']
    secrets: [db_password]
    environment: { POSTGRES_PASSWORD_FILE: /run/secrets/db_password }
  redis:
    image: redis:7
    networks: [internal]
    secrets: [redis_password]
    command: ['sh', '-c', 'exec redis-server --requirepass $$(cat /run/secrets/redis_password)']
networks:
  edge: {}
  internal: { internal: true }   # no outbound internet for api, worker, db, redis
secrets:
  db_password: { file: ./secrets/db_password }
  session_key: { file: ./secrets/session_key }
  redis_password: { file: ./secrets/redis_password }
volumes: { pgdata: {}, caddy_data: {} }
```

Only Caddy publishes ports. Because the `internal` network has no outbound route, the engine, API and database cannot make external calls, which also enforces requirement FR-FC-16.

### 10.3 Caddyfile

```
{$DOMAIN} {
    encode zstd gzip
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
        Cross-Origin-Opener-Policy same-origin
        -Server
    }
    handle /api/* {
        reverse_proxy api:8000
    }
    handle {
        reverse_proxy web:3000
    }
}
```

The Content-Security-Policy is set per request by the Next.js middleware (it needs a nonce). Rate limiting is enforced in the API with Redis counters.

## 11. Implementation Reference Snippets

These are reference implementations to be adapted and covered by tests, not finished code.

### 11.1 Leontief solve with validation (engine)

```python
import numpy as np
from scipy.linalg import solve

def validate_technical_matrix(A: np.ndarray) -> None:
    if A.ndim != 2 or A.shape[0] != A.shape[1]:
        raise ValueError('A must be square')
    if not np.isfinite(A).all() or (A < 0).any():
        raise ValueError('A must be finite and non-negative')
    rho = float(np.max(np.abs(np.linalg.eigvals(A))))
    if rho >= 1.0:
        raise ValueError(f'spectral radius {rho:.4f} must be below 1')

def total_output_change(A: np.ndarray, dY: np.ndarray) -> np.ndarray:
    # dY has shape (sectors,) or (sectors, districts); one solve handles all districts
    dX = solve(np.eye(A.shape[0]) - A, dY)   # linear solve, never an explicit inverse
    if not np.isfinite(dX).all():
        raise ArithmeticError('non-finite Leontief result')
    return dX

def occupation_demand(B: np.ndarray, dX: np.ndarray) -> np.ndarray:
    return B @ dX                            # (occupations, sectors) @ (sectors, districts)
```

### 11.2 Fusion and shrinkage

```python
def fuse(estimates: dict, mse: dict):
    # estimates: tier -> array of workers/year (None if the tier is missing)
    avail = {k: v for k, v in estimates.items() if v is not None}
    raw = {k: 1.0 / mse[k] for k in avail}
    total = sum(raw.values())
    w = {k: x / total for k, x in raw.items()}          # renormalised over available tiers
    return sum(w[k] * avail[k] for k in avail), w

def shrink(d_local, d_state_share, n_eff, kappa):
    lam = n_eff / (n_eff + kappa)
    return lam * d_local + (1.0 - lam) * d_state_share
```

### 11.3 Min-cost flow reallocation (NetworkX)

```python
import networkx as nx

def plan_reallocation(surplus, deficit, edges, big_m=10**6):
    # surplus, deficit: {district: int units}; edges: [(u, v, cost_per_unit:int, capacity:int)]
    G = nx.DiGraph()
    S, D = sum(surplus.values()), sum(deficit.values())
    for n, s in surplus.items():
        G.add_node(n, demand=-s)          # negative demand = supply
    for n, d in deficit.items():
        G.add_node(n, demand=d)
    for u, v, cost, cap in edges:
        G.add_edge(u, v, weight=cost, capacity=cap)
    G.add_node('_UNMET', demand=-D)       # fallback supply at a prohibitive cost
    G.add_node('_UNUSED', demand=S)       # sink for unused surplus at zero cost
    for n in deficit:
        G.add_edge('_UNMET', n, weight=big_m)
    for n in surplus:
        G.add_edge(n, '_UNUSED', weight=0)
    flow = nx.min_cost_flow(G)
    moves = {(u, v): f for u, nbrs in flow.items() for v, f in nbrs.items()
             if f > 0 and not u.startswith('_') and not v.startswith('_')}
    unmet = {n: flow['_UNMET'][n] for n in deficit if flow['_UNMET'].get(n, 0) > 0}
    return moves, unmet       # unmet shortages become capacity-expansion candidates (Full)
```

All costs and capacities must be integers (network simplex is exact on integers). Run it per trade cluster with the trade-compatibility mask applied to `edges`.

### 11.4 Authorisation scope (API)

```python
from dataclasses import dataclass
from fastapi import Depends, HTTPException

@dataclass(frozen=True)
class Scope:
    role: str
    states: frozenset | None       # None means all
    districts: frozenset | None

def require_roles(*roles):
    def dep(scope: Scope = Depends(get_scope)) -> Scope:   # get_scope reads the server-side session
        if scope.role not in roles:
            raise HTTPException(status_code=403)
        return scope
    return dep

def apply_scope(stmt, model, scope: Scope):
    if scope.states is not None:
        stmt = stmt.where(model.state_code.in_(scope.states))
    if scope.districts is not None:
        stmt = stmt.where(model.district_lgd.in_(scope.districts))
    return stmt                    # every repository query must pass through this
```

### 11.5 Session cookie, password hashing and CSRF (API)

```python
import secrets
from argon2 import PasswordHasher
from fastapi import HTTPException, Request

ph = PasswordHasher(time_cost=2, memory_cost=19456, parallelism=1)   # 19 MiB, OWASP minimum

def set_session_cookie(response, session_id: str):
    response.set_cookie('__Host-sid', session_id, httponly=True, secure=True,
                        samesite='lax', path='/')                     # no Domain attribute

def csrf_guard(request: Request):
    if request.method in ('POST', 'PUT', 'PATCH', 'DELETE'):
        if request.headers.get('origin') not in ALLOWED_ORIGINS:
            raise HTTPException(status_code=403)
        token = request.headers.get('x-csrf-token', '')
        if not secrets.compare_digest(token, request.state.session.csrf):
            raise HTTPException(status_code=403)
```

### 11.6 Export safety and audit chain

```python
import hashlib, json

_DANGEROUS = ('=', '+', '-', '@', '\t', '\r')

def csv_safe(value):
    # applies to strings only; real numbers stay numeric
    return "'" + value if isinstance(value, str) and value.startswith(_DANGEROUS) else value

def chain_hash(prev_hash: str, event: dict) -> str:
    payload = json.dumps(event, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return hashlib.sha256((prev_hash + payload).encode('utf-8')).hexdigest()
    # insert under an advisory lock so concurrent writers cannot fork the chain
```

For Excel, create workbooks with `xlsxwriter.Workbook(path, {'strings_to_formulas': False})`. For PDF, give WeasyPrint a `url_fetcher` that raises for every URL except local static assets.

### 11.7 CSP with a per-request nonce (Next.js middleware)

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
  const headers = new Headers(req.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const res = NextResponse.next({ request: { headers } });
  res.headers.set('Content-Security-Policy', csp);
  return res;
}
```

## 12. Synthetic Data and Seed Plan

The generator exists so the product works end to end before and beside the official dataset, and so the demo has clear stories. **Everything it produces carries `data_origin=synthetic`.**

| Element | Specification |
| --- | --- |
| Determinism | One seed in config; same seed yields the same files |
| Geography | Pilot-state districts from the reference loaders; each district has a sector-mix profile (for example industrial, agricultural, services) |
| Signals | Monthly series for industrial power load, e-way bill volume, MSME credit, commercial vehicle registrations: trend + seasonality + noise, scaled by the district's sector mix and size |
| Demand link | Hidden "true" employment growth generated from signals at lags of 2 to 4 months, so telemetry genuinely leads postings in the synthetic world; postings = true hiring × portal coverage + noise |
| Supply | Seats and enrolment by centre and trade with realistic utilisation and throughput |
| Demo storylines | (1) A district with a power-load surge and rising postings in welding and CNC, supply flat: critical shortage; (2) a neighbouring district with oversupply in the same trade: reallocation target; (3) a district with falling postings in tailoring and high seats: approaching saturation; (4) a district with a missing telemetry source: reduced-coverage badge |
| Data-quality traps | Duplicates, out-of-range values, unmapped job titles, a late source, a malformed row: exercise quarantine and gates |
| Labelling | Badge in UI, API field and export footer; methodology page explains why it exists |
| Replacement | When the official dataset arrives, adapters load it; the generator stays for telemetry and for tests |

## 13. Test Plan and CI Quality Gates

| Gate | Tools | Blocks merge when |
| --- | --- | --- |
| Static quality | Ruff, mypy, ESLint, `tsc` | Any error |
| Unit and property | pytest, Hypothesis, Vitest | Failure; engine coverage under 90% or API under 80% |
| Golden and determinism | Reference district fixtures; hash comparison | Output hash differs without an approved parameter change |
| Authorisation matrix | Generated role × route × scope tests | Any unexpected allow |
| Contract | Schemathesis against OpenAPI | Schema or fuzz failure |
| Secrets | gitleaks | Any finding |
| Dependencies | pip-audit, OSV-Scanner, npm audit | High or critical without an approved exception |
| Static security | Semgrep (Python, TypeScript, SQL rules) | High findings |
| Containers | Trivy on images; config scan on Compose | High or critical |
| UI quality | Playwright E2E for AT scenarios, axe, Lighthouse CI | Failure; critical axe violation; performance budget exceeded |
| Deployed checks (staging) | ZAP baseline, header assertions, external port scan | Open DB or Redis port; missing headers; high alerts |
| Load (week 4) | k6 | p95 above the target in PERF-01 to PERF-03 |

## 14. Security Implementation Checklist

Maps the Architecture vulnerability register to concrete tasks. Each row needs evidence in the evidence pack (test name, screenshot or scan output).

| Register IDs | Implementation task | Owner | Evidence |
| --- | --- | --- | --- |
| V-01 to V-06, V-09, V-10 | Session cookie, rotation, timeouts, CSRF guard, Argon2id, lockout, TOTP, seed-account guard, redirect allow-list (tasks B-02, B-03) | BE | E2E tests; cookie attribute assertions |
| V-07, V-08 | `Scope`, `apply_scope`, route policy declarations, matrix tests (B-04) | BE | Matrix test report |
| V-12, V-13 | ORM-only access, DB roles, Pydantic `extra=forbid`, Semgrep rules | BE | Semgrep and Schemathesis output |
| V-14, V-34, V-35 | CSP nonce middleware, headers in Caddy, no external origins, self-hosted fonts and tiles | FA, DQ | Header test; blocked-request test |
| V-15, V-16, V-17, V-18 | Export sanitisers, WeasyPrint fetcher, upload checks (Full UI; CLI validation in MVP), `defusedxml`, no pickle | BE | Unit tests with malicious fixtures |
| V-19, V-28 | Redacting log filter, audit hash chain, insert-only grants | BE, DQ | Chain verification test; grant listing |
| V-21, V-22, V-23, V-24 | Source checksums, anomaly rules, parameter immutability and approval, ρ(A) validation, small-cell suppression | DM, DQ | Property and fixture tests |
| V-25, V-26, V-27 | Scope-aware cache keys, atomic publish, server-side caps | BE, DQ | Two-role cache test; fault-injection test |
| V-30, V-31 | Internal networks, no published ports except Caddy, hardened containers | DQ | External port scan; `docker inspect` assertions |
| V-32, V-33 | gitleaks, Docker secrets, lockfiles with hashes, 14-day release-age rule in Renovate | DQ | CI logs |
| V-36, V-37 | Rate limits and quotas, polling or capped SSE | BE | k6 and unit tests |

Any item that cannot be completed gets a written exception: risk, compensating control, owner, date. The lead signs it.

## 15. MVP Deployment Runbook and Demo Fallback

### 15.1 Target host

One Linux VM (about 4 vCPU, 8 GB RAM, 80 GB disk) in India, key-based SSH from a restricted address range, firewall allowing 22, 80 and 443 only, automatic security updates, time sync.

### 15.2 Release procedure

1. Tag the release on `main`; CI builds, scans and publishes images.
2. On the VM: pull images, run `docker compose up -d`, then migrations, then `nexus pipeline run --publish`.
3. Smoke test: login, overview, drill-down, export, audit entry.
4. Run the deployed checks (headers, port scan, ZAP baseline) and store outputs in the evidence pack.
5. Record the run ID and parameter set in the release notes.

### 15.3 Backup and rollback

| Item | Procedure |
| --- | --- |
| Backup | Nightly `pg_dump` plus raw-file volume snapshot, encrypted, copied off the VM; restore tested once before the finale |
| Application rollback | Redeploy the previous image tag; migrations are backward compatible (expand then contract) |
| Bad run | Flip the current-run pointer to the previous published run from the admin CLI |

### 15.4 Demo fallback ladder

1. Live system on the VM.
2. Local laptop stack from the offline demo build with the seeded dataset (`make demo`), no internet needed.
3. Pre-recorded screen capture of the full 7-minute script as the last resort.

## 16. Risk Register

L = likelihood, I = impact (H, M, L).

| ID | Risk | L | I | Mitigation | Trigger | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Dummy dataset arrives late or differs from assumptions | H | H | Adapter layer, synthetic fallback, early schema request | No schema by end of week 1 | DQ |
| R-02 | Scope exceeds capacity | H | H | Cut list, weekly capacity check, feature freeze at G3 | Backlog burn-down behind plan by more than 15% | PL |
| R-03 | Taxonomy crosswalk poor | M | M | Coverage report, conservative defaults, show confidence impact | Mapping coverage under 75% | DQ |
| R-04 | Engine outputs implausible to domain experts | M | H | Early review (P-02), sensitivity charts, configurable thresholds | Expert objection | DM |
| R-05 | Map or boundary licence and depiction issue | M | M | Official-depiction dataset chosen in week 0; no basemap | Licence unclear | FB |
| R-06 | Security items slip | M | H | Security tasks in the sprint, owner per item, exception process | Items marked M open at G3 | BE |
| R-07 | Performance below targets | L | M | Materialised snapshots, indexes, caching, early k6 | p95 above target at G2 | DQ |
| R-08 | Hindi quality or layout issues | M | M | Native review, pseudo-localisation, early integration | Review not scheduled by week 2 | FB |
| R-09 | Key person unavailable | M | H | Backups in the role table, written runbooks, pair on critical modules | Absence over two days | PL |
| R-10 | Demo failure on the day | M | H | Fallback ladder, rehearsals, freeze, pre-warmed caches | Any failed rehearsal | PL |
| R-11 | Dependency compromise or breaking update | L | H | Lockfiles with hashes, scans, 14-day age rule, freeze during finale | Scanner alert | DQ |
| R-12 | Over-claiming accuracy with synthetic data | M | H | Labels, methodology wording, rehearsed answer on accuracy | Any slide or text claiming real-world accuracy | PL |
| R-13 | Accessibility gaps found late | M | M | Axe in CI from week 1, keyboard pass in week 3 | Critical violations at G3 | FB |
| R-14 | VM or network issues at the venue | M | M | Offline build, hotspot, recorded demo | Connectivity check at hour 0 | DQ |

## 17. After the Hackathon: Roadmap to the Full Product

| Phase | Indicative duration | Focus | Key dependencies |
| --- | --- | --- | --- |
| **R1 Pilot** | About 4 months | Real adapters for open sources; one or two MoU feeds; backtests on real data; governance UI; alerts with notifications; OIDC SSO; third and fourth language; penetration test | Data-sharing agreements, hosting approval, planner access for UAT |
| **R2 National** | About 6 months | All states; Kubernetes and HA; Dagster; row-level security; API keys, webhooks; scheme integrations; GIGW audit; STQC clearance; DR drills | Funding and capacity, state onboarding, security audit slots |
| **R3 Evolution** | Ongoing | Governed ML nowcaster with attributions; scenario library; informal-sector survey inputs; sector-council views | Governance board approval |

**Team needed for R1 and R2 (indicative):** product manager, two backend engineers, two data engineers or scientists, two frontend engineers, one UX designer, one platform/security engineer, one QA engineer, with a domain advisor from MSDE or NSDC and external security auditors.

## 18. Readiness Checklists

### 18.1 Gate checklist

| Gate | Must be true |
| --- | --- |
| G0 | Contracts (OpenAPI, schema, engine signatures) approved; everyone runs the stack locally; CI green on an empty change |
| G1 | Skeleton deployed over HTTPS; login works; fake data visible in overview and export; secrets scan clean |
| G2 | Dataset (or synthetic-labelled data) produces rankings in the UI; quality report visible; first E2E tests green |
| G3 | All M items built or formally cut; AT-01 to AT-15 attempted; Hindi complete for UI chrome; security items M implemented or excepted |
| G4 | All AT scenarios pass on the deployed build; evidence pack complete; two clean rehearsals; offline build and recording ready |

### 18.2 Demo-day checklist

- Release tag deployed; run ID and parameter set recorded; data-as-of date confirmed.
- Browser profiles cleared; language set; zoom at 100%; notifications off.
- Accounts ready (national planner, state planner, auditor) with MFA devices charged.
- Offline build tested on two laptops; recording on a USB drive.
- Pitch roles assigned (speaker, driver, Q&A); the answers on AI, accuracy, data, security and scale rehearsed.
- Evidence pack on hand: methodology brief, security register status, test reports, accessibility results.
