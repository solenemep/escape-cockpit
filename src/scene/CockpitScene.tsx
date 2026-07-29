import { useEffect, useRef } from 'react'
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  ImportMeshAsync,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import type { CityConfig } from '../config/cityConfig'

const YAW_LIMIT = Math.PI / 6 // ±30°
const ALPHA = -Math.PI / 2
const BETA = Math.PI / 2
const RADIUS = 0.05 // near-zero: camera sits effectively at the target, not orbiting it
const FOV = 2.0 // wide FOV so the whole cockpit interior

// Y/Z (eye height / depth into the seat)
const COCKPIT_EYE_HEIGHT = -65
const COCKPIT_EYE_DEPTH = 28

// Keep the background safely behind the full cockpit model.
// Its height is calculated to fill the wider camera FOV.
const BACKGROUND_DISTANCE = 1000
const BACKGROUND_HEIGHT = 2 * BACKGROUND_DISTANCE * Math.tan(FOV / 2) * 1.2
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
    camera.fov = FOV

    camera.lowerAlphaLimit = ALPHA - YAW_LIMIT
    camera.upperAlphaLimit = ALPHA + YAW_LIMIT
    camera.lowerBetaLimit = BETA
    camera.upperBetaLimit = BETA
    camera.lowerRadiusLimit = RADIUS
    camera.upperRadiusLimit = RADIUS

    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    let cancelled = false
    ImportMeshAsync('/models/aircraft-cockpit.glb', scene).then((result) => {
      if (cancelled) {
        result.meshes.forEach((mesh) => mesh.dispose())
        return
      }
      const root = result.meshes[0]
      const { min, max } = root.getHierarchyBoundingVectors()
      const centerX = (min.x + max.x) / 2
      root.position.set(-centerX, COCKPIT_EYE_HEIGHT, COCKPIT_EYE_DEPTH)

      // Render the cockpit after the background.
      result.meshes.forEach((mesh) => {
        mesh.renderingGroupId = 1
      })
    })

    engine.runRenderLoop(() => {
      scene.render()
    })

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelled = true
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

    camera.alpha = ALPHA

    // A pivot at the camera's target which rotates the background plane to follow the camera's yaw.
    const pivot = new TransformNode('background-pivot', scene)

    const plane = MeshBuilder.CreatePlane(
      'background',
      { width: BACKGROUND_HEIGHT, height: BACKGROUND_HEIGHT },
      scene,
    )
    plane.parent = pivot
    plane.position.z = BACKGROUND_DISTANCE
    plane.renderingGroupId = 0

    const material = new StandardMaterial('background-material', scene)
    material.disableLighting = true
    material.disableDepthWrite = true
    material.backFaceCulling = false
    const texture = new Texture(city.background, scene, undefined, undefined, undefined, () => {
      const size = texture.getSize()
      plane.scaling.x = size.width / size.height
    })
    material.emissiveTexture = texture
    plane.material = material

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
