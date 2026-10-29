'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { bottleWorld } from '@/lib/bottle-ref'
import { BottleScene } from '@/components/3d/BottleScene'
import { Navbar } from '@/components/layout/Navbar'

gsap.registerPlugin(ScrollTrigger)

type BottleKey = {
  /** position x/y/z */
  p: [number, number, number]
  /** rotation y/z (radians) */
  r: [number, number]
  /** uniform scale */
  s: number
}

// One scroll-synchronized timeline drives the single persistent bottle.
// Key i is reached when section i reaches the top of the viewport, so the
// bottle travels continuously through all five sections.
const DESKTOP_KEYS: BottleKey[] = [
  { p: [1.05, 0, 2.15], r: [0.1, 0], s: 0.42 },
  { p: [0.95, -0.05, 2.5], r: [0.45, 0.03], s: 0.35 },
  { p: [1.12, 0.35, 2.3], r: [-0.3, -0.02], s: 0.36 },
  { p: [1.12, 0.3, 2.45], r: [-0.5, 0.02], s: 0.35 },
  { p: [1.0, 0.1, 2.0], r: [0.35, 0], s: 0.43 },
]

const MOBILE_KEYS: BottleKey[] = [
  { p: [0.26, -0.62, 3.0], r: [0.2, 0], s: 0.13 },
  { p: [0.24, -0.58, 3.15], r: [0.4, 0.04], s: 0.13 },
  { p: [0.26, -0.58, 3.0], r: [-0.25, -0.04], s: 0.14 },
  { p: [0.26, -0.58, 3.2], r: [-0.4, 0.02], s: 0.13 },
  { p: [0.22, -0.6, 2.9], r: [0.3, 0], s: 0.14 },
]

const DESKTOP_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const MOBILE_QUERY = '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'

// Keyframes are aligned to these section tops.
const SECTION_SELECTORS = ['#hero', '#product', '#ingredients', '#details', '#final']

export default function ScrollExperience({
  children,
}: {
  children: React.ReactNode
}) {
  const indRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  // Fade the scroll cue out once the journey starts.
  useEffect(() => {
    const el = indRef.current
    if (!el) return
    const onScroll = () => {
      el.style.opacity = window.scrollY > 60 ? '0' : '1'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // The R3F canvas is client-only; wait until the bottle group exists.
    if (!mounted) return

    let disposed = false
    let retryId: number | undefined
    let resizeId: number | undefined
    let attempts = 0
    let mm: gsap.MatchMedia | undefined

    const buildTimeline = (keys: BottleKey[]) => {
      const group = bottleWorld.group
      if (!group) return

      const doc = document.documentElement
      const total = Math.max(1, doc.scrollHeight - window.innerHeight)
      // Align each keyframe with the top of its section. Sections are one
      // viewport tall on desktop but can grow taller on phones, so measure
      // instead of assuming a fixed height.
      const offsets = SECTION_SELECTORS.map((selector) => {
        const el = document.querySelector(selector)
        return el ? Math.min(total, el.getBoundingClientRect().top + window.scrollY) : 0
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: doc,
          start: 'top top',
          end: () => `+=${Math.max(1, document.documentElement.scrollHeight - window.innerHeight)}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })

      keys.forEach((key, i) => {
        const position = { x: key.p[0], y: key.p[1], z: key.p[2] }
        const rotation = { y: key.r[0], z: key.r[1] }
        const scale = { x: key.s, y: key.s, z: key.s }

        if (i === 0) {
          tl.set(group.position, position, 0)
          tl.set(group.rotation, rotation, 0)
          tl.set(group.scale, scale, 0)
        } else {
          const from = offsets[i - 1]
          const duration = Math.max(1, offsets[i] - from)
          tl.to(group.position, { ...position, duration }, from)
          tl.to(group.rotation, { ...rotation, duration }, from)
          tl.to(group.scale, { ...scale, duration }, from)
        }
      })

      // Hold the final pose across the footer.
      tl.to(
        {},
        { duration: Math.max(1, total - offsets[offsets.length - 1]) },
        offsets[offsets.length - 1]
      )

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    }

    const createContexts = () => {
      mm?.revert()
      mm = gsap.matchMedia()
      mm.add(DESKTOP_QUERY, () => buildTimeline(DESKTOP_KEYS))
      mm.add(MOBILE_QUERY, () => buildTimeline(MOBILE_KEYS))
      ScrollTrigger.refresh()
    }

    const start = () => {
      if (disposed) return
      if (!bottleWorld.group) {
        // Give the canvas a bounded number of frames to mount (WebGL fallback).
        if (attempts++ > 240) return
        retryId = window.requestAnimationFrame(start)
        return
      }
      createContexts()
    }

    // Section heights change on resize/orientation, so rebuild the measured
    // keyframe offsets (debounced) rather than leaving the bottle misaligned.
    const onResize = () => {
      if (disposed) return
      if (resizeId !== undefined) window.clearTimeout(resizeId)
      resizeId = window.setTimeout(createContexts, 250)
    }
    window.addEventListener('resize', onResize)

    retryId = window.requestAnimationFrame(start)

    return () => {
      disposed = true
      if (retryId !== undefined) cancelAnimationFrame(retryId)
      if (resizeId !== undefined) window.clearTimeout(resizeId)
      window.removeEventListener('resize', onResize)
      mm?.revert()
    }
  }, [mounted])

  return (
    <>
      <Navbar />
      <div
        ref={indRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center transition-opacity duration-500"
      >
        <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6b6b63]">
          Scroll
        </span>
        <span className="h-12 w-px bg-black/20" />
        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#c59d5f] motion-safe:animate-bounce" />
      </div>
      {mounted && (
        <div className="pointer-events-none fixed inset-0 z-20">
          <BottleScene />
        </div>
      )}
      {children}
    </>
  )
}
