import { useGameState } from './gameState'
import CockpitScene from './scene/CockpitScene'
import LandingData from './components/LandingData'
import HintConsole from './components/HintConsole'
import GameOverScreen from './components/GameOverScreen'
import ResetButton from './components/ResetButton'
import TimerCountdown from './components/TimerCountdown'

function App() {
  const { city, step, hint, timeRemaining, gameProgression, reset } = useGameState()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CockpitScene city={city} />

      <ResetButton
        palette={city.palette}
        onReset={reset}
        style={{ position: 'absolute', top: 16, right: 16 }}
      />

      <TimerCountdown
        seconds={timeRemaining}
        palette={city.palette}
        style={{ position: 'absolute', top: 16, left: 16 }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 180,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
        }}
      >
        {gameProgression.map(({ step: fieldStep, status }) => (
          <LandingData key={fieldStep} label={fieldStep} status={status} palette={city.palette} />
        ))}
      </div>

      <HintConsole hint={hint} palette={city.palette} />

      {step === 'game_over' && (
        <GameOverScreen hint={hint} palette={city.palette} onReset={reset} />
      )}
    </div>
  )
}

export default App
