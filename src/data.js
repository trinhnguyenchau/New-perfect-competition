// ═══════════════════════════════════════════════════════════════════════════
// PERFECT COMPETITION LAB — VERIFIED SCENARIO DATA
// Economic audit: May 2026
//
// Cost structure: FC + VC schedule below (same VC across all rounds)
// VC: Q0=0, Q1=6, Q2=27, Q3=72, Q4=150, Q5=270, Q6=441, Q7=672, Q8=972, Q9=1332
// MC: Q1=6, Q2=21, Q3=45, Q4=78, Q5=120, Q6=171, Q7=231, Q8=300, Q9=360
//
// VERIFICATION TABLE
// Sc | Price | Opt Q | TR    | TC    | Profit | Rule
//  1 | $180k |   6   | 1080  |  641  | +439   | MC@Q6=171≤180; MC@Q7=231>180 → stop
//  2 | $230k |   6   | 1380  |  641  | +739   | MC@Q6=171≤230; MC@Q7=231>230 → stop
//  3 | $230k |   6   | 1380  | 1241  | +139   | FC raised; MC unchanged → same opt Q
//  4 | $230k |   0   |   —   |   —   |    0   | AC_min=$321.5k>$230k → shutdown
//
// Production capacity fixed at maxQty=9 across all scenarios.
// ═══════════════════════════════════════════════════════════════════════════

