'use client'

import { useMemo, useRef } from 'react'
import { useScrollReveal } from '@/components/animations/useScrollReveal'
import { Button } from '@/components/ui/Button'
import { SectionHead } from '@/components/ui/SectionHead'

export function ProductSection() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const revealRefs = useMemo(() => [headRef, subRef, btnRef], [])

  useScrollReveal(revealRefs)

  return (
    <section
      id="product"
      className="relative min-h-screen z-10 bg-[#fbf9f2] overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-[1320px] h-full">
        <div
          className="grid lg:grid-cols-2 lg:gap-16 items-center"
          style={{ height: 'calc(100vh - 72px)' }}
        >
          <div className="self-center lg:self-start max-w-[520px] pt-20 lg:pt-28">
            <SectionHead
              kicker="THE BOTTLE"
              head="Form follows silence."
              sub="Mouth-blown glass weighted for the hand. A label that records time. Every curve exists to serve the pour — nothing more, nothing less."
              headRef={headRef}
              subRef={subRef}
            />
            <div className="mt-10 lg:mt-12">
              <Button ref={btnRef} variant="primary" as="a" href="#ingredients">
                Explore the Ingredients
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
