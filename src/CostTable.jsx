import React from 'react'

export default function CostTable({ scenario, selectedQty, submitted }) {
  const { data, optimalQty } = scenario

  return (
    <div className="overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-stone-200">
            {['Q', 'FC', 'VC', 'TC', 'MC', 'AC'].map(h => (
              <th
                key={h}
                className="text-right first:text-left py-1.5 px-2 text-stone-400 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            const isSelected = row.q === selectedQty
            const isOptimal  = submitted && row.q === optimalQty

            let rowClass = 'border-b border-stone-100 '
            if (isOptimal)       rowClass += 'row-optimal'
            else if (isSelected) rowClass += 'row-selected'

            return (
              <tr key={row.q} className={rowClass}>
                <td className="py-1 px-2 text-left font-medium">{row.q}</td>
                <td className="py-1 px-2 text-right">{row.fc}</td>
                <td className="py-1 px-2 text-right">{row.vc}</td>
                <td className="py-1 px-2 text-right">{row.tc}</td>
                <td className="py-1 px-2 text-right">{row.mc ?? '—'}</td>
                <td className="py-1 px-2 text-right">
                  {row.ac != null ? (Math.round(row.ac * 10) / 10) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-stone-400 mt-1.5">All values in $k. {submitted && <span className="text-green-700 font-medium">Green row = optimal choice.</span>}</p>
    </div>
  )
}
