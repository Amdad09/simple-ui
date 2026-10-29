'use client'

/* Three.js scene-graph construction mutates freshly created objects; the
   react-hooks/immutability heuristic is a false positive for this pattern. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { bottleWorld } from '@/lib/bottle-ref'
import { prefersReducedMotion } from '@/lib/media'

// Convincing procedural bottle: no external GLB asset required.
// Lathe-revolved glass body, metallic cap, etched label band, liquid fill.
// A tall, straight-sided silhouette with a long neck — a premium spirit/water
// bottle rather than a squat jar.
const lathePoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.4, 0),
  new THREE.Vector2(0.54, 0.06),
  new THREE.Vector2(0.58, 0.22),
  new THREE.Vector2(0.6, 0.6),
  new THREE.Vector2(0.6, 1.9),
  new THREE.Vector2(0.58, 2.25),
  new THREE.Vector2(0.48, 2.62),
  new THREE.Vector2(0.33, 2.98),
  new THREE.Vector2(0.32, 3.28),
  new THREE.Vector2(0.36, 3.34),
]

// Base-to-knob height, used to centre the bottle on the group origin so scroll
// keyframes can treat y = 0 as "vertically centred".
const BOTTLE_HEIGHT = 3.86
const BOTTLE_CENTER = -BOTTLE_HEIGHT / 2

export function BottleModel() {
  const scene = useThree((state) => state.scene)
  const reduced = prefersReducedMotion()

  const latheGeom = useMemo(() => new THREE.LatheGeometry(lathePoints, 56), [])
  const capGeom = useMemo(() => new THREE.CylinderGeometry(0.34, 0.34, 0.34, 40), [])
  const capTopGeom = useMemo(() => new THREE.CylinderGeometry(0.37, 0.37, 0.1, 40), [])
  const knobGeom = useMemo(() => new THREE.CylinderGeometry(0.13, 0.13, 0.12, 32), [])
  // Band sits just outside the body radius so it reads as an applied label.
  const labelGeom = useMemo(() => new THREE.CylinderGeometry(0.61, 0.61, 0.96, 64), [])
  const liquidGeom = useMemo(() => new THREE.CylinderGeometry(0.52, 0.52, 1.5, 40), [])

  // Label artwork. 2048x512 (4:1) matches the band's unwrapped aspect
  // (2π·0.61 / 0.96 ≈ 4.0) so the type is not squashed.
  const labelTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 2048
    c.height = 512
    const ctx = c.getContext('2d')!
    const W = c.width
    ctx.fillStyle = 'rgba(18, 18, 16, 0.92)'
    ctx.fillRect(0, 0, W, c.height)

    ctx.strokeStyle = '#c59d5f'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(620, 120)
    ctx.lineTo(W - 620, 120)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(620, 396)
    ctx.lineTo(W - 620, 396)
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#c59d5f'
    ctx.font = '600 92px "Times New Roman", Times, serif'
    ctx.fillText('AURELIA', W / 2, 252)
    ctx.font = '500 26px "Helvetica Neue", Helvetica, Arial, sans-serif'
    ctx.fillStyle = '#e8dcc8'
    ctx.fillText('BOTANICAL BEVERAGE  ·  EST. 2024', W / 2, 352)

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])

  // The canvas is transparent (DOM shows through), so transmission has no
  // scene behind it to sample. A thin, highly reflective transparent shell
  // reads as glass and composites cleanly over the page.
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xb6cfc0,
        metalness: 0,
        roughness: 0.03,
        transparent: true,
        opacity: 0.34,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.8,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    []
  )
  const labelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: labelTex,
        roughness: 0.5,
        metalness: 0.15,
        envMapIntensity: 0.6,
      }),
    [labelTex]
  )
  const capMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xc59d5f,
        metalness: 0.95,
        roughness: 0.18,
        envMapIntensity: 1.4,
      }),
    []
  )
  const liquidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xb9822f,
        roughness: 0.14,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  const group = useMemo(() => new THREE.Group(), [])
  // Inner group carries the idle float/spin; the outer group is driven by GSAP
  // so the two never fight over the same transform.
  const bottle = useMemo(() => new THREE.Group(), [])
  const body = useMemo(() => new THREE.Mesh(latheGeom, glassMat), [latheGeom, glassMat])
  const cap = useMemo(() => new THREE.Mesh(capGeom, capMat), [capGeom, capMat])
  const capTop = useMemo(() => new THREE.Mesh(capTopGeom, capMat), [capTopGeom, capMat])
  const knob = useMemo(() => new THREE.Mesh(knobGeom, capMat), [knobGeom, capMat])
  const label = useMemo(() => new THREE.Mesh(labelGeom, labelMat), [labelGeom, labelMat])
  const liquid = useMemo(() => new THREE.Mesh(liquidGeom, liquidMat), [liquidGeom, liquidMat])

  useEffect(() => {
    body.castShadow = true
    cap.castShadow = true
    capTop.castShadow = true
    knob.castShadow = true
    label.castShadow = true

    cap.position.set(0, 3.5, 0)
    capTop.position.set(0, 3.7, 0)
    knob.position.set(0, 3.8, 0)
    label.position.set(0, 1.25, 0)
    // Cylinder UVs start at +z, so the artwork (centred at u = 0.5) faces away.
    // Flip the band so the wordmark faces the camera at rotation 0.
    label.rotation.y = Math.PI
    liquid.position.set(0, 0.95, 0)

    bottle.position.y = BOTTLE_CENTER
    bottle.add(body, cap, capTop, knob, label, liquid)
    group.add(bottle)

    // Static hero pose: also the reduced-motion pose, and what the first paint
    // shows before the scroll timeline takes over.
    group.position.set(1.05, 0, 2.15)
    group.rotation.set(0, 0.12, 0)
    group.scale.setScalar(0.42)

    scene.add(group)
    // The scroll timeline reads these handles; assign them here (not in a
    // separate effect) so they are guaranteed to exist once the model mounts.
    bottleWorld.group = group
    bottleWorld.mesh = body

    return () => {
      bottleWorld.group = null
      bottleWorld.mesh = null
      scene.remove(group)
      latheGeom.dispose()
      capGeom.dispose()
      capTopGeom.dispose()
      knobGeom.dispose()
      labelGeom.dispose()
      liquidGeom.dispose()
      labelTex.dispose()
      glassMat.dispose()
      labelMat.dispose()
      capMat.dispose()
      liquidMat.dispose()
    }
  }, [
    scene,
    group,
    bottle,
    body,
    cap,
    capTop,
    knob,
    label,
    liquid,
    latheGeom,
    capGeom,
    capTopGeom,
    knobGeom,
    labelGeom,
    liquidGeom,
    labelTex,
    glassMat,
    labelMat,
    capMat,
    liquidMat,
  ])

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.getElapsedTime()
    bottle.position.y = BOTTLE_CENTER + Math.sin(t * 1.3) * 0.04
    // Gentle sway rather than a full spin: the wordmark stays readable while
    // the bottle still feels alive.
    bottle.rotation.y = Math.sin(t * 0.35) * 0.08
    bottle.rotation.z = Math.sin(t * 0.5) * 0.012
  })

  return null
}
