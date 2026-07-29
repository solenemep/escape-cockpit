import type { CityConfig } from '../config/cityConfig'
import ResetButton from './ResetButton'

interface GameOverScreenProps {
  hint: string
  palette: CityConfig['palette']
  onReset: () => void
}

function GameOverScreen({ hint, palette, onReset }: GameOverScreenProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: 'monospace',
      }}
    >
      <h1>GAME OVER</h1>
      <p>{hint}</p>
      <ResetButton palette={palette} onReset={onReset} />
    </div>
  )
}

export default GameOverScreen
