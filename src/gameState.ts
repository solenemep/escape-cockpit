import { useEffect, useState } from 'react'
import { pickRandomCity } from './config/cityConfig'
import {
  TIMER_SECONDS,
  REQUIRED_FIELDS,
  HINTS,
  AUX_FIELDS,
  type GameStep,
  type DataStatus,
} from './config/gameConfig'

export function useGameState() {
  const [city, setCity] = useState(pickRandomCity)
  const [step, setStep] = useState<GameStep>('airport')
  const [timeRemaining, setTimeRemaining] = useState(TIMER_SECONDS)
  const [answers, setAnswers] = useState<Partial<Record<GameStep, string>>>({})
  const [distanceRemaining, setDistanceRemaining] = useState<number | null>(null)

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
    setAnswers({})
    setDistanceRemaining(null)
  }

  // Records the answer for `fromStep` and moves to whichever step follows it in
  // REQUIRED_FIELDS, or 'won' once the last one (combine) has been answered.
  function advanceStep(fromStep: GameStep, value: string) {
    setAnswers((a) => ({ ...a, [fromStep]: value }))
    const i = REQUIRED_FIELDS.findIndex((field) => field.activeStep === fromStep)
    const next = REQUIRED_FIELDS[i + 1]
    setStep(next ? next.activeStep : 'won')
  }

  function submitAirportCode(code: string): boolean {
    if (step !== 'airport') return false
    const correct = code.trim().toUpperCase() === city.airportCode
    if (correct) {
      setDistanceRemaining(city.distanceRemaining)
      advanceStep('airport', city.airportCode)
    }
    return correct
  }

  const requiredFieldStatuses: Array<{ label: string; status: DataStatus; value?: string }> =
    REQUIRED_FIELDS.map((field) => ({
      label: field.label,
      status:
        field.activeStep === step
          ? 'active'
          : answers[field.activeStep] !== undefined
            ? 'solved'
            : 'locked',
      value: answers[field.activeStep],
    }))

  const auxFieldStatuses: Array<{ label: string; status: DataStatus; value?: string }> =
    AUX_FIELDS.map((field) => ({
      label: field.label,
      status: step === field.activeStep ? 'active' : 'available',
      value: field.getValue?.(city, distanceRemaining),
    }))

  return {
    city,
    step,
    hint: HINTS[step].replace('{city}', city.name),
    timeRemaining: Math.max(timeRemaining, 0),
    requiredFieldStatuses,
    auxFieldStatuses,
    submitAirportCode,
    reset,
  }
}
