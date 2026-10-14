# Kaushal Setu (कौशल सेतु)
### Labour Market Intelligence & Skill Demand-Supply Forecasting System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61dafb.svg)](https://vitejs.dev/)
[![Status: MVP](https://img.shields.io/badge/Status-MVP%20Active-success.svg)]()

> **Official Project Name:** Kaushal Setu (कौशल सेतु)  
> **Planning Code Name:** LMI-NEXUS  
> **SIH Problem Statement:** PS 26246 (Ministry of Skill Development & Entrepreneurship - MSDE)

---

## 1. Vision & Problem Statement

India trains lakhs of candidates every year across PMKVY, ITIs, and polytechnics. However, training seat allocation is frequently misaligned with forward-looking industry demand at the district and trade level. Planners often discover shortages or oversupply only after placement cycles conclude—too late to shift annual targets.

**Kaushal Setu (कौशल सेतु)** bridges this gap by turning high-frequency leading economic signals (DISCOM industrial electricity load, GSTN freight e-way bills, RBI MSME bank credit, and online job postings) into forward-looking, district-level skill demand forecasts. It cross-references demand with existing training capacity, ranks mismatches across 5 distinct severity bands, triggers early-warning alerts, and recommends mathematically optimized seat reallocations using min-cost network flow.

---

## 2. Core Pillars & Methodology

1. **Composite Demand Index (CDI):**
   - Direct leading indicator elasticity nowcasting (power, e-way bills, bank credit, and NCS postings).
   - Leontief input-output technical coefficients matrix modeling indirect tier-1 and tier-2 supply chain hiring multipliers.
   - P10, P50, and P90 confidence intervals admitting data uncertainty honestly.

2. **Supply & Capacity Model:**
   - Evaluates PMKVY, ITI, and polytechnic sanctioned seats, enrolments, certifications, and realistic industry absorption rates.

3. **5-Band Severity Classification:**
   - 🔴 **Critical Shortage:** Acute deficit requiring emergency capacity addition.
   - 🟠 **Shortage Watch:** Projected deficit with upward momentum.
   - 🟢 **Balanced:** Training capacity closely matches industry demand.
   - 🔵 **Oversupply Watch:** Low absorption; candidate placement risk.
   - 🟣 **Critical Surplus:** Severe oversupply; prime candidate for seat shift.

4. **Seat Reallocation Optimizer:**
   - Formulated as a Min-Cost Flow transportation problem (NetworkX).
   - Minimizes student travel distance while transferring excess seats from saturated districts to high-deficit industrial hubs.
   - Calculates tangible capital expenditure (Capex) savings compared to building new centres.

5. **Decision Transparency & "Why?" Drawer:**
   - Pure explainable mathematics; zero LLM hallucinations in official policy metrics.
   - Real-time factor decomposition breakdown for every number.

6. **Tamper-Evident SHA-256 Audit Chain:**
   - Immutable cryptographic hash chain logging every simulation, export, and parameter change for CAG/STQC compliance.

7. **Multilingual & Accessible UI:**
   - Seamless one-click switching between English and Hindi (हिन्दी).
   - Persona-based scoping: National Planner (Meera), State Planner (Rajesh), District Skill Officer (Farida), and Auditor.

---

## 3. Project Structure

```
kaushal-setu/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, security, SHA-256 audit chain
│   │   ├── data/           # Pilot datasets (MH, UP, TN, 12 districts, 5 sectors, 25 trades)
│   │   ├── engine/         # CDI nowcaster, supply model, gap classifier, min-cost flow reallocation, what-if simulator
│   │   ├── routes/         # Overview, rankings, districts, recommendations, alerts, simulate, export, audit, sources
│   │   └── main.py         # FastAPI application entrypoint
│   └── run.py              # Server launcher
├── frontend/               # React + Vite + Tailwind CSS + Lucide + Recharts
│   ├── src/
│   │   ├── components/     # Header, KPIs, Rankings Table, Why? Drawer, Reallocations, What-If Simulator, Alerts
│   │   ├── locales/        # Bilingual translations (en.json, hi.json)
│   │   ├── App.tsx
│   │   └── main.tsx
├── docs/                   # PRD, SRS, Technical Architecture, Design System, Implementation Plan
├── .gitignore
└── README.md
```

---

## 4. Quickstart Guide

### Backend (FastAPI)
```bash
# Install dependencies
python -m pip install fastapi uvicorn pydantic numpy scipy scikit-learn networkx

# Run server
python backend/run.py
# API Docs available at: http://localhost:8000/docs
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Dashboard available at: http://localhost:5173
```

---

## 5. API Reference Summary

- `GET /api/overview` - National & state KPI rollups and sector breakdown.
- `GET /api/rankings` - Ranked district x trade mismatch matrix with 5-band severity.
- `GET /api/districts/{lgd}` - District drill-down with telemetry signals and "Why?" factor breakdown.
- `GET /api/recommendations` - Optimized seat reallocation proposals.
- `GET /api/alerts` - Active early warning flags with bilingual trigger narratives.
- `POST /api/simulate` - Interactive what-if policy intervention sandbox.
- `GET /api/export/target-pack` - Download official CSV Target Pack.
- `GET /api/audit/logs` & `GET /api/audit/verify` - Cryptographic hash chain verification.
- `GET /api/sources` - Source registry and telemetry health status.

---

## 6. License & Attribution

Developed for **Smart India Hackathon (SIH PS 26246)** under the guidance of the **Ministry of Skill Development and Entrepreneurship (MSDE)**.
Licensed under the [MIT License](LICENSE).
