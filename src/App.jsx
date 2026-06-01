import React, { useState, useEffect } from 'react'
import Onboarding from './Onboarding.jsx'
import Simulation from './Simulation.jsx'
import Results from './Results.jsx'
import InstructorDashboard from './InstructorDashboard.jsx'
import { SCENARIOS } from './data.js'
import { trackPageView, trackSubmission, trackComplete } from './analytics.js'

const SCREENS = { ONBOARD: 'onboard', SIM: 'sim', RESULTS: 'results' }

export default function App() {
  const [screen, setScreen]               = useState(SCREENS.ONBOARD)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [totalScore, setTotalScore]       = useState(0)
  const [scenarioScores, setScenarioScores] = useState([])
  const [showInstructor, setShowInstructor] = useState(false)

  // Track page view once on mount (fires page_view + unique_visitor if first today)
  useEffect(() => { trackPageView() }, [])

  // Shift+I+D keyboard shortcut to open instructor dashboard
  useEffect(() => {
    const keys = new Set()
    const down = e => {
      keys.add(e.key)
      if (keys.has('Shift') && keys.has('I') && keys.has('D')) {
        setShowInstructor(true)
        keys.clear()
      }
    }
    const up = e => keys.delete(e.key)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  function handleStart() {
    setScenarioIndex(0)
    setTotalScore(0)
    setScenarioScores([])
    setScreen(SCREENS.SIM)
  }

  function handleSubmit(result) {
    const sc = SCENARIOS[scenarioIndex]
    const newScore = totalScore + result.pts
    setTotalScore(newScore)
    setScenarioScores(prev => [
      ...prev,
      {
        round: sc.round,
        pts: result.pts,
        qty: result.qty,
        price: result.price,
        qtyCorrect: result.qtyCorrect,
        priceCorrect: result.priceCorrect,
      },
    ])
    // Track each scenario submission with its points earned
    trackSubmission(result.pts)
  }

  function handleNext() {
    if (scenarioIndex + 1 >= SCENARIOS.length) {
      // Track final completion with total score
      trackComplete(totalScore)
      setScreen(SCREENS.RESULTS)
    } else {
      setScenarioIndex(i => i + 1)
    }
  }

  function handleReplay() { setScreen(SCREENS.ONBOARD) }

  return (
    <>
      {showInstructor && (
        <InstructorDashboard onClose={() => setShowInstructor(false)} />
      )}

      {screen === SCREENS.ONBOARD && (
        <Onboarding onStart={handleStart} onInstructor={() => setShowInstructor(true)} />
      )}

      {screen === SCREENS.SIM && (
        <Simulation
          key={scenarioIndex}
          scenario={SCENARIOS[scenarioIndex]}
          scenarioIndex={scenarioIndex}
          totalScenarios={SCENARIOS.length}
          totalScore={totalScore}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      )}

      {screen === SCREENS.RESULTS && (
        <Results
          totalScore={totalScore}
          scenarioScores={scenarioScores}
          onReplay={handleReplay}
        />
      )}
    </>
  )
}
