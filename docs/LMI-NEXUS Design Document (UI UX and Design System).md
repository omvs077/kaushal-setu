# Kaushal Setu (कौशल सेतु): Design Document (UI/UX and Design System)

*Official Project Name: Kaushal Setu (कौशल सेतु) · Planning Code Name: LMI-NEXUS · SIH PS 26246 · MSDE · Version 1.0 · Companion to the SRS, PRD, Architecture and Planning documents*

## 1. Design Vision and Principles

**Vision:** an operational command centre for skilling planners that feels calm, precise and trustworthy: dense enough for experts, clear enough for a district officer on a first visit.

| # | Principle | In practice |
| --- | --- | --- |
| 1 | **Decision first, evidence second** | Each screen leads with "what needs attention", then supports it with the numbers and the "Why?" |
| 2 | **Every number explains itself** | Value, unit, range, confidence, run and freshness are one tap away or visible |
| 3 | **Honest by default** | Synthetic, stale, low-coverage and simulated data are visibly marked everywhere, including exports |
| 4 | **Spatial and tabular together** | The map is never the only way to reach information; a list or table is always in sync |
| 5 | **Calm density** | Matte porcelain canvas, soft glass cards and restrained colour so that status colours carry meaning |
| 6 | **Accessible and multilingual from the start** | WCAG 2.1 AA, keyboard-first, text that survives 40% expansion and Indic scripts |
| 7 | **Progressive disclosure** | Overview → state → district → trade; detail appears on demand, not all at once |
| 8 | **Neumorphism as seasoning** | Soft-pressed controls add tactility but never carry information or contrast |

## 2. Context of Use

| Factor | Implication for design |
| --- | --- |
| Primary device | Desktop or laptop in a government office (1366 × 768 is common); tablets and phones are secondary and read-mostly |
| Connectivity | Variable; aim for fast first paint, small JS, no external fonts or tiles |
| Languages | Hindi and English at MVP; Marathi, Gujarati, Tamil next; users switch language mid-session |
| Expertise | Mix of analysts (dense tables) and district officers (guided views) |
| Setting | Review meetings and screen sharing: views must be shareable by URL and printable |
| Accessibility | Users with low vision, colour-vision deficiency and keyboard-only needs; screen readers |
| Trust | Numbers feed policy decisions; provenance matters more than polish |

## 3. Information Architecture

### 3.1 Sitemap and routes

```
/login                         Sign in (+ TOTP step for privileged roles)
/                              Overview (national KPIs, bands, top shortages, alerts)
/states/{state}                State view (districts ranked, trades ranked, map zoomed)
/districts/{lgd}               District detail (demand vs supply, trade table, centres)
/trades/{code}                 Trade view (geographies ranked for one trade)
/recommendations               Seat-shift recommendations (filterable)
/simulate                      What-if workspace
/alerts                        Alert feed and history
/exports                       Export builder and Target Pack
/sources                       Source health and data quality
/methodology                   How the index works, limits, legend
/admin/runs  /admin/parameters  /admin/users  /admin/audit      (role-restricted)
```

Shared query parameters: `horizon` (3m, 6m, 12m), `sector`, `scheme`, `level` (NSQF), `run`, `lang`. All filters live in the URL so a link reproduces the view for anyone with permission.

### 3.2 Global navigation

| Element | Behaviour |
| --- | --- |
| Left rail | Icons with visible labels; collapsible to icons; current page marked with `aria-current` |
| Top bar | Breadcrumb (National › State › District › Trade), horizon selector, data-as-of and run badge, language switcher, user menu |
| Global search | Press `/` to focus; finds district, state, trade; arrow keys and Enter to navigate |
| Context bar | Active filters shown as removable chips below the top bar |

## 4. Core User Flows

