'use client'

import { useMemo, useRef } from 'react'
import { useScrollReveal } from '@/components/animations/useScrollReveal'
import { Button } from '@/components/ui/Button'

export function FinalCTASection() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const revealRefs = useMemo(() => [headRef, subRef, btnRef], [])

  useScrollReveal(revealRefs)

  return (
    <section id="final" className="relative min-h-screen z-10 bg-[#f4efe8] overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-[1320px] h-full">
        <div
          className="grid items-center justify-center text-center"
          style={{ height: 'calc(100vh - 72px)' }}
        >
          <div className="max-w-[520px] mx-auto translate-y-16 lg:translate-y-10">
            <p className="text-xs font-bold tracking-[0.35em] uppercase text-[#c59d5f] mb-8">
              AVAILABLE NOW
            </p>
            <h1
              ref={headRef}
              className="text-6xl lg:text-8xl font-semibold tracking-tighter leading-[1.05]"
            >
              Bottled in small batches.
            </h1>
            <p ref={subRef} className="mt-8 text-lg lg:text-xl text-[#6b6b63] leading-relaxed">
              Once it is gone, it is gone.
            </p>
            <div className="mt-10 lg:mt-12">
              <Button
                ref={btnRef}
                variant="primary"
                as="a"
                href="mailto:orders@aurelia.studio?subject=Order%20Aurelia"
              >
                Order a Bottle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
