import type { CityConfig } from '../config/cityConfig'
import ResetButton from './ResetButton'

interface EndScreenProps {
  title: string
  hint: string
  palette: CityConfig['palette']
  onReset: () => void
}

function EndScreen({ title, hint, palette, onReset }: EndScreenProps) {
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
      <h1>{title}</h1>
      <p>{hint}</p>
      <ResetButton palette={palette} onReset={onReset} />
    </div>
  )
}

export default EndScreen
