-- ═══════════════════════════════════════════════════════════════════════════
-- Perfect Competition Lab — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → Run)
-- ═══════════════════════════════════════════════════════════════════════════

-- Daily aggregated analytics (fast reads for instructor dashboard)
create table if not exists daily_analytics (
  date                   date    primary key,
  page_views             int     not null default 0,
  unique_visitors        int     not null default 0,
  simulation_starts      int     not null default 0,
  simulation_completions int     not null default 0,
  scenario_submissions   int     not null default 0,
  avg_score              numeric(6,2) not null default 0,
  avg_attempts           numeric(6,2) not null default 0,
  instructor_views       int     not null default 0
);

-- Raw event log (Part H — persistent, queryable per session)
create table if not exists analytics_events (
  id          bigserial    primary key,
  timestamp   timestamptz  not null default now(),
  session_id  text,
  event_type  text         not null,   -- page_view | unique_visitor | simulation_start | scenario_submit | simulation_complete | instructor_view
  scenario    int,                     -- 1-4, for scenario_submit events
  score       numeric(6,2)             -- pts earned or total score
);

-- Index for session-level queries
create index if not exists idx_events_session   on analytics_events (session_id);
create index if not exists idx_events_type      on analytics_events (event_type);
create index if not exists idx_events_timestamp on analytics_events (timestamp);

-- Row-level security: allow anon inserts (the edge fn uses service role, so
-- this is belt-and-suspenders for the public endpoint)
alter table daily_analytics  enable row level security;
alter table analytics_events enable row level security;

-- Service role bypasses RLS automatically; no explicit policies needed
-- if you call the Edge Function with the service role key.
