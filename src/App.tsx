import { useGameState } from './gameState'
import CockpitScene from './scene/CockpitScene'
import FieldGrid from './components/FieldGrid'
import HintConsole from './components/HintConsole'
import EndScreen from './components/EndScreen'
import ResetButton from './components/ResetButton'
import TimerCountdown from './components/TimerCountdown'
import PuzzleInput from './components/PuzzleInput'
import MapPostIt from './components/MapPostIt'
import Calculator from './components/Calculator'
import RunwayPuzzle from './components/RunwayPuzzle'
import IntroBanner from './components/IntroBanner'

function App() {
  const {
    city,
    step,
    hint,
    timeRemaining,
    requiredFieldStatuses,
    auxFieldStatuses,
    submitAirportCode,
    submitEta,
    submitRunway,
    submitCombine,
    resetCount,
    reset,
  } = useGameState()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CockpitScene city={city} />

      <IntroBanner palette={city.palette} />

      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <ResetButton palette={city.palette} onReset={reset} />
        <MapPostIt city={city} />
      </div>

      <TimerCountdown
        seconds={timeRemaining}
        palette={city.palette}
        style={{ position: 'absolute', top: 16, left: 16 }}
      />

      <FieldGrid fields={requiredFieldStatuses} palette={city.palette} style={{ left: 180 }} />

      <HintConsole hint={hint} palette={city.palette}>
        {step === 'airport' && (
          <PuzzleInput palette={city.palette} placeholder="Airport code" onSubmit={submitAirportCode} />
        )}
        {step === 'eta' && (
          <PuzzleInput palette={city.palette} placeholder="ETA HH:MM" onSubmit={submitEta} />
        )}
        {step === 'runway' && <RunwayPuzzle city={city} onSolve={submitRunway} />}
        {step === 'combine' && (
          <PuzzleInput palette={city.palette} placeholder="XXX-XX:XX-XX" onSubmit={submitCombine} />
        )}
      </HintConsole>

      <FieldGrid fields={auxFieldStatuses} palette={city.palette} style={{ right: 180 }} />

      <Calculator
        key={resetCount}
        palette={city.palette}
        style={{ position: 'absolute', bottom: 30, right: 16 }}
      />

      {step === 'won' && (
        <EndScreen title="LANDED" hint={hint} palette={city.palette} onReset={reset} />
      )}

      {step === 'game_over' && (
        <EndScreen title="GAME OVER" hint={hint} palette={city.palette} onReset={reset} />
      )}
    </div>
  )
}

export default App
