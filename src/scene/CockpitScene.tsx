import { useEffect, useRef } from 'react'
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import type { CityConfig } from '../cities'

const YAW_LIMIT = Math.PI / 3 // ±60° from center
const ALPHA = -Math.PI / 2
const BETA = Math.PI / 2 // level horizon
const RADIUS = 0.05 // near-zero: camera sits effectively at the target, not orbiting it

const BACKGROUND_DISTANCE = 20
const BACKGROUND_HEIGHT = 20
const BACKGROUND_FOLLOW = 0.9

interface CockpitSceneProps {
  city: CityConfig
}

function CockpitScene({ city }: CockpitSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const cameraRef = useRef<ArcRotateCamera | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    sceneRef.current = scene

    const pilotSeat = Vector3.Zero()
    const camera = new ArcRotateCamera('camera', ALPHA, BETA, RADIUS, pilotSeat, scene)
    cameraRef.current = camera
    camera.attachControl(canvas, true)

    camera.lowerRadiusLimit = camera.radius
    camera.upperRadiusLimit = camera.radius
    camera.panningSensibility = 0

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
      cameraRef.current = null
      sceneRef.current = null
      engine.dispose()
    }
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!scene || !camera) return

    // A pivot at the camera's target, so rotating it swings the plane around
    // in an arc instead of spinning it in place.
    const pivot = new TransformNode('background-pivot', scene)

    const plane = MeshBuilder.CreatePlane(
      'background',
      { width: BACKGROUND_HEIGHT, height: BACKGROUND_HEIGHT },
      scene,
    )
    plane.parent = pivot
    plane.position.z = BACKGROUND_DISTANCE

    const material = new StandardMaterial('background-material', scene)
    material.disableLighting = true
    material.backFaceCulling = false
    const texture = new Texture(city.background, scene, undefined, undefined, undefined, () => {
      const size = texture.getSize()
      plane.scaling.x = size.width / size.height
    })
    material.emissiveTexture = texture
    plane.material = material

    // Snap the view back to center on every city change (including RESET),
    // rather than keeping wherever the player last looked.
    camera.alpha = ALPHA

    const observer = scene.onBeforeRenderObservable.add(() => {
      pivot.rotation.y = -(camera.alpha - ALPHA) * BACKGROUND_FOLLOW
    })

    return () => {
      scene.onBeforeRenderObservable.remove(observer)
      texture.dispose()
      material.dispose()
      plane.dispose()
      pivot.dispose()
    }
  }, [city])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default CockpitScene
