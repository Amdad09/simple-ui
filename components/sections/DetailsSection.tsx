'use client'

import { useMemo, useRef } from 'react'
import { useScrollReveal } from '@/components/animations/useScrollReveal'
import { SectionHead } from '@/components/ui/SectionHead'

const NOTES = ['Bright', 'Floral', 'Dry']

export function DetailsSection() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const revealRefs = useMemo(() => [headRef, subRef, gridRef], [])

  useScrollReveal(revealRefs, { stagger: 0.12 })

  return (
    <section id="details" className="relative min-h-screen z-10 bg-[#fbf9f2] overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-[1320px] h-full">
        <div className="grid items-start lg:h-[calc(100vh-72px)]">
          <div className="pt-20 lg:pt-32 max-w-[520px]">
            <SectionHead
              kicker="THE EXPERIENCE"
              head="Notes of stone fruit, dry herbs, and a long, clean finish."
              sub="Serve chilled, on its own, or beside food that does not compete. Best poured into a wide glass and allowed to breathe for three minutes."
              headRef={headRef}
              subRef={subRef}
            />
          </div>
          <div className="pt-20 lg:pt-32">
            <div ref={gridRef} className="grid grid-cols-3 gap-6 reveal lg:max-w-[900px]">
              {NOTES.map((note) => (
                <div
                  key={note}
                  className="p-6 lg:p-8 border border-black/10 rounded-2xl text-center hover:border-black/40 transition-colors"
                >
                  <span className="text-sm font-semibold tracking-[0.2em] uppercase">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
