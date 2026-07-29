import type { CityConfig } from '../config/cityConfig'

interface HintConsoleProps {
  hint: string
  palette: CityConfig['palette']
}

function HintConsole({ hint, palette }: HintConsoleProps) {
  if (!hint) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: palette.background,
        color: palette.accent,
        padding: '78px 16px',
        borderRadius: 4,
        fontFamily: 'monospace',
      }}
    >
      {hint}
    </div>
  )
}

export default HintConsole
