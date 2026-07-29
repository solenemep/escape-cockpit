import type { CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface TimerCountdownProps {
  seconds: number
  palette: CityConfig['palette']
  style?: CSSProperties
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function TimerCountdown({ seconds, palette, style }: TimerCountdownProps) {
  return (
    <div
      style={{
        ...panelStyle(palette),
        color: palette.accent,
        fontSize: 36,
        fontWeight: 'bold',
        padding: '8px 20px',
        ...style,
      }}
    >
      {formatTime(seconds)}
    </div>
  )
}

export default TimerCountdown