| Flow | Steps (target) | Success signal |
| --- | --- | --- |
| **F1 Find where to act** (Meera, Rajesh) | Overview → click top shortage card → ranked list for that trade/state → open district (3 to 4 steps) | Under 60 seconds to name the top five shortage districts |
| **F2 Understand a number** | Click any value or chip → "Why?" drawer → read contributions, sources, confidence → close and continue | Drawer opens in under 300 ms; focus returns to the trigger |
| **F3 Act on an alert** (Farida) | Alerts → open alert → read recommendation → (Full: acknowledge) | Alert to recommendation in two steps |
| **F4 Test a decision** | District detail → "What if" → change seats or scale a signal → compare to baseline | Result visible without leaving the page |
| **F5 Export** | Any ranking → Export → choose format and scope → download Target Pack | Two clicks plus format choice |
| **F6 Verify trust** (Anil, Auditor) | Sources → stale source → quality report; Admin › Runs › manifest | Manifest reachable in two steps |

## 5. Layout System

### 5.1 Split-window layout

The blueprint's 80/20 concept is kept as the default in spirit, refined for usability:

| Aspect | Specification |
| --- | --- |
| Default split | About 75% analytics area and 25% map panel on screens 1280 px and wider |
| Resizable | Drag handle (also keyboard: arrow keys when focused, 16 px steps); range 60/40 to 85/15; persisted for the session |
| Map expand | "Expand map" button opens a full-screen map with a list overlay; `Esc` returns |
| Map collapse | Collapses to a slim rail on narrow screens; below 1024 px the map becomes a tab ("Map" / "List") |
| Selection sync | Selecting on the map highlights the row and card; selecting a row highlights the polygon; one shared selection state in the URL |
| Why the map is secondary | Planners decide from rankings and numbers; the map provides spatial context and a pointing device |

### 5.2 Grid and breakpoints

| Breakpoint | Width | Layout |
| --- | --- | --- |
| Compact | < 640 px | Single column; rail becomes bottom or hamburger navigation; read-only emphasis |
| Medium | 640 to 1023 px | Single column with Map/List tabs |
| Large | 1024 to 1439 px | Rail collapsed by default; split window |
| XL | ≥ 1440 px | Rail expanded; split window; 12-column content grid with 24 px gutters |

Content max width 1680 px; 8 px base spacing unit.

## 6. Design System

### 6.1 Colour tokens

Core tokens come from the blueprint; text variants and chip tints were added after checking WCAG contrast ratios against the actual surfaces.

