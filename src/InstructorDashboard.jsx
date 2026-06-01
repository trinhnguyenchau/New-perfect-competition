import React, { useEffect, useState, useCallback } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { fetchAnalytics, trackInstructorView } from './analytics.js'

// ── helpers ────────────────────────────────────────────────────────────────
// Maps exactly to index.ts daily_analytics columns:
//   date | page_views | scenario_submissions | unique_visitors | avg_score | instructor_views

function shortDate(iso) {
  const [, m, d] = iso.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${mo[parseInt(m,10)-1]} ${parseInt(d,10)}`
}

function pct(a, b) {
  return b > 0 ? Math.round((a / b) * 100) : 0
}

function scoreColor(score) {
  if (score == null || score === '—') return 'text-stone-400'
  const n = parseFloat(score)
  return n >= 70 ? 'text-green-700' : n >= 40 ? 'text-amber-700' : 'text-red-700'
}

// ── sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, valueClass = 'text-stone-900' }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4">
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-medium ${valueClass}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">{children}</p>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-stone-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────

export default function InstructorDashboard({ onClose }) {
  const [rows, setRows]         = useState([])
  const [days, setDays]         = useState(30)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [password, setPassword] = useState('')
  const [authed, setAuthed]     = useState(false)
  const [pwError, setPwError]   = useState(false)

  const PASS = import.meta.env.VITE_INSTRUCTOR_PASS ?? 'instructor'

  function handleLogin(e) {
    e.preventDefault()
    if (password === PASS) {
      setAuthed(true)
      trackInstructorView()   // → index.ts: event_type "instructor_view"
    } else {
      setPwError(true)
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // GET /daily-analytics?days=N → returns array newest-first from index.ts
      const data = await fetchAnalytics(days)
      setRows([...data].reverse())   // oldest-first for charts
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { if (authed) load() }, [authed, load])

  // ── Aggregates — field names match index.ts daily_analytics columns ──────
  const totals = rows.reduce(
    (acc, r) => ({
      pageViews:   acc.pageViews   + (r.page_views            ?? 0),
      unique:      acc.unique      + (r.unique_visitors        ?? 0),
      submissions: acc.submissions + (r.scenario_submissions   ?? 0),
      instrViews:  acc.instrViews  + (r.instructor_views       ?? 0),
      // weighted sum for overall avg_score
      scoreSum:    acc.scoreSum    + ((r.avg_score ?? 0) * (r.scenario_submissions ?? 0)),
    }),
    { pageViews: 0, unique: 0, submissions: 0, instrViews: 0, scoreSum: 0 }
  )

  const overallAvgScore = totals.submissions > 0
    ? (totals.scoreSum / totals.submissions).toFixed(1)
    : null

  // Chart data — keys match what index.ts stores
  const chartData = rows.map(r => ({
    date:        shortDate(r.date),
    'Page views':    r.page_views          ?? 0,
    'Unique':        r.unique_visitors     ?? 0,
    'Submissions':   r.scenario_submissions ?? 0,
    'Avg score':     Math.round((r.avg_score ?? 0) * 10) / 10,
  }))

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm animate-pop">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-stone-900">Instructor access</h2>
          <p className="text-sm text-stone-400 mt-1">Enter your instructor password to view analytics.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setPwError(false) }}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          {pwError && <p className="text-xs text-red-600">Incorrect password.</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
          >
            View dashboard
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-stone-400 hover:text-stone-600 text-sm py-1 transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl my-8 animate-fade">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-medium text-stone-900">Instructor dashboard</h2>
            <p className="text-xs text-stone-400 mt-0.5">Perfect Competition Lab — student analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={e => setDays(parseInt(e.target.value))}
              className="border border-stone-200 rounded-lg text-xs px-2.5 py-1.5 text-stone-700 outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={load}
              className="border border-stone-200 rounded-lg text-xs px-3 py-1.5 text-stone-600 hover:bg-stone-50 transition-all"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-all text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-7">

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center h-40 text-sm text-stone-400">
              Loading analytics…
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
              <p className="font-medium mb-1">Could not load analytics</p>
              <p className="mb-2">{error}</p>
              <p className="text-xs text-red-400">
                Make sure <code className="bg-red-100 px-1 rounded">VITE_ANALYTICS_URL</code> points to your
                deployed Supabase Edge Function (<code className="bg-red-100 px-1 rounded">/daily-analytics</code>).
              </p>
            </div>
          )}

          {!loading && !error && (<>

            {/* ── Summary stat cards ──────────────────────────────────────
                Columns from daily_analytics (index.ts):
                page_views | unique_visitors | scenario_submissions | avg_score | instructor_views
            */}
            <div>
              <SectionLabel>Summary — last {days} days</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <StatCard
                  label="Page views"
                  value={totals.pageViews}
                  sub="total visits"
                />
                <StatCard
                  label="Unique visitors"
                  value={totals.unique}
                  sub="per-device, per-day"
                />
                <StatCard
                  label="Submissions"
                  value={totals.submissions}
                  sub="scenario answers"
                />
                <StatCard
                  label="Avg score"
                  value={overallAvgScore != null ? `${overallAvgScore}/100` : '—'}
                  sub="across all submissions"
                  valueClass={scoreColor(overallAvgScore)}
                />
                <StatCard
                  label="Instructor views"
                  value={totals.instrViews}
                  sub="dashboard opens"
                />
              </div>
            </div>

            {/* ── Traffic & submissions line chart ────────────────────── */}
            {chartData.length > 0 && (
              <div>
                <SectionLabel>Daily traffic & submissions</SectionLabel>
                <div className="bg-stone-50 rounded-xl p-4" style={{ height: 210 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#78716c' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#78716c' }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend iconType="line" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="Page views"  stroke="#2563eb" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Unique"      stroke="#7c3aed" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                      <Line type="monotone" dataKey="Submissions" stroke="#16a34a" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── Average score bar chart ─────────────────────────────── */}
            {chartData.length > 0 && (
              <div>
                <SectionLabel>Average score by day</SectionLabel>
                <div className="bg-stone-50 rounded-xl p-4" style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#78716c' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#78716c' }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="Avg score" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── Daily breakdown table ───────────────────────────────────
                Column names mirror index.ts upsert fields exactly.
            */}
            {rows.length > 0 ? (
              <div>
                <SectionLabel>Daily breakdown</SectionLabel>
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50">
                        {[
                          'Date',
                          'Page views',
                          'Unique visitors',
                          'Submissions',
                          'Avg score',
                          'Instructor views',
                        ].map(h => (
                          <th
                            key={h}
                            className="text-right first:text-left px-3 py-2.5 text-stone-400 font-medium whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...rows].reverse().map((r, i) => (
                        <tr
                          key={r.date}
                          className={`border-b border-stone-100 ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}
                        >
                          {/* date */}
                          <td className="px-3 py-2 font-medium text-stone-700 whitespace-nowrap">
                            {shortDate(r.date)}
                          </td>
                          {/* page_views */}
                          <td className="px-3 py-2 text-right text-stone-600">
                            {r.page_views ?? 0}
                          </td>
                          {/* unique_visitors */}
                          <td className="px-3 py-2 text-right text-stone-600">
                            {r.unique_visitors ?? 0}
                          </td>
                          {/* scenario_submissions */}
                          <td className="px-3 py-2 text-right text-stone-600">
                            {r.scenario_submissions ?? 0}
                          </td>
                          {/* avg_score — coloured by performance band */}
                          <td className={`px-3 py-2 text-right font-medium ${scoreColor(r.avg_score)}`}>
                            {r.avg_score != null ? Number(r.avg_score).toFixed(1) : '—'}
                          </td>
                          {/* instructor_views */}
                          <td className="px-3 py-2 text-right text-stone-600">
                            {r.instructor_views ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-stone-200 bg-stone-50 font-medium">
                        <td className="px-3 py-2.5 text-stone-700">Total / avg</td>
                        <td className="px-3 py-2.5 text-right text-stone-700">{totals.pageViews}</td>
                        <td className="px-3 py-2.5 text-right text-stone-700">{totals.unique}</td>
                        <td className="px-3 py-2.5 text-right text-stone-700">{totals.submissions}</td>
                        <td className={`px-3 py-2.5 text-right ${scoreColor(overallAvgScore)}`}>
                          {overallAvgScore != null ? `${overallAvgScore} avg` : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-right text-stone-700">{totals.instrViews}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-stone-400">
                No analytics data for the selected period.
                <br />
                <span className="text-xs mt-1 block">
                  Set <code className="bg-stone-100 px-1 rounded">VITE_ANALYTICS_URL</code> in{' '}
                  <code className="bg-stone-100 px-1 rounded">.env</code> and deploy the Edge Function.
                </span>
              </div>
            )}

          </>)}
        </div>
      </div>
    </div>
  )
}
