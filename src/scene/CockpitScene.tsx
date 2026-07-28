import { useEffect, useRef } from 'react'
import { ArcRotateCamera, Engine, HemisphericLight, Scene, Vector3 } from '@babylonjs/core'

// Yaw-only look-around, per specs.md: fixed position, clamped arc, no pitch/roll.
const YAW_LIMIT = Math.PI / 3 // ±60° from center
const ALPHA = -Math.PI / 2
const BETA = Math.PI / 2 // level horizon
const RADIUS = 0.05 // near-zero: camera sits effectively at the target, not orbiting it

function CockpitScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)

    // Target is the pilot's eye position — placeholder until the cockpit
    // model (step 3/4) gives us the real seat coordinates.
    const pilotSeat = Vector3.Zero()
    const camera = new ArcRotateCamera('camera', ALPHA, BETA, RADIUS, pilotSeat, scene)
    camera.attachControl(canvas, true)

    // Lock radius (no zoom/dolly) and disable panning — the camera never translates.
    camera.lowerRadiusLimit = camera.radius
    camera.upperRadiusLimit = camera.radius
    camera.panningSensibility = 0

    // Clamp yaw to a limited arc; lock pitch to a single value (no tilt/roll).
    camera.lowerAlphaLimit = ALPHA - YAW_LIMIT
    camera.upperAlphaLimit = ALPHA + YAW_LIMIT
    camera.lowerBetaLimit = BETA
    camera.upperBetaLimit = BETA

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    engine.runRenderLoop(() => {
      scene.render()
    })

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engine.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default CockpitScene
