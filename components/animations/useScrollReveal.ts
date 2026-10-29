'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Reveals DOM content as its section enters the viewport. Each section owns its
// own triggers (different targets), so they never conflict with the shared
// bottle timeline in ScrollExperience.
export function useScrollReveal(
  refs: React.RefObject<Element | null>[],
  {
    stagger = 0.14,
    start = 'top 92%',
    end = 'top 70%',
  }: { stagger?: number; start?: string; end?: string } = {}
) {
  useEffect(() => {
    const elements = refs
      .map((ref) => ref.current)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
    if (!elements.length) return

    const build = (isMobile: boolean) => {
      const animations = elements.map((el, i) =>
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            delay: i * stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub: isMobile ? false : 1,
              toggleActions: isMobile ? 'play none play none' : 'play reverse play reverse',
            },
          }
        )
      )
      return () => animations.forEach((a) => a.kill())
    }

    // Always build a reveal for both breakpoints — previously a `mobile` flag
    // meant some sections only animated on phones and stayed invisible on
    // desktop (or vice versa).
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => build(false))
    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => build(true))
    return () => mm.revert()
  }, [refs, stagger, start, end])
}
