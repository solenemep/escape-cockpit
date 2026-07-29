import { useState } from 'react'
import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface AirportPuzzleProps {
  city: CityConfig
  onSubmit: (code: string) => boolean
}

function AirportPuzzle({ city, onSubmit }: AirportPuzzleProps) {
  const [code, setCode] = useState('')

  function handleSubmit() {
    onSubmit(code)
    setCode('')
  }

  return (
    <input
      value={code}
      onChange={(e) => setCode(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      placeholder="Airport code"
      style={{
        ...panelStyle(city.palette),
        width: '100%',
        boxSizing: 'border-box',
        padding: '6px 8px',
      }}
    />
  )
}

export default AirportPuzzle
