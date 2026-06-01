import React, { useState, useEffect } from 'react'
import MarketGraph from './MarketGraph.jsx'
import CostTable from './CostTable.jsx'

function Panel({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-stone-200 rounded-xl p-4 ${className}`}>
      {title && <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">{title}</p>}
      {children}
    </div>
  )
}

export default function Simulation({ scenario, scenarioIndex, totalScenarios, totalScore, onSubmit, onNext }) {
  const [qty, setQty] = useState(Math.floor(scenario.maxQty / 2))
  const [selectedPrice, setSelectedPrice] = useState(scenario.showPriceSelect ? null : scenario.marketPrice)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [priceError, setPriceError] = useState(false)

  // Reset when scenario changes
  useEffect(() => {
    setQty(Math.floor(scenario.maxQty / 2))
    setSelectedPrice(scenario.showPriceSelect ? null : scenario.marketPrice)
    setSubmitted(false)
    setResult(null)
    setPriceError(false)
  }, [scenario])

  function handleSubmit() {
    if (scenario.showPriceSelect && selectedPrice === null) {
      setPriceError(true)
      return
    }
    setPriceError(false)

    const price = selectedPrice ?? scenario.marketPrice
    const row = scenario.data.find(d => d.q === qty) ?? scenario.data[qty]
    const tr = price * qty
    const tc = row ? row.tc : 0
    const profit = tr - tc

    const optRow = scenario.data.find(d => d.q === scenario.optimalQty)
    const optTR  = scenario.optimalPrice * scenario.optimalQty
    const optProfit = optTR - (optRow ? optRow.tc : 0)

    const qtyCorrect   = qty === scenario.optimalQty
    const priceCorrect = !scenario.showPriceSelect || price === scenario.optimalPrice
    let pts = 0
    if (qtyCorrect && priceCorrect) pts = 25
    else if (qtyCorrect || priceCorrect) pts = 10

    const res = { price, qty, tr, tc, profit, optProfit, qtyCorrect, priceCorrect, pts }
    setResult(res)
    setSubmitted(true)
    onSubmit(res)
  }

  const dots = Array.from({ length: totalScenarios }, (_, i) => i)

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-5xl mx-auto">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 py-3 border-b border-stone-200">
          <div className="flex gap-2 items-center">
            {dots.map(i => (
              <div
                key={i}
                className={`h-1.5 w-7 rounded-full transition-all ${
                  i < scenarioIndex ? 'bg-green-500' :
                  i === scenarioIndex ? 'bg-blue-500' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
          <div className="bg-stone-100 rounded-full px-3 py-1 text-sm font-medium text-stone-700">
            Score: {totalScore}
          </div>
        </div>

        {/* Scenario label + title */}
        <div className="mb-4 animate-fade">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Round {scenarioIndex + 1} of {totalScenarios} — {scenario.objective}
          </p>
          <h2 className="text-2xl font-medium text-stone-900">{scenario.title}</h2>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">

          {/* LEFT: narrative + advisor */}
          <div className="flex flex-col gap-3">
            <Panel title="Scenario">
              <p className="text-sm text-stone-700 leading-relaxed">{scenario.narrative}</p>
              <div className="mt-3 bg-stone-50 rounded-lg p-2.5">
                <p className="text-xs font-medium text-stone-500 mb-1">Market price</p>
                <p className="text-xl font-medium text-green-700">${scenario.marketPrice}k</p>
              </div>
            </Panel>
            <Panel title="Advisor recommendation">
              <p className="text-sm text-green-800 leading-relaxed bg-green-50 rounded-lg p-3">{scenario.advisor}</p>
            </Panel>
          </div>

          {/* CENTER: cost table + graph */}
          <div className="flex flex-col gap-3">
            <Panel title="Cost schedule ($k)">
              <CostTable scenario={scenario} selectedQty={qty} submitted={submitted} />
            </Panel>
            <Panel title="Market graph">
              <MarketGraph scenario={scenario} selectedQty={submitted ? scenario.optimalQty : qty} />
              <div className="flex gap-3 mt-2 text-xs text-stone-500">
                <span><span className="inline-block w-3 h-0.5 bg-red-600 mr-1 align-middle"></span>MC</span>
                <span><span className="inline-block w-3 h-0.5 bg-blue-600 mr-1 align-middle"></span>AC</span>
                <span><span className="inline-block w-3 h-0.5 bg-green-600 mr-1 align-middle border-dashed border-t-2 border-green-600"></span>Price</span>
              </div>
            </Panel>
          </div>

          {/* RIGHT: decision + results */}
          <div className="flex flex-col gap-3">
            <Panel title="Your decision">

              {/* Price selector */}
              {scenario.showPriceSelect && (
                <div className="mb-4">
                  <p className="text-xs text-stone-500 mb-2">Select market price ($k)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {scenario.priceOptions.map(p => (
                      <button
                        key={p}
                        onClick={() => { if (!submitted) { setSelectedPrice(p); setPriceError(false) } }}
                        disabled={submitted}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedPrice === p
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        ${p}k
                      </button>
                    ))}
                  </div>
                  {priceError && <p className="text-xs text-red-600 mt-1">Please select a price before submitting.</p>}
                </div>
              )}

              {/* Quantity slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-stone-500">Quantity to produce</p>
                  <span className="text-lg font-medium text-stone-900">{qty} units</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={scenario.maxQty}
                  step={1}
                  value={qty}
                  disabled={submitted}
                  onChange={e => setQty(parseInt(e.target.value))}
                  className="w-full disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-0.5">
                  <span>0</span>
                  <span>{scenario.maxQty}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-all"
              >
                {submitted ? 'Decision submitted ✓' : 'Submit decision'}
              </button>

              {/* Post-submission results */}
              {submitted && result && (
                <div className="mt-4 animate-pop">
                  <div className="space-y-1.5 text-sm">
                    {[
                      ['Price', `$${result.price}k`],
                      ['Quantity', result.qty],
                      ['Total Revenue', `$${result.tr}k`],
                      ['Total Cost',    `$${result.tc}k`],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">{label}</span>
                        <span className="font-medium text-stone-800">{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Profit</span>
                      <span className={`font-medium ${result.profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {result.profit >= 0 ? '+' : ''}${result.profit}k
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-stone-400">
                    {result.qtyCorrect && result.priceCorrect
                      ? `Optimal profit: $${result.optProfit >= 0 ? '+' : ''}${result.optProfit}k — you achieved it!`
                      : `Optimal: Q=${scenario.optimalQty}${scenario.showPriceSelect ? `, P=$${scenario.optimalPrice}k` : ''} → Profit $${result.optProfit >= 0 ? '+' : ''}${result.optProfit}k`
                    }
                  </div>
                  <div className={`mt-2 text-xs font-medium rounded-lg px-3 py-2 ${result.qtyCorrect && result.priceCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {result.qtyCorrect && result.priceCorrect
                      ? `✓ Optimal decision! +${result.pts} points`
                      : `✗ Not optimal. +${result.pts} points. See explanation below.`
                    }
                  </div>
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* Feedback box */}
        {submitted && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 mb-4 animate-fade">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Economic explanation</p>
            <p className="text-sm text-stone-700 leading-relaxed mb-3">{scenario.explanation}</p>
            {(!result?.qtyCorrect) && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
                <span className="font-medium">Common misconception:</span> {scenario.misconception}
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        {submitted && (
          <button
            onClick={onNext}
            className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-medium py-3 rounded-xl text-sm transition-all animate-fade"
          >
            {scenarioIndex + 1 < totalScenarios ? 'Continue to next round →' : 'View final results →'}
          </button>
        )}

      </div>
    </div>
  )
}
