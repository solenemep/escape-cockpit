import { useGameState } from './gameState'
import CockpitScene from './scene/CockpitScene'
import FieldGrid from './components/FieldGrid'
import HintConsole from './components/HintConsole'
import GameOverScreen from './components/GameOverScreen'
import ResetButton from './components/ResetButton'
import TimerCountdown from './components/TimerCountdown'
import AirportPuzzle from './components/AirportPuzzle'
import MapPostIt from './components/MapPostIt'

function App() {
  const {
    city,
    step,
    hint,
    timeRemaining,
    requiredFieldStatuses,
    auxFieldStatuses,
    submitAirportCode,
    reset,
  } = useGameState()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CockpitScene city={city} />

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
        <AirportPuzzle city={city} onSubmit={submitAirportCode} />
      </HintConsole>

      <FieldGrid fields={auxFieldStatuses} palette={city.palette} style={{ right: 180 }} />

      {step === 'game_over' && (
        <GameOverScreen hint={hint} palette={city.palette} onReset={reset} />
      )}
    </div>
  )
}

export default App