export const SCENARIOS = [

  // ── ROUND 1 ─────────────────────────────────────────────────────────────
  {
    round: 1,
    title: 'Entering the Competitive Market',
    objective: 'Price-taking and MC = P rule',
    narrative:
      'You manage a firm producing industrial machinery. The market price is $180k — set by hundreds of competing firms selling identical products. Consumers will not buy from you if you charge more than $180k. They will simply go elsewhere.',
    advisor:
      'As a price taker, match the market at $180k. Find the output where your marginal cost is closest to — but does not exceed — the price. Stop producing as soon as the next unit costs more than it earns.',
    marketPrice: 180,
    priceOptions: [160, 180, 200],
    optimalPrice: 180,
    optimalQty: 6,
    maxQty: 9,
    showPriceSelect: true,
    data: [
      { q: 0, fc: 200, vc: 0,    tc: 200,  mc: null, ac: null   },
      { q: 1, fc: 200, vc: 6,    tc: 206,  mc: 6,    ac: 206    },
      { q: 2, fc: 200, vc: 27,   tc: 227,  mc: 21,   ac: 113.5  },
      { q: 3, fc: 200, vc: 72,   tc: 272,  mc: 45,   ac: 90.67  },
      { q: 4, fc: 200, vc: 150,  tc: 350,  mc: 78,   ac: 87.5   },
      { q: 5, fc: 200, vc: 270,  tc: 470,  mc: 120,  ac: 94     },
      { q: 6, fc: 200, vc: 441,  tc: 641,  mc: 171,  ac: 106.83 },
      { q: 7, fc: 200, vc: 672,  tc: 872,  mc: 231,  ac: 124.57 },
      { q: 8, fc: 200, vc: 972,  tc: 1172, mc: 300,  ac: 146.5  },
      { q: 9, fc: 200, vc: 1332, tc: 1532, mc: 360,  ac: 170.22 },
    ],
    explanation:
      'At Q=6, MC=$171k is just below the market price of $180k — every unit up to Q=6 adds more to revenue than it costs to produce. At Q=7, MC=$231k exceeds $180k: that unit costs $231k to produce but only earns $180k in revenue, reducing profit by $51k. The profit-maximising rule: produce the last unit where MC ≤ P. That is Q=6. Result: TR = 6 × $180k = $1,080k − TC = $641k = Profit +$439k.',
    misconception:
      'Lowering price below $180k yields zero sales — all buyers switch to competitors. Producing where AC is minimised (Q=4, AC=$87.5k) does not maximise profit; the profit-maximising condition is MC = P, not minimum AC.',
  },

  // ── ROUND 2 ─────────────────────────────────────────────────────────────
  {
    round: 2,
    title: 'Boom in Market Price',
    objective: 'Output decisions under higher market prices',
    narrative:
      'Strong global demand has pushed the market equilibrium price to $230k. The market price is given — you cannot charge more or less. Your cost structure is unchanged. Does the higher price change your optimal output?',
    advisor:
      'Re-check where MC equals the new price. Compare MC at each unit against $230k. The MC schedule has not changed — only the price has. Apply the same rule: stop where the next unit\'s MC exceeds the price.',
    marketPrice: 230,
    priceOptions: null,
    optimalPrice: 230,
    optimalQty: 6,
    maxQty: 9,
    showPriceSelect: false,
    data: [
      { q: 0, fc: 200, vc: 0,    tc: 200,  mc: null, ac: null   },
      { q: 1, fc: 200, vc: 6,    tc: 206,  mc: 6,    ac: 206    },
      { q: 2, fc: 200, vc: 27,   tc: 227,  mc: 21,   ac: 113.5  },
      { q: 3, fc: 200, vc: 72,   tc: 272,  mc: 45,   ac: 90.67  },
      { q: 4, fc: 200, vc: 150,  tc: 350,  mc: 78,   ac: 87.5   },
      { q: 5, fc: 200, vc: 270,  tc: 470,  mc: 120,  ac: 94     },
      { q: 6, fc: 200, vc: 441,  tc: 641,  mc: 171,  ac: 106.83 },
      { q: 7, fc: 200, vc: 672,  tc: 872,  mc: 231,  ac: 124.57 },
      { q: 8, fc: 200, vc: 972,  tc: 1172, mc: 300,  ac: 146.5  },
      { q: 9, fc: 200, vc: 1332, tc: 1532, mc: 360,  ac: 170.22 },
    ],
    explanation:
      'With P=$230k, apply MC = P: at Q=6, MC=$171k ≤ $230k ✓. At Q=7, MC=$231k > $230k ✗ — producing Q=7 costs $1 more than it earns. Optimal quantity remains Q=6. However, profit is now higher: TR = 6 × $230k = $1,380k − TC = $641k = Profit +$739k. The higher price increases profitability of existing output but does not expand optimal quantity when MC rises steeply.',
    misconception:
      'A higher market price does not automatically increase optimal output. It only does so if MC at additional units falls below the new price. Here MC at Q=7 ($231k) still exceeds P ($230k), so optimal output is unchanged at Q=6.',
  },

  // ── ROUND 3 ─────────────────────────────────────────────────────────────
  {
    round: 3,
    title: 'Fixed Cost Shock',
    objective: 'Fixed costs do not change optimal output',
    narrative:
      'Your factory lease has quadrupled. Fixed costs jump from $200k to $800k. The market price is still $230k. Some advisors suggest raising prices or cutting output to recover the higher fixed costs. What should you do?',
    advisor:
      'Fixed costs do not appear in the marginal cost calculation — MC measures only the cost of the next unit of variable input. The MC = P rule still applies. Your optimal quantity may be the same, but check whether profit has changed.',
    marketPrice: 230,
    priceOptions: [200, 230, 260],
    optimalPrice: 230,
    optimalQty: 6,
    maxQty: 9,
    showPriceSelect: true,
    data: [
      { q: 0, fc: 800, vc: 0,    tc: 800,  mc: null, ac: null   },
      { q: 1, fc: 800, vc: 6,    tc: 806,  mc: 6,    ac: 806    },
      { q: 2, fc: 800, vc: 27,   tc: 827,  mc: 21,   ac: 413.5  },
      { q: 3, fc: 800, vc: 72,   tc: 872,  mc: 45,   ac: 290.67 },
      { q: 4, fc: 800, vc: 150,  tc: 950,  mc: 78,   ac: 237.5  },
      { q: 5, fc: 800, vc: 270,  tc: 1070, mc: 120,  ac: 214    },
      { q: 6, fc: 800, vc: 441,  tc: 1241, mc: 171,  ac: 206.83 },
      { q: 7, fc: 800, vc: 672,  tc: 1472, mc: 231,  ac: 210.29 },
      { q: 8, fc: 800, vc: 972,  tc: 1772, mc: 300,  ac: 221.5  },
      { q: 9, fc: 800, vc: 1332, tc: 2132, mc: 360,  ac: 236.89 },
    ],
    explanation:
      'Fixed costs shift the AC curve upward but leave marginal cost completely unchanged — MC depends only on variable cost, which is the same as before. Since the profit-maximising condition is MC = P, optimal quantity is still Q=6. Result: TR = $1,380k − TC = $1,241k = Profit +$139k. Still profitable, but profit has fallen from +$739k to +$139k. Producing any other quantity gives lower profit.',
    misconception:
      'Raising price to $260k results in zero sales — buyers switch to competitors at $230k. Fixed costs cannot be recovered by charging more in a perfectly competitive market. Cutting output also reduces profit further.',
  },

  // ── ROUND 4 ─────────────────────────────────────────────────────────────
  {
    round: 4,
    title: 'Foreign Market Expansion',
    objective: 'Shutdown decision when P < AC_min',
    narrative:
      'Your firm considers entering a foreign market. Entry requires an additional $1,400k fixed cost on top of the base $200k — totalling $1,600k in fixed costs. The foreign market price is $230k. The cost structure is otherwise the same. Should you enter?',
    advisor:
      'Calculate average cost at every output level. If the market price falls below the minimum AC at every output level, the firm cannot break even. In that case the rational decision is not to produce at all — avoid the fixed entry cost entirely.',
    marketPrice: 230,
    priceOptions: null,
    optimalPrice: 230,
    optimalQty: 0,
    maxQty: 9,
    showPriceSelect: false,
    data: [
      { q: 0, fc: 1600, vc: 0,    tc: 1600, mc: null, ac: null   },
      { q: 1, fc: 1600, vc: 6,    tc: 1606, mc: 6,    ac: 1606   },
      { q: 2, fc: 1600, vc: 27,   tc: 1627, mc: 21,   ac: 813.5  },
      { q: 3, fc: 1600, vc: 72,   tc: 1672, mc: 45,   ac: 557.33 },
      { q: 4, fc: 1600, vc: 150,  tc: 1750, mc: 78,   ac: 437.5  },
      { q: 5, fc: 1600, vc: 270,  tc: 1870, mc: 120,  ac: 374    },
      { q: 6, fc: 1600, vc: 441,  tc: 2041, mc: 171,  ac: 340.17 },
      { q: 7, fc: 1600, vc: 672,  tc: 2272, mc: 231,  ac: 324.57 },
      { q: 8, fc: 1600, vc: 972,  tc: 2572, mc: 300,  ac: 321.5  },
      { q: 9, fc: 1600, vc: 1332, tc: 2932, mc: 360,  ac: 325.78 },
    ],
    explanation:
      'With FC=$1,600k, the minimum average cost is $321.5k at Q=8 — far above the market price of $230k. At every positive output level, AC > P, meaning the firm cannot cover its total costs. The shutdown rule: if P < AC_min across all outputs, do not produce. Choosing Q=0 avoids the $1,400k entry cost and the guaranteed operating losses. Not entering is the only rational decision.',
    misconception:
      'Producing in hopes of "making it back" guarantees larger losses — at Q=6 the firm loses $661k, at Q=8 it loses $732k. When P < AC_min at every output level, zero production is the profit-maximising (loss-minimising) choice.',
  },
]

export const RATINGS = [
  { min: 90, label: 'Industry Expert',        color: 'text-green-800', bg: 'bg-green-100'  },
  { min: 70, label: 'Profit Maximizer',       color: 'text-blue-800',  bg: 'bg-blue-100'   },
  { min: 40, label: 'Competitive Strategist', color: 'text-amber-800', bg: 'bg-amber-100'  },
  { min: 0,  label: 'Market Analyst',         color: 'text-red-800',   bg: 'bg-red-100'    },
]
