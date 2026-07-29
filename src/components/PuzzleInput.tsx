import { useState } from 'react'
import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface PuzzleInputProps {
  palette: CityConfig['palette']
  placeholder: string
  onSubmit: (value: string) => boolean
}

function PuzzleInput({ palette, placeholder, onSubmit }: PuzzleInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    onSubmit(value)
    setValue('')
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      placeholder={placeholder}
      style={{
        ...panelStyle(palette),
        width: '100%',
        boxSizing: 'border-box',
        padding: '6px 8px',
      }}
    />
  )
}

export default PuzzleInput
