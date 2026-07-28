import { useState } from 'react'
import CockpitScene from './scene/CockpitScene'
import { pickRandomCity } from './cities'

function App() {
  const [city, setCity] = useState(pickRandomCity)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CockpitScene city={city} />
      <button
        onClick={() => setCity(pickRandomCity())}
        style={{ position: 'absolute', top: 16, right: 16 }}
      >
        RESET
      </button>
    </div>
  )
}

export default App
