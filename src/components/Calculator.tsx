import { useState, type CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface CalculatorProps {
  palette: CityConfig['palette']
  style?: CSSProperties
}

const BUTTONS = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+']

const OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
}

function Calculator({ palette, style }: CalculatorProps) {
  const [open, setOpen] = useState(false)
  const [display, setDisplay] = useState('0')
  const [pending, setPending] = useState<{ value: number; operator: string } | null>(null)

  const buttonStyle = { ...panelStyle(palette), padding: '4px 0', fontSize: 12, cursor: 'pointer' }

  function equals() {
    if (!pending) return
    const current = parseFloat(display)
    const result = OPS[pending.operator](pending.value, current)
    setDisplay(String(Math.round(result * 100) / 100))
    setPending(null)
  }

  function handlePress(button: string) {
    if (button === '=') {
      equals()
    } else if (button in OPS) {
      setPending({ value: parseFloat(display), operator: button })
      setDisplay('0')
    } else if (button === '.') {
      setDisplay((prev) => (prev.includes('.') ? prev : prev + '.'))
    } else {
      setDisplay((prev) => (prev === '0' ? button : prev + button))
    }
  }

  function clear() {
    setDisplay('0')
    setPending(null)
  }

  if (!open) {
    return (
      <div style={style}>
        <button
          onClick={() => setOpen(true)}
          style={{
            ...panelStyle(palette),
            width: 100,
            padding: '8px 0',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          CALC ▲
        </button>
      </div>
    )
  }

  return (
    <div style={style}>
      <div style={{ ...panelStyle(palette), padding: 8, width: 140 }}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 8px',
            marginBottom: 6,
            textAlign: 'right',
            fontFamily: 'monospace',
            fontSize: 16,
          }}
        >
          {display}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {BUTTONS.map((button) => (
            <button key={button} onClick={() => handlePress(button)} style={buttonStyle}>
              {button}
            </button>
          ))}
          <button onClick={clear} style={{ ...buttonStyle, gridColumn: 'span 2' }}>
            C
          </button>
          <button onClick={() => setOpen(false)} style={{ ...buttonStyle, gridColumn: 'span 2' }}>
            ▼
          </button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
