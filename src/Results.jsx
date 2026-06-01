import React from 'react'
import { RATINGS, SCENARIOS } from './data.js'

export default function Results({ totalScore, scenarioScores, onReplay }) {
  const rating = RATINGS.find(r => totalScore >= r.min)
  const correct = scenarioScores.filter(s => s.qtyCorrect && s.priceCorrect).length

  const lessons = []
  if (scenarioScores[0] && !scenarioScores[0].qtyCorrect)
    lessons.push('Price-taking means matching the market — never undercut or overcharge.')
  if (scenarioScores[1] && !scenarioScores[1].qtyCorrect)
    lessons.push('When price rises, expand output to where MC = P.')
  if (scenarioScores[2] && !scenarioScores[2].qtyCorrect)
    lessons.push('Fixed costs never affect optimal quantity — only MC matters.')
  if (scenarioScores[3] && !scenarioScores[3].qtyCorrect)
    lessons.push('When P ≤ AC_min at all output levels, the correct choice is Q = 0.')
  if (lessons.length === 0)
    lessons.push('Excellent command of perfect competition theory across all four rounds!')

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full animate-fade">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium text-stone-900 mb-2">Simulation complete</h2>
          <p className="text-stone-500 text-sm">
            {correct} of 4 rounds answered optimally on the first attempt
          </p>
        </div>

        {/* Rating badge */}
        <div className="text-center mb-6">
          <span className={`inline-block ${rating.bg} ${rating.color} text-lg font-medium px-6 py-2.5 rounded-full`}>
            {rating.label}
          </span>
          <p className="text-stone-400 text-xs mt-2">Total score: {totalScore} / 100</p>
        </div>

        {/* Per-round breakdown */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {scenarioScores.map((s, i) => {
            const ok = s.qtyCorrect && s.priceCorrect
            return (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-3 text-center">
                <p className="text-xs text-stone-400 mb-1">Round {s.round}</p>
                <p className={`text-xl font-medium ${ok ? 'text-green-700' : 'text-red-600'}`}>
                  {s.pts}
                </p>
                <p className="text-xs text-stone-400">pts</p>
                <p className="text-xs mt-1">
                  Q={s.qty}{SCENARIOS[i].showPriceSelect ? `, P=${s.price}` : ''}
                </p>
              </div>
            )
          })}
        </div>

        {/* Key lessons */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">Key lessons from this session</p>
          <ul className="space-y-2">
            {lessons.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onReplay}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium py-3.5 rounded-xl transition-all duration-150"
        >
          Replay simulation ↺
        </button>

      </div>
    </div>
  )
}
