import type { CityConfig } from './cityConfig'

export type GameStep = 'airport' | 'eta' | 'runway' | 'combine' | 'won' | 'game_over'
export type DataStatus = 'locked' | 'active' | 'solved' | 'available'

export const TIMER_SECONDS = 240

export interface Field {
  label: string
  activeStep: GameStep
  getValue?: (city: CityConfig, distanceRemaining: number | null) => string | undefined
}

export const REQUIRED_FIELDS: Field[] = [
  { label: 'airport', activeStep: 'airport' },
  { label: 'eta', activeStep: 'eta' },
  { label: 'runway', activeStep: 'runway' },
  { label: 'combine', activeStep: 'combine' },
]

export const HINTS: Record<GameStep, string> = {
  airport: 'Get airport code',
  eta: 'Calculate ETA',
  runway: 'Find runway number',
  combine: 'Input landing data XXX-XX:XX-XX',
  won: 'Welcome to {city}',
  game_over: 'The plane is out of control.',
}

export const AUX_FIELDS: Field[] = [
  { label: 'time', activeStep: 'eta', getValue: (city) => city.currentTime },
  { label: 'speed', activeStep: 'eta', getValue: (city) => `${city.speed}kt` },
  {
    label: 'distance remaining',
    activeStep: 'eta',
    getValue: (_city, distanceRemaining) =>
      distanceRemaining !== null ? `${distanceRemaining}nm` : undefined,
  },
  { label: 'wind direction', activeStep: 'runway', getValue: (city) => `${city.windDirection}°` },
]
