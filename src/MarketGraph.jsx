import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'

export default function MarketGraph({ scenario, selectedQty }) {
  const chartData = scenario.data
    .filter(d => d.q > 0)
    .map(d => ({
      q: d.q,
      MC: d.mc,
      AC: d.ac != null ? Math.round(d.ac * 10) / 10 : null,
      Price: scenario.marketPrice,
    }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-2.5 text-xs shadow-sm">
        <p className="font-medium text-stone-700 mb-1">Q = {label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ${p.value != null ? p.value : '—'}k
          </p>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e0" />
        <XAxis
          dataKey="q"
          tick={{ fontSize: 11, fill: '#78716c' }}
          label={{ value: 'Quantity', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#78716c' }}
        />
        <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="line"
          iconSize={10}
          wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
        />

        {/* Selected quantity marker */}
        {selectedQty > 0 && (
          <ReferenceLine
            x={selectedQty}
            stroke="#7c3aed"
            strokeDasharray="4 2"
            strokeWidth={1.5}
            label={{ value: `Q=${selectedQty}`, position: 'top', fontSize: 10, fill: '#7c3aed' }}
          />
        )}

        <Line
          type="monotone"
          dataKey="MC"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="AC"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="Price"
          stroke="#16a34a"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
