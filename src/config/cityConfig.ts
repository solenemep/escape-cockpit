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
    accent: string
    background: string
  }
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
    palette: { primary: '#C0392B', accent: '#F1C40F', background: '#154360' },
  },
  {
    id: 'paris',
    name: 'Paris',
    airportCode: 'CDG',
    skyline: '/cities/paris/skyline.png',
    background: '/cities/paris/background.png',
    distanceRemaining: 150,
    speed: 300,
    currentTime: '22:40',
    windDirection: 270,
    palette: { primary: '#2E4053', accent: '#D4AC0D', background: '#1B2631' },
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
    palette: { primary: '#7D6608', accent: '#2980B9', background: '#212F3D' },
  },
]
