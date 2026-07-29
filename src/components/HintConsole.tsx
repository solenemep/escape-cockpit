import type { ReactNode } from 'react'
import type { CityConfig } from '../config/cityConfig'

interface HintConsoleProps {
  hint: string
  palette: CityConfig['palette']
  children?: ReactNode
}

function HintConsole({ hint, palette, children }: HintConsoleProps) {
  if (!hint) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 140,
          minHeight: 150,
          background: palette.background,
          color: palette.accent,
          padding: '12px 16px',
          borderRadius: 4,
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div>{hint}</div>
        {children}
      </div>
    </div>
  )
}

export default HintConsole
