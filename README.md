# Perfect Competition Lab

An interactive economics simulation teaching perfect competition theory through four sequential market scenarios.

## Economics audit (May 2026)

All scenario numbers are verified against the MC = P rule:

| Sc | Price | Opt Q | TR     | TC     | Profit  | Rule applied |
|----|-------|-------|--------|--------|---------|--------------|
|  1 | $180k |   6   | $1,080 |  $641  |  +$439  | MC@Q6=$171≤$180; MC@Q7=$231>$180 |
|  2 | $230k |   6   | $1,380 |  $641  |  +$739  | MC@Q6=$171≤$230; MC@Q7=$231>$230 |
|  3 | $230k |   6   | $1,380 | $1,241 |  +$139  | FC raised to $800k; MC unchanged |
|  4 | $230k |   0   |   —    |   —    |    $0   | AC_min=$321.5k > P=$230k → shutdown |

VC schedule (all rounds): Q0=0, Q1=6, Q2=27, Q3=72, Q4=150, Q5=270, Q6=441, Q7=672, Q8=972, Q9=1332  
MC: Q1=6, Q2=21, Q3=45, Q4=78, Q5=120, Q6=171, Q7=231, Q8=300, Q9=360  
Production capacity: maxQty = 9 (fixed across all scenarios)

## Local development

```bash
npm install
npm run dev       # → http://localhost:5173
```

## Environment variables

Create `.env` in the project root:

```
VITE_ANALYTICS_URL=https://<project>.supabase.co/functions/v1/daily-analytics
VITE_INSTRUCTOR_PASS=your_instructor_password
```

Both are optional — the app works without them (analytics calls are silently skipped).

## Supabase setup (analytics)

### 1. Create tables

In your Supabase project → SQL Editor → paste and run `supabase/schema.sql`.

### 2. Deploy the Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy daily-analytics --no-verify-jwt
```

The Edge Function file is at `supabase/index.ts`.

### 3. Set secrets

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Deploy to Netlify

### Option A — CLI (fastest)

```bash
npm install && npm run build
npx netlify deploy --prod --dir=dist
```

Set environment variables in Netlify → Site settings → Environment variables.

### Option B — Dashboard drag & drop

1. `npm run build`
2. Drag `dist/` to https://app.netlify.com

### Option C — GitHub + Netlify (recommended)

1. Push to GitHub
2. Netlify → "Add new site" → "Import from Git"
3. Build command: `npm run build` | Publish dir: `dist`
4. Add env vars in Netlify dashboard

`netlify.toml` handles the SPA redirect automatically.

## Instructor dashboard

- Click **"Instructor dashboard"** on the onboarding screen, or
- Press **Shift + I + D** from anywhere in the app
- Default password: `instructor` (override with `VITE_INSTRUCTOR_PASS`)

Metrics displayed:
- Total visitors, unique visitors, simulation starts, completions
- Average score, completion rate, average attempts
- Daily breakdown table with all metrics
- Traffic trend chart and average score bar chart

## Project structure

```
perfect-competition/
├── index.html
├── netlify.toml
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── supabase/
│   ├── index.ts        ← Edge Function (all event types)
│   └── schema.sql      ← Run once in Supabase SQL editor
└── src/
    ├── main.jsx
    ├── index.css
    ├── data.js             ← Audited scenario data + verification table
    ├── analytics.js        ← Event trackers (VISIT/START/SUBMIT/COMPLETE)
    ├── App.jsx             ← Screen router + analytics wiring
    ├── Onboarding.jsx
    ├── Simulation.jsx
    ├── MarketGraph.jsx
    ├── CostTable.jsx
    ├── Results.jsx
    └── InstructorDashboard.jsx  ← Full analytics dashboard
```
