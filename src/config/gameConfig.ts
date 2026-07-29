export type GameStep = 'airport' | 'eta' | 'runway' | 'combine' | 'won' | 'game_over'
export type DataStatus = 'locked' | 'active' | 'solved' | 'error'

export const TIMER_SECONDS = 240
export const REQUIRED_FIELDS: GameStep[] = ['airport', 'eta', 'runway', 'combine']
export const HINTS: Record<GameStep, string> = {
  airport: 'Get airport code',
  eta: 'Calculate ETA',
  runway: 'Find runway number',
  combine: 'Input landing data XXX-XX:XX-XX',
  won: 'Welcome to {city}',
  game_over: 'The plane is out of control.',
}
