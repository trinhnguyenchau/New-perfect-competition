// ── analytics.js ──────────────────────────────────────────────────────────
// Matches the event_type strings and POST body shape expected by index.ts:
//   page_view | unique_visitor | submission | instructor_view
// All calls are fire-and-forget — errors never interrupt the student.

const EDGE_FN_URL = import.meta.env.VITE_ANALYTICS_URL ?? ''

async function post(event_type, extra = {}) {
  if (!EDGE_FN_URL) return
  try {
    await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, ...extra }),
    })
  } catch (_) { /* intentionally silent */ }
}

async function get(days = 30) {
  if (!EDGE_FN_URL) return []
  const res = await fetch(`${EDGE_FN_URL}?days=${days}`)
  if (!res.ok) throw new Error(`Analytics fetch failed: ${res.status}`)
  return res.json()
}

// ── Session dedup ──────────────────────────────────────────────────────────
// Stable session_id per browser tab (cleared on tab close).
function getSessionId() {
  const key = 'pclab_session'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(key, id)
  }
  return id
}

// ── Exported event trackers ────────────────────────────────────────────────

/**
 * Page load — fires page_view every visit.
 * Also fires unique_visitor once per calendar day per browser (localStorage dedup).
 * Matches index.ts: event_type "page_view" and "unique_visitor"
 */
export function trackPageView() {
  post('page_view')

  try {
    const key   = 'pclab_visited'
    const today = new Date().toISOString().split('T')[0]
    if (localStorage.getItem(key) !== today) {
      localStorage.setItem(key, today)
      post('unique_visitor')
    }
  } catch (_) { /* private browsing — skip */ }
}

/**
 * Student submits a scenario answer.
 * Matches index.ts: event_type "submission", optional score field.
 */
export function trackSubmission(score) {
  post('submission', { score })
}

/**
 * Student reaches the final results screen.
 * Logged as a "submission" with the total score so the running avg_score
 * in daily_analytics picks it up — consistent with index.ts logic.
 */
export function trackComplete(totalScore) {
  post('submission', { score: totalScore })
}

/**
 * Instructor opens the dashboard.
 * Matches index.ts: event_type "instructor_view"
 */
export function trackInstructorView() {
  post('instructor_view')
}

/** Fetch daily analytics rows for the instructor dashboard. */
export function fetchAnalytics(days = 30) { return get(days) }
