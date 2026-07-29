import { getDecoys, type CityConfig } from '../config/cityConfig'

interface MapPostItProps {
  city: CityConfig
}

function MapPostIt({ city }: MapPostItProps) {
  const options = [{ code: city.airportCode, skyline: city.skyline }, ...getDecoys(city.id)]

  return (
    <div
      style={{
        background: 'white',
        color: '#222',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 12,
        padding: 12,
        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)',
        transform: 'rotate(3deg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {options.map((option) => (
        <div key={option.code} style={{ textAlign: 'center' }}>
          <img src={option.skyline} alt="" style={{ width: 200, display: 'block' }} />
          <div>{option.code}</div>
        </div>
      ))}
    </div>
  )
}

export default MapPostIt
