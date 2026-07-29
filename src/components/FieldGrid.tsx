import type { CSSProperties } from 'react'
import type { CityConfig } from '../config/cityConfig'
import type { DataStatus } from '../config/gameConfig'
import LandingData from './LandingData'

interface FieldGridProps {
  fields: Array<{ label: string; status: DataStatus; value?: string }>
  palette: CityConfig['palette']
  style?: CSSProperties
}

function FieldGrid({ fields, palette, style }: FieldGridProps) {
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
        <LandingData key={label} label={label} value={value} status={status} palette={palette} />
      ))}
    </div>
  )
}

export default FieldGrid
