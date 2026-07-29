import type { DataStatus } from './gameConfig'

export type CityId = 'barcelona' | 'paris' | 'athens'

export interface CityConfig {
  id: CityId
  name: string
  airportCode: string
  skyline: string // silhouette icon, used for MAP identification (Puzzle 1)
  background: string // photorealistic window backdrop, rendered in the 3D scene
  distanceRemaining: number // nm
  speed: number // knots
  currentTime: string // "HH:MM", in-fiction clock time at game start
  windDirection: number // degrees
  palette: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

export const STATUS_BORDER: Record<DataStatus, keyof CityConfig['palette']> = {
  locked: 'background',
  active: 'accent',
  solved: 'secondary',
  available: 'primary',
}

export const CITIES: CityConfig[] = [
  {
    id: 'barcelona',
    name: 'Barcelona',
    airportCode: 'BCN',
    skyline: '/cities/barcelona/skyline.png',
    background: '/cities/barcelona/background.png',
    distanceRemaining: 120,
    speed: 280,
    currentTime: '14:05',
    windDirection: 90,
    palette: { primary: '#95A5A6', secondary: '#27AE60', accent: '#F1C40F', background: '#154360' },
  },
  {
    id: 'paris',
    name: 'Paris',
    airportCode: 'CDG',
    skyline: '/cities/paris/skyline.png',
    background: '/cities/paris/background.png',
    distanceRemaining: 150,
    speed: 300,
    currentTime: '19:40',
    windDirection: 270,
    palette: { primary: '#7F8C9A', secondary: '#5499C7', accent: '#AED6F1', background: '#1B2631' },
  },
  {
    id: 'athens',
    name: 'Athens',
    airportCode: 'ATH',
    skyline: '/cities/athens/skyline.png',
    background: '/cities/athens/background.png',
    distanceRemaining: 95,
    speed: 260,
    currentTime: '08:20',
    windDirection: 140,
    palette: { primary: '#B2BABB', secondary: '#2ECC71', accent: '#2980B9', background: '#212F3D' },
  },
]

export function pickRandomCity(): CityConfig {
  return CITIES[Math.floor(Math.random() * CITIES.length)]
}

export function getDecoys(cityId: CityId): Array<{ code: string; skyline: string }> {
  return CITIES.filter((city) => city.id !== cityId).map((city) => ({
    code: city.airportCode,
    skyline: city.skyline,
  }))
}

// currentTime + distanceRemaining / speed, formatted "HH:MM", wrapping past midnight.
export function computeEta(city: CityConfig): string {
  const [hours, minutes] = city.currentTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + Math.round((city.distanceRemaining / city.speed) * 60)
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440
  const etaHours = Math.floor(wrapped / 60)
  const etaMinutes = wrapped % 60
  return `${etaHours.toString().padStart(2, '0')}:${etaMinutes.toString().padStart(2, '0')}`
}

// windDirection rounded to the nearest 10 degrees — the runway's target heading.
export function computeRunwayHeading(city: CityConfig): number {
  return Math.round(city.windDirection / 10) * 10
}

// runway heading / 10, zero-padded to 2 digits.
export function computeRunway(city: CityConfig): string {
  return (computeRunwayHeading(city) / 10).toString().padStart(2, '0')
}
