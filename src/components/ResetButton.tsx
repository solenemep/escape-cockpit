import type { CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface ResetButtonProps {
  palette: CityConfig['palette']
  onReset: () => void
  style?: CSSProperties
}

function ResetButton({ palette, onReset, style }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      style={{
        ...panelStyle(palette),
        padding: '6px 12px',
        textTransform: 'uppercase',
        fontSize: 12,
        cursor: 'pointer',
        ...style,
      }}
    >
      RESET
    </button>
  )
}

export default ResetButton
