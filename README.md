# CarSync

**One customer, one journey, one unified backbone.**

CarSync is a two-sided prototype for an automotive OEM digital showroom: a
customer-facing app that recommends vehicles and estimates ownership cost,
and a dealer portal that reads the *same* live customer data to prioritize
leads. It started as a hackathon build; this version reworks the parts that
were just UI mockup into logic that actually runs — a real scoring
algorithm, a real lead-scoring model with time decay, and state that
persists across a refresh.

---

## Architecture

```
src/
├── data/cars.js                 catalog + scoring reference tables
├── lib/
│   ├── recommend.js              customer-facing recommendation engine
│   └── leadScore.js              dealer-facing lead scoring engine
├── store/CustomerJourneyContext.jsx   shared state (React Context + localStorage)
├── components/
│   ├── CustomerDashboard.jsx     preference form, ranked results, EMI/cost
│   ├── DealerDashboard.jsx       lead score, breakdown, suggested approach
│   ├── Gauge.jsx                 shared SVG gauge (one visual language for
│   │                             "this number was computed and can be explained")
│   └── AuthScreen.jsx
└── App.jsx                       auth shell + role routing
```

## The two algorithms

### 1. Vehicle recommendation (`lib/recommend.js`)

Content-based scoring, not a black box. Each car gets five 0–1 sub-scores —
budget fit, mileage fit (weighted by how the customer says they drive),
comfort, features, performance — combined into a weighted average using
weights that shift with the customer's stated priority (economy / space /
performance / features, see `PRIORITIES` in `data/cars.js`). Two gating
multipliers (fuel-type match, seats vs. family size) pull the score down for
a hard mismatch without zeroing it out — a car one seat short of what a
family needs is a worse match, not an impossible one.

```
weighted_avg = Σ(weight_i × subscore_i) / Σ(weight_i)
score        = weighted_avg × fuel_gate × seat_gate      (capped at 97, floor 3)
```

Every score ships with its breakdown, so the UI can show *why* a car ranked
where it did instead of an unexplained percentage — the original prototype's
match scores were fixed strings that didn't depend on any input at all.

### 2. Dealer lead score (`lib/leadScore.js`)

Point-based, with **time decay**: a lead that's gone quiet is worth less
than an equally-engaged lead that's active right now, which the original
version didn't model at all.

```
raw_score = registration + engagement + research_time + shortlist + test_drive + budget_tier
decay     = 0.5 ^ (hours_since_last_activity / 72)      // halves every 3 days
score     = raw_score × decay
```

## Tech stack

React 19, Vite 7, vanilla CSS (custom design tokens, no framework), Lucide
icons. No backend, no external API calls beyond hotlinked catalog images.

## Getting started

```bash
npm install
npm run dev
```
