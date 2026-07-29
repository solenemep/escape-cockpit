import { useEffect, useState } from 'react'
import { CITIES, type CityConfig, type CityId } from './config/cityConfig'
import {
  TIMER_SECONDS,
  REQUIRED_FIELDS,
  HINTS,
  type GameStep,
  type DataStatus,
} from './config/gameConfig'

export function pickRandomCity(): CityConfig {
  return CITIES[Math.floor(Math.random() * CITIES.length)]
}

export function getDecoys(cityId: CityId): Array<{ code: string; skyline: string }> {
  return CITIES.filter((city) => city.id !== cityId).map((city) => ({
    code: city.airportCode,
    skyline: city.skyline,
  }))
}

export function useGameState() {
  const [city, setCity] = useState(pickRandomCity)
  const [step, setStep] = useState<GameStep>('airport')
  const [timeRemaining, setTimeRemaining] = useState(TIMER_SECONDS)

  useEffect(() => {
    if (step === 'won' || step === 'game_over') return
    const interval = setInterval(() => setTimeRemaining((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    if (timeRemaining <= 0 && step !== 'won') setStep('game_over')
  }, [timeRemaining, step])

  function reset() {
    setCity(pickRandomCity())
    setStep('airport')
    setTimeRemaining(TIMER_SECONDS)
  }

  const currentIndex = REQUIRED_FIELDS.indexOf(step)
  const gameProgression: Array<{ step: GameStep; status: DataStatus }> = REQUIRED_FIELDS.map(
    (fieldStep, i) => ({
      step: fieldStep,
      status:
        fieldStep === step ? 'active' : currentIndex > i || step === 'won' ? 'solved' : 'locked',
    }),
  )

  return {
    city,
    step,
    setStep,
    hint: HINTS[step].replace('{city}', city.name),
    timeRemaining: Math.max(timeRemaining, 0),
    gameProgression,
    reset,
  }
}
