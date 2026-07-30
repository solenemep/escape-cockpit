import type { CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'
import type { FieldStatus } from '../config/gameConfig'
import LandingData from './LandingData'

interface FieldGridProps {
  fields: FieldStatus[]
  palette: CityConfig['palette']
  style?: CSSProperties
  animateActive?: boolean
}

function FieldGrid({ fields, palette, style, animateActive }: FieldGridProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 30,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
        ...style,
      }}
    >
      {fields.map(({ label, status, value }) => (
        <LandingData
          key={label}
          label={label}
          value={value}
          status={status}
          palette={palette}
          animateActive={animateActive}
        />
      ))}
    </div>
  )
}

export default FieldGrid
