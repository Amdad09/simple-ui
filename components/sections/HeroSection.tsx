'use client'

import { useMemo, useRef } from 'react'
import { useScrollReveal } from '@/components/animations/useScrollReveal'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const revealRefs = useMemo(() => [headRef, subRef, ctaRef], [])

  useScrollReveal(revealRefs)

  return (
    <section
      id="hero"
      className="relative min-h-screen z-10 bg-[#fbf9f2] overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-[1320px] pt-[88px]">
        <div
          className="grid lg:grid-cols-2 lg:gap-14 items-center"
          style={{ height: 'calc(100vh - 88px)' }}
        >
          <div className="order-2 lg:order-1 self-center lg:self-start max-w-[520px]">
            <p className="text-xs font-bold tracking-[0.35em] uppercase text-[#c59d5f] mb-8">
              EST. 2024 · BOTANICAL BEVERAGE
            </p>
            <h1
              ref={headRef}
              className="text-7xl lg:text-9xl font-semibold tracking-tighter leading-[0.92] reveal"
            >
              Botanical<br />
              <span className="block text-[#c59d5f]">stillness.</span>
            </h1>
            <p ref={subRef} className="mt-8 text-lg lg:text-xl text-[#6b6b63] leading-relaxed reveal">
              Distilled from alpine spring water, wild mountain thyme, and late-harvest
              honey. Unhurried. Uncommon. Bottled in glass shaped to serve the pour.
            </p>
            <div className="mt-10 lg:mt-12">
              <Button ref={ctaRef} variant="accent" as="a" href="#product">
                Discover the Taste
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