| Token | Value | Role | Contrast (on canvas #F4F4F5) |
| --- | --- | --- | --- |
| `canvas` | #F4F4F5 | Matte porcelain background | n/a |
| `surface-glass` | rgba(255,255,255,0.85) + blur(12px) | Cards, drawers | n/a (renders about #FDFDFE) |
| `surface-solid` | #FFFFFF | Fallback for glass; tables | n/a |
| `ink` | #0F172A | Primary text | 16.2 |
| `ink-secondary` | #475569 | Secondary text | 6.9 |
| `ink-tertiary` | #64748B | Captions; **only on white or glass** (4.7); not on canvas (4.3) | 4.3 |
| `border-subtle` | #E4E4E7 | Decorative card hairline | 1.15 (decorative only) |
| `border-strong` | #71717A | Inputs, controls, focus boundaries | 4.4 |
| `accent-telemetry` | #2563EB | Primary actions, links, flow lines | 4.7 |
| `accent-telemetry-strong` | #1D4ED8 | Hover/pressed, small text links, focus ring | 6.1 |
| `accent-capex` | #7C3AED | Credit and investment indicators | 5.2 |
| `warning` | #F59E0B (text #92400E) | Stale, simulated or low-coverage notices | text 6.5 |

White text on `accent-telemetry` is 5.2 : 1 and on `#B91C1C` is 6.5 : 1.

### 6.2 Band semantics (five-band severity scale)

**Design decision D-01.** The blueprint used red, amber and green for shortage, saturation and balance. A two-sided scale needs five steps, and red/amber/green alone is unreliable for colour-vision deficiency. The system therefore uses a **red to blue diverging scale** around green "Balanced", and keeps amber for *data caveats* (stale, simulated, low coverage). Every band also has a label, icon and pattern. This is reversible through tokens.

| Band | Map/solid fill | Text on tint | Chip tint | Icon | Map pattern | Text contrast on tint |
| --- | --- | --- | --- | --- | --- | --- |
| Critical shortage | #DC2626 | #B91C1C | #FEE2E2 | Double up arrow | Solid | 5.3 |
| Shortage watch | #F97316 | #C2410C | #FFEDD5 | Single up arrow | Light diagonal lines | 4.5 |
| Balanced | #34D399 | #047857 | #D1FAE5 | Equals sign | None | 4.8 |
| Approaching saturation | #60A5FA | #1D4ED8 | #DBEAFE | Single down arrow | Dots | 5.5 |
| Critical oversupply | #1D4ED8 | #1E3A8A | #E0E7FF | Double down arrow | Cross-hatch | 8.4 |

Adjacent map fills differ by only about 1.3 to 2.6 : 1, so **patterns, 1 px polygon borders and labels are mandatory**; colour is never the only cue. Chips use dark text on a light tint rather than white on a bright fill.

### 6.3 Data-caveat badges

| Badge | When | Style |
| --- | --- | --- |
| Synthetic | Any value derived from synthetic data | Amber tint, text #92400E, flask icon |
| Simulation | What-if result | Dashed border, "Simulation" label, never mixed with published values |
| Low confidence | Confidence below the Medium threshold | Outlined chip with exclamation icon and reason on hover and focus |
| Stale | Source or run older than 1.5 × cadence | Amber tint, clock icon, "as of" date |
| Reduced coverage | A signal tier missing | Amber outline with tier names |

### 6.4 Typography

| Script | Font (self-hosted WOFF2, subsetted) | Notes |
| --- | --- | --- |
| Latin | Inter, with tabular numerals for tables | Variable font to limit weight files |
| Devanagari (Hindi, Marathi) | Noto Sans Devanagari | Line height 1.6; +1 px size for parity |
| Gujarati, Tamil | Noto Sans Gujarati, Noto Sans Tamil | Added with those languages |

| Style | Size / line | Weight | Use |
| --- | --- | --- | --- |
| Display | 36 / 44 | 600 | Page KPIs |
| H1 | 30 / 38 | 600 | Page title |
| H2 | 24 / 32 | 600 | Section |
| H3 | 20 / 28 | 600 | Card title |
| Body | 16 / 24 | 400 | Drawers, policy text |
| Body small | 14 / 20 | 400 | Tables, filters |
| Caption | 12 / 16 | 500 | Badges, axis labels (never below 12) |

Fallback stacks are system sans-serif; text scales with user font size; no text embedded in images.

### 6.5 Spacing, radius and elevation

| Token | Values |
| --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64 px |
| Radius | 8 px controls, 16 px cards, 24 px drawers, full for chips |
| Glass card | `background: rgb(255 255 255 / 0.85); backdrop-filter: blur(12px); border: 1px solid #E4E4E7; box-shadow: 0 1px 2px rgb(15 23 42 / 0.06), 0 8px 24px rgb(15 23 42 / 0.06)` |
| Neumorphic raised | `box-shadow: 6px 6px 12px #D9D9DD, -6px -6px 12px #FFFFFF` plus a 1 px `border-strong` |
| Neumorphic pressed | `box-shadow: inset 3px 3px 6px #E2E2E5, inset -3px -3px 6px #FFFFFF` plus a 1 px `border-strong` |
| Fallbacks | Solid white when `backdrop-filter` is unsupported or `prefers-reduced-transparency` is set; blur is never applied over the map |

**Neumorphic-Lite rules:** used for toggles, segmented controls, sliders and the resize handle only. The 1 px strong border supplies the required 3 : 1 component contrast; the shadow is decoration. Text and data never sit on neumorphic surfaces.

### 6.6 Motion

| Pattern | Spec |
| --- | --- |
| Durations | 120 ms micro, 200 ms drawers and cards, 300 ms page transitions; ease-out |
| Map | Fly-to on selection under 400 ms; disabled under reduced motion |
| Numbers | Count-up only on first load of the overview; disabled under reduced motion |
| Reduced motion | `prefers-reduced-motion: reduce` removes parallax, count-ups and fly-to; transitions become opacity only |
| Rule | Motion never carries information and never auto-plays beyond 5 seconds |

### 6.7 Iconography

Lucide icon set, 20 px default, 1.5 px stroke, always paired with a visible or accessible text label. Directional band icons (arrows) are custom SVG so they remain legible in greyscale.

### 6.8 Token implementation (Tailwind v4)

```css
@theme {
  --color-canvas: #F4F4F5;
  --color-surface: #FFFFFF;
  --color-ink: #0F172A;
  --color-ink-secondary: #475569;
  --color-ink-tertiary: #64748B;
  --color-border-subtle: #E4E4E7;
  --color-border-strong: #71717A;
  --color-accent: #2563EB;
  --color-accent-strong: #1D4ED8;
  --color-capex: #7C3AED;
  --color-caveat-text: #92400E;
  --color-caveat-tint: #FEF3C7;

  --color-band-crit-short: #DC2626;  --color-band-crit-short-text: #B91C1C;  --color-band-crit-short-tint: #FEE2E2;
  --color-band-short-watch: #F97316; --color-band-short-watch-text: #C2410C; --color-band-short-watch-tint: #FFEDD5;
  --color-band-balanced: #34D399;    --color-band-balanced-text: #047857;    --color-band-balanced-tint: #D1FAE5;
  --color-band-approach-sat: #60A5FA; --color-band-approach-sat-text: #1D4ED8; --color-band-approach-sat-tint: #DBEAFE;
  --color-band-crit-over: #1D4ED8;   --color-band-crit-over-text: #1E3A8A;   --color-band-crit-over-tint: #E0E7FF;

  --radius-control: 8px;  --radius-card: 16px;  --radius-drawer: 24px;
  --font-sans: Inter, 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Tamil', system-ui, sans-serif;
}
```

Tokens are defined once in a JSON file and generated into the CSS above, the Figma variables and the chart theme, so the three never drift.

## 7. Component Library

Every component ships with states: default, hover, focus-visible, active, disabled, loading and error (where applicable), and is documented in Storybook with an accessibility check.

| Component | Variants | Specification and accessibility notes |
| --- | --- | --- |
| Button | Primary, secondary, ghost, destructive; icon-only | Minimum target 40 × 40 px (24 px absolute minimum); icon-only needs an accessible name; loading state disables and announces |
| Segmented control (horizon) | 3m / 6m / 12m | Neumorphic pressed state plus a 1 px strong border; arrow-key navigation; `role=radiogroup` |
| Toggle / switch | On, off | Label always visible; state also shown by text or icon, not only position |
| Select / multi-select | Single, multi, searchable | Built on Radix; type-ahead; selected values shown as removable chips |
| Filter bar | Sector, scheme, level, state | Chips below the top bar; "Clear all"; result count announced politely |
| KPI card | Value, delta, sparkline, band | Glass card; value in display type; delta with arrow and sign (not colour only); tooltip for definition |
| Band chip | Five bands | Tint + text variant + icon + label; never colour alone |
| Severity bar | Horizontal bipolar bar from −1 to +1 with P10-P90 whisker | Text value beside the bar; whisker described in the tooltip |
| Confidence badge | High, Medium, Low | Label + icon; reason on focus and hover; Low is outlined |
| Caveat badges | Synthetic, simulation, stale, reduced coverage | See section 6.3 |
| Ranking table | Sortable, filterable, paginated, row selection | Real `<table>`; `aria-sort`; sticky header; column chooser; keyboard row navigation; density toggle |
| Breadcrumb | National › State › District › Trade | `nav aria-label=Breadcrumb`; last item `aria-current=page` |
| Map panel | Choropleth, legend, zoom controls, expand | Polygons are not individually tabbable; the synchronised list is the keyboard path; `aria-label` summarising the view; legend lists band labels and patterns |
| Demand vs supply chart | Lines or bars by horizon with a P10-P90 band | Colour-blind-safe pair (cobalt and violet) plus direct labels; data table toggle |
| Flow diagram | Sankey of recommended seat shifts | Link labels with values; list alternative; reduced-motion safe |
| Why drawer | Right-side drawer | Dialog semantics; focus trap on small screens; `Esc` closes; focus returns to trigger |
| Recommendation card | Action text, units, gap reduction, cost, confidence, export | Text from translated templates; one primary action |
| Alert item | Shortage or saturation, level, change vs previous run | Icon + text + time; link to Why? |
| Source health row | Fresh, stale, missing | Status text and icon, last load time, quality score |
| What-if panel | Seat stepper, signal slider, reset | Slider has numeric input twin; result delta shown against baseline; "Simulation" banner |
| Toast | Info, success, error | `role=status` or `alert`; never the only place an error appears; 8 s minimum, dismissible |
| Empty / error / loading | Skeleton, empty with next step, error with retry and request ID | Skeletons use `aria-busy`; errors show a plain-language message plus a copyable request ID |
| Language switcher | EN, हिन्दी, (मराठी, ગુજરાતી, தமிழ்) | Each option labelled in its own script with `lang` attribute; preserves current page and filters |
| Login and MFA | Password, TOTP | Labels, error summary, paste allowed in password and code fields, no autofocus traps |

## 8. Screen Specifications

Wireframes are structural, not visual. Sizes assume 1440 px width.

### 8.1 Overview (`/`)

```
+------+---------------------------------------------------------+-------------+
| Rail | National            [3m|6m|12m]   Run 42 | as of Sep 2026  | MAP  [ ]    |
| Home +---------------------------------------------------------+ (choropleth |
| Alrts| [Filters: Sector v  Scheme v  Level v]   chips...        |  by band,   |
| Recs |                                                         |  patterns)  |
| What |  +---------+ +---------+ +---------+ +-----------+      |             |
| Exp  |  | Demand  | | Supply  | | Net gap | | Critical  |      | Legend      |
| Src  |  | 12.4 L  | | 10.9 L  | | +1.5 L  | | cells: 37 |      | [bands]     |
| Meth |  +---------+ +---------+ +---------+ +-----------+      |             |
|      |  Band distribution  [=====|====|=====|===|=]            | Expand map  |
|      |                                                         |             |
|      |  Top shortages (ranked)        Top oversupply (ranked)  | Selected:   |
|      |  1 Welder, Thane   +0.42 A     1 Tailor, X    -0.38 V   | District card|
|      |  2 CNC Op, Pune    +0.37 A     2 ...                    |             |
|      |                                                         |             |
|      |  Alerts (recent)   [!] Shortage watch -> Critical ...    |             |
+------+---------------------------------------------------------+-------------+
```

| Region | Content | Interaction |
| --- | --- | --- |
| KPI row | Predicted demand, projected supply, net gap, count of critical cells; delta vs previous run | Click opens the matching ranking; value opens Why? |
| Band distribution | Stacked bar of the five bands by cells or headcount (toggle) | Click a segment filters the lists |
| Top lists | Ten items each, with severity bar, band chip and confidence | Row opens district/trade; keyboard Enter |
| Alerts | Latest alerts with change since previous run | Opens the alert and recommendation |
| States | Empty (no published run): explains next step; stale: banner with last good run; error: retry and request ID |  |

### 8.2 State and district detail (`/states/{state}`, `/districts/{lgd}`)

```
+------+---------------------------------------------------------+-------------+
| Rail | National > Maharashtra > Thane          [3m|6m|12m] Run 42 | MAP:       |
|      +---------------------------------------------------------+ zoomed to   |
|      | Thane  [Shortage watch]  Confidence: Medium  [Synthetic]| district    |
|      |                                                         |             |
|      | Demand vs supply by horizon (chart + P10-P90 band)      | Neighbours  |
|      |  [chart]                              [data table]      | list with   |
|      |                                                         | bands       |
|      | Trades (table)  sort: severity v  search: [      ]      |             |
|      | Trade        Demand  Supply  Gap   Severity  Band  Conf |             |
|      | Welder       1,240   880    +360  [==|--]   ^^    Med  >|             |
|      | CNC Operator ...                                        |             |
|      |                                                         |             |
|      | Centres (seats, utilisation)   |  What if... [open panel]|             |
+------+---------------------------------------------------------+-------------+
```

### 8.3 Why drawer

```
+---------------------------------------------+
| Why this number?                        [x] |
| Welder, Thane, 6 months                     |
| Demand 1,240 (P10 980 - P90 1,520)          |
|                                             |
| Contributions to demand                     |
|  Baseline (structural)      700  [=======  ]|
|  Observed postings          +310 [====     ]|
|  Power load (lag 3 mo)      +170 [===      ]|
|  E-way bills (lag 2 mo)     +60  [=        ]|
| Supply 880: seats 600 + stock 280           |
| Confidence: Medium - telemetry 45 days old  |
| Sources: [list with as-of dates, synthetic?]|
| Run 42 | Parameter set v7 (approved) | [Manifest]|
+---------------------------------------------+
```

Contributions always sum to the displayed demand. Plain-language sentence at the top comes from a template, for example: "Demand is rising mainly because industrial power load and postings have grown over the last three months."

### 8.4 Recommendations and what-if (`/recommendations`, `/simulate`)

| Region | Content |
| --- | --- |
| Left list | Recommendation cards ranked by gap reduction: "Shift 40 Welder seats from Palghar to Thane", gap reduction, cost, confidence |
| Centre | Sankey of shifts for the selected trade; list alternative |
| Right panel | What-if: seat stepper for the destination district, signal slider (for example industrial load ±30%); result card: severity and band before and after, with a dashed "Simulation" border and a Reset button |
| Footer | Export selected recommendations to Target Pack |

### 8.5 Other screens

| Screen | Purpose and content | Key states |
| --- | --- | --- |
| Login | Username and password, TOTP step for privileged roles, error summary, link to help; no registration link | Locked account, expired session, wrong code |
| Trade ranking | One trade across districts: ranked table plus map, filters by state | Empty filter result with "Clear filters" |
| Alerts | Feed with filters (type, level, state), history by run, link to recommendation | No alerts: explains the persistence rule |
| Exports | Choose scope, format (CSV, XLSX, PDF), Target Pack; shows what will be included and the labels; async progress and download | Large export queued; link expired |
| Sources | Table of sources: owner, cadence, last load, status, mapping coverage, quarantine rate; link to quality report | Stale, missing, blocked-publish |
| Methodology | Plain-language explanation of the index, tiers, uncertainty, limits, legend and glossary; version and parameter set | Print-friendly |
| Admin: runs | List of runs with status, manifest, hash, parameter set; trigger run (Admin) | Failed run with reason |
| Admin: parameters | Parameter sets with status and approvals; diff view between versions (Full: workflow) | Pending approval |
| Admin: users | Create, disable, reset, roles and scope; MFA status | Last admin protection |
| Admin: audit | Searchable audit log with chain verification status | Chain broken alert |

## 9. Data Visualisation Guidelines

| Topic | Guideline |
| --- | --- |
| Chart choice | Bars for category comparison, lines for horizon trend, bipolar bars for severity, sankey for flows, small multiples for state comparison; no pie or 3D charts |
| Severity | Bipolar bar centred at zero; positive (shortage) to the right; band chip beside it |
| Uncertainty | P10-P90 band or whisker on every forecast; tooltip lists P10, P50, P90 |
| Colour | Two-series charts use cobalt (#2563EB) and violet (#7C3AED) with direct labels; more than four series uses small multiples, not more hues |
| Maps | Discrete five-class choropleth from section 6.2 with patterns and 1 px borders; a legend always visible; no basemap; official depiction of boundaries |
| Numbers | Indian grouping (12,34,567); compact forms in cards: 12.4 L (lakh) and 1.2 Cr (crore) in English, लाख and करोड़ in Hindi; exact value in tooltip |
| Axes and labels | Direct labelling over legends where possible; axis labels at least 12 px; units always stated |
| Missing data | Hatched grey with the label "No data"; never drawn as zero |
| Table alternatives | Every chart has a "Show as table" toggle and a one-sentence text summary |
| Honesty | Synthetic and simulated series are visually distinct (dashed) and labelled |

## 10. Content Design and Microcopy

### 10.1 Writing rules

Plain language at about a Grade 8 reading level; short sentences; the same term for the same thing everywhere ("seats", "shortage", "oversupply"); numbers with units; verbs first on buttons; no jargon such as "Leontief" in the main UI (explained in Methodology).

### 10.2 Template examples (draft, to be reviewed by native speakers)

| Key | English | Hindi (draft) |
| --- | --- | --- |
| `reco.shift` | Shift {units} {trade} seats from {from} to {to}. Expected shortage reduction: {gap} workers. Confidence: {conf}. | {from} से {to} में {trade} की {units} सीटें स्थानांतरित करें। अनुमानित कमी में गिरावट: {gap} कर्मी। भरोसे का स्तर: {conf}। |
| `alert.shortage` | {trade} in {district} moved from {from\_band} to {to\_band} for two runs. | {district} में {trade} दो रन से {from\_band} से {to\_band} के स्तर पर है। |
| `why.summary` | Demand is rising mainly because {top\_signal} and postings have grown over the last {months} months. | मांग मुख्य रूप से इसलिए बढ़ रही है क्योंकि पिछले {months} महीनों में {top\_signal} और भर्ति विज्ञापन बढ़े हैं। |
| `badge.synthetic` | Synthetic data | कृत्रिम डेटा |
| `error.generic` | Something went wrong. Try again. If it continues, share this code with support: {request\_id} | कुछ गलत हुआ। फिर से कोशिश करें। समस्या बनी रहे तो सहायता को यह कोड बताएं: {request\_id} |

Templates use ICU plural and select forms; trade and place names come from the reference data in each language. No runtime machine translation.

## 11. Accessibility Specification (WCAG 2.1 AA, GIGW 3.0 target)

| Area | Specification |
| --- | --- |
| Structure | One `h1` per page; landmarks (header, nav, main, complementary); skip-to-content link; logical heading order |
| Keyboard | All functions reachable; visible focus ring (2 px `accent-strong` with a 2 px white offset, 6.1 : 1 against canvas); no keyboard traps; drawers return focus |
| Single-key shortcuts | The `/` search shortcut is active only when focus is not in a field and can be turned off in settings (WCAG 2.1.4) |
| Map | Not the sole interface; synchronised list; map has a text summary; zoom buttons are real buttons |
| Tables | Real table markup, captions, `scope` headers, `aria-sort`; no layout tables |
| Charts | `role=img` with a description plus a table alternative; keyboard-focusable data points are optional, never required |
| Forms | Visible labels, instructions before fields, error summary linked to fields, `autocomplete` tokens, no time limits except session expiry with a warning |
| Dynamic content | `aria-live=polite` for result counts and run updates; `alert` only for errors; no focus theft |
| Colour and contrast | Text 4.5 : 1; large text and UI components 3 : 1 (tokens verified); bands carry label, icon and pattern |
| Motion | Reduced-motion supported; no flashing |
| Zoom and reflow | Usable at 200% zoom and 320 px width without two-dimensional scrolling (except wide tables in their own scroll region) |
| Windows high contrast | `forced-colors` styles keep borders, focus rings and chart outlines visible |
| Language | `lang` attribute on the page and on mixed-language fragments |
| Documents | Exported PDFs are tagged with headings, alt text and a table structure |
| Testing | Axe in CI, Lighthouse CI, manual keyboard pass, screen reader pass (NVDA with Firefox or Chrome; VoiceOver on one flow), 200% zoom pass |

## 12. Localisation Design

| Topic | Specification |
| --- | --- |
| Text expansion | Layouts tolerate +40% length; no fixed-width buttons; truncation only with a tooltip and full text in the accessible name |
| Fonts | Subset per script; Devanagari line height 1.6; fallback stack tested |
| Numbers and dates | `Intl` with `en-IN` and `hi-IN`; lakh and crore grouping; dates as 12 Oct 2026 in the language's month names |
| Plurals | ICU plural rules per language |
| Direction | Layout uses logical CSS properties so right-to-left languages can be added later |
| Language switch | Keeps page, filters and selection; remembers preference per user |
| Workflow | Keys in the repository; source strings in English; a native reviewer approves each language before release; pseudo-localisation in CI to catch overflow and hard-coded text |

## 13. Responsive Behaviour and Performance

| Topic | Specification |
| --- | --- |
| Priority content | On small screens: alerts, top lists, district card; map becomes a tab; tables become cards with key columns and an expand control |
| Touch | 44 px recommended targets on touch devices; hover-only content has a tap or focus equivalent |
| Budgets | Initial JS under 250 KB per route; LCP under 2.5 s on 4G; interaction to next paint under 200 ms; charts and the map are lazy-loaded; map boundary tiles are cached and simplified by zoom |
| Glass effects | Blur limited to a handful of surfaces per view; disabled under `prefers-reduced-transparency` and on low-power devices |
| Offline demo | A pre-warmed build with seeded data runs without internet for the hackathon fallback |

## 14. Handoff, Quality and Research

### 14.1 Handoff

| Item | Detail |
| --- | --- |
| Figma structure | Pages: Foundations (tokens), Components, Patterns, Screens, Prototypes; variables generated from the token JSON |
| Storybook | One story per component and state; accessibility and visual-regression checks |
| Naming | Components in PascalCase; tokens as `category-role-variant`; message keys as `area.action` |
| UI definition of done | All states built; keyboard and screen reader checked; EN and HI strings present; no hard-coded colours; Storybook story added; axe clean |

### 14.2 Usability test plan (before the demo)

| Item | Plan |
| --- | --- |
| Participants | Five people close to the planner profile (teammates' contacts in skilling, college placement or district administration) |
| Tasks | T1 find top five shortage districts in a state; T2 explain why one is flagged; T3 find a recommendation and export it; T4 switch to Hindi and repeat T1; T5 simulate +30 seats; T6 find when the data was last updated |
| Measures | Task success, time on task, errors, confidence rating, System Usability Scale |
| Targets | T1 under 60 s untrained; at least 80% completion on every task; SUS of 80 or higher |
| Method | Think-aloud, 30 minutes each, notes in a shared sheet, top five issues fixed before the demo |

### 14.3 Design open items

1. Confirm that the severity band thresholds are acceptable to planners (they change colours on the map).
2. Choose the official district boundary file and verify its licence.
3. Native review of Hindi templates; decide on Marathi, Gujarati and Tamil for the stretch.
4. Decide whether the dark theme is needed at all; if so, derive it from the same tokens and re-run the contrast checks.
