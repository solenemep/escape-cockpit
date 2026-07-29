import { STATUS_BORDER, type CityConfig } from '../config/cityConfig'
import type { DataStatus } from '../config/gameConfig'
import { panelStyle } from '../styles/panel'

interface LandingDataProps {
  label: string
  value?: string
  status: DataStatus
  palette: CityConfig['palette']
}

function LandingData({ label, value, status, palette }: LandingDataProps) {
  const borderColor = palette[STATUS_BORDER[status]]

  return (
    <div
      style={{
        ...panelStyle(palette, borderColor),
        opacity: status === 'locked' ? 0.5 : 1,
        padding: '6px 12px',
        minWidth: 100,
      }}
    >
      <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>
      <div>{value ?? '—'}</div>
    </div>
  )
}

export default LandingData
