import type { CityConfig } from '../config/cityConfig'
import type { DataStatus } from '../config/gameConfig'
import { panelStyle } from '../styles/panel'

interface LandingDataProps {
  label: string
  value?: string
  status: DataStatus
  palette: CityConfig['palette']
}

const STATUS_BORDER: Record<DataStatus, keyof CityConfig['palette'] | string> = {
  locked: '#555555',
  active: 'accent',
  solved: '#2ecc71',
  error: '#e74c3c',
}

function LandingData({ label, value, status, palette }: LandingDataProps) {
  const border = STATUS_BORDER[status]
  const borderColor = border in palette ? palette[border as keyof CityConfig['palette']] : border

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
