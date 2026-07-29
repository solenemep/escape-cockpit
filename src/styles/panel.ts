import type { CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'

export function panelStyle(
  palette: CityConfig['palette'],
  borderColor: string = palette.accent,
): CSSProperties {
  return {
    border: `2px solid ${borderColor}`,
    background: palette.background,
    color: 'white',
    fontFamily: 'monospace',
    borderRadius: 4,
  }
}
