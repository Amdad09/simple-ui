'use client'

import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { BottleModel } from './BottleModel'

// A tiny procedural studio environment. Using an env map (instead of a giant
// backdrop sphere) keeps the canvas transparent so the DOM content stays
// visible, while still giving the glass and metal something to reflect.
function makeStudioEnvironment(gl: THREE.WebGLRenderer) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const ctx = c.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, 0, c.height)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.38, '#f7f1e6')
  grad.addColorStop(0.64, '#ded0ba')
  grad.addColorStop(1, '#5f5548')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, c.width, c.height)

  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  // Key light + fill, as soft blobs in the equirect image.
  glow(230, 130, 230, 'rgba(255, 255, 255, 0.95)')
  glow(790, 110, 190, 'rgba(255, 247, 230, 0.8)')
  glow(520, 400, 300, 'rgba(110, 94, 74, 0.35)')

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace

  const pmrem = new THREE.PMREMGenerator(gl)
  const env = pmrem.fromEquirectangular(tex).texture
  tex.dispose()
  pmrem.dispose()
  return env
}

function SceneRig({ lights }: { lights: THREE.Light[] }) {
  const scene = useThree((state) => state.scene)
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.05
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  useEffect(() => {
    const env = makeStudioEnvironment(gl)
    /* eslint-disable react-hooks/immutability -- Three.js scene objects are mutable by design */
    scene.environment = env
    scene.environmentIntensity = 0.9
    /* eslint-enable react-hooks/immutability */
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [scene, gl])

  useEffect(() => {
    lights.forEach((light) => scene.add(light))
    return () => lights.forEach((light) => scene.remove(light))
  }, [scene, lights])

  return null
}

export function BottleScene() {
  const lights = useMemo(() => {
    const ambient = new THREE.AmbientLight(0xffffff, 0.25)
    const hemi = new THREE.HemisphereLight('#fbf9f2', '#2d3a30', 0.35)
    const dir = new THREE.DirectionalLight(0xffffff, 1.6)
    dir.position.set(5, 8, 6)
    dir.castShadow = true
    dir.shadow.mapSize.set(1024, 1024)
    dir.shadow.bias = -0.0005
    const key = new THREE.SpotLight(0xfff4e0, 24)
    key.position.set(-5, 5, 6)
    key.angle = 0.4
    key.penumbra = 0.9
    key.distance = 30
    key.decay = 2
    const rim = new THREE.SpotLight(0xffffff, 14)
    rim.position.set(5, 2, 4)
    rim.angle = 0.5
    rim.penumbra = 0.9
    rim.distance = 26
    rim.decay = 2
    return [ambient, hemi, dir, key, rim]
  }, [])

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5.6], fov: 40, near: 0.1, far: 120 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <SceneRig lights={lights} />
      <BottleModel />
    </Canvas>
  )
}
