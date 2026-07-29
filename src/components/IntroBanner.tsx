import type { CityConfig } from '../config/cityConfig'
import { panelStyle } from '../styles/panel'

interface IntroBannerProps {
  palette: CityConfig['palette']
}

function IntroBanner({ palette }: IntroBannerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          ...panelStyle(palette),
          padding: '8px 16px',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        Retrieve landing data for the emergency console before the plane is out of control.
      </div>
    </div>
  )
}

export default IntroBanner
