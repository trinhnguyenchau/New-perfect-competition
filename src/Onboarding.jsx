import React from 'react'

const concepts = [
  { icon: '🏷️', label: 'Price taker',   desc: 'You cannot set the price — you accept what the market gives you. Charge more and you sell nothing.' },
  { icon: '📈', label: 'MC = P rule',   desc: 'Produce until your marginal cost equals the market price. Every unit where MC < P adds to profit.' },
  { icon: '💰', label: 'Profit formula', desc: 'Profit = Total Revenue − Total Cost. TR = Price × Quantity. Your goal is to maximise this.' },
  { icon: '⚡', label: 'Shutdown rule', desc: 'If price falls below minimum average cost at every output level, produce zero.' },
]

const steps = [
  'Read the scenario and examine market conditions, the cost table, and the graph.',
  'Choose your quantity (and price where applicable) — commit to your reasoning.',
  'Submit your answer. Only then are outcomes, profits, and explanations revealed.',
  'Review feedback, earn points for optimal first-attempt choices, and proceed.',
]

export default function Onboarding({ onStart, onInstructor }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-8 animate-fade">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Economics Lab
          </span>
          <h1 className="text-4xl font-medium text-stone-900 leading-tight mb-2">
            Perfect Competition Lab
          </h1>
          <p className="text-stone-500 text-base">
            Market Survival Simulation · 4 scenarios · Decision-based learning
          </p>
        </div>

        {/* Concept cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {concepts.map((c, i) => (
            <div key={c.label} className={`bg-white border border-stone-200 rounded-xl p-4 animate-fade delay-${i + 1}`}>
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="text-sm font-medium text-stone-800 mb-1">{c.label}</div>
              <div className="text-xs text-stone-500 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-4 animate-fade delay-5">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-4">How each round works</p>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                  {i + 1}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-fade delay-5">
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-medium">Strategic reminder:</span> Lowering your price does not increase sales under perfect competition — buyers simply choose rivals. Firms cannot individually influence the market price.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-base py-3.5 rounded-xl transition-all duration-150 animate-fade delay-5"
        >
          Enter the Competitive Market →
        </button>

        {/* Instructor link */}
        <div className="text-center mt-4">
          <button
            onClick={onInstructor}
            className="text-xs text-stone-400 hover:text-stone-600 transition-all"
          >
            Instructor dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
