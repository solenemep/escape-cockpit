import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { computeRunwayHeading, type CityConfig } from '../config/cityConfig'

interface RunwayPuzzleProps {
  city: CityConfig
  onSolve: () => boolean
}

const HOLD_MS = 2000
const TOLERANCE_DEGREES = 5

function circularDiff(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function RunwayPuzzle({ city, onSolve }: RunwayPuzzleProps) {
  const target = computeRunwayHeading(city)
  const [heading, setHeading] = useState(0)
  const dialRef = useRef<HTMLDivElement>(null)
  const onSolveRef = useRef(onSolve)
  onSolveRef.current = onSolve

  const stable = circularDiff(heading, target) <= TOLERANCE_DEGREES

  useEffect(() => {
    if (!stable) return
    const timeout = setTimeout(() => onSolveRef.current(), HOLD_MS)
    return () => clearTimeout(timeout)
  }, [stable])

  function angleFromPointer(clientX: number, clientY: number): number | null {
    const rect = dialRef.current?.getBoundingClientRect()
    if (!rect) return null
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const degrees = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90
    return (degrees + 360) % 360
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const angle = angleFromPointer(e.clientX, e.clientY)
    if (angle !== null) setHeading(angle)
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1) return
    const angle = angleFromPointer(e.clientX, e.clientY)
    if (angle !== null) setHeading(angle)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        ref={dialRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: `2px solid ${city.palette.accent}`,
          background: city.palette.background,
          position: 'relative',
          cursor: 'grab',
          touchAction: 'none',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${heading}deg)` }}>
          <div
            style={{ width: 2, height: 30, background: city.palette.accent, margin: '6px auto 0' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'white' }}>
        <span>{Math.round(heading)}°</span>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: stable ? '#2ecc71' : '#555',
          }}
        />
      </div>
    </div>
  )
}

export default RunwayPuzzle
