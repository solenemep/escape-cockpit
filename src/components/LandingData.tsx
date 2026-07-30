import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { STATUS_BORDER, type CityConfig } from '../config/cityConfig'
import type { DataStatus } from '../config/gameConfig'
import { panelStyle } from '../styles/panel'

interface LandingDataProps {
  label: string
  value?: string
  status: DataStatus
  palette: CityConfig['palette']
  animateActive?: boolean
}

function LandingData({ label, value, status, palette, animateActive }: LandingDataProps) {
  const borderColor = palette[STATUS_BORDER[status]]
  const [justFilled, setJustFilled] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (!prevValue.current && value) {
      setJustFilled(true)
      const timeout = setTimeout(() => setJustFilled(false), 600)
      prevValue.current = value
      return () => clearTimeout(timeout)
    }
    prevValue.current = value
  }, [value])

  const className = [
    animateActive && status === 'active' && 'field-active',
    justFilled && 'field-fulfilled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className || undefined}
      style={
        {
          ...panelStyle(palette, borderColor),
          opacity: status === 'locked' ? 0.5 : 1,
          padding: '6px 12px',
          minWidth: 100,
          '--glow-color': borderColor,
        } as CSSProperties
      }
    >
      <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>
      <div>{value ?? '—'}</div>
    </div>
  )
}

export default LandingData
