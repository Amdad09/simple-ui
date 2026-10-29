'use client'

import { useMemo, useRef } from 'react'
import { useScrollReveal } from '@/components/animations/useScrollReveal'
import { SectionHead } from '@/components/ui/SectionHead'

const BOTANICALS = [
  {
    name: 'Alpine Spring Water',
    desc: 'Sourced from a single high-altitude spring. Low mineral content, neutral carrier.',
  },
  {
    name: 'Wild Mountain Thyme',
    desc: 'Hand-picked at dawn. Gives the drink its dry, herbal backbone.',
  },
  {
    name: 'Late-Harvest Honey',
    desc: 'From valley hives. A trace of sweetness that never dominates.',
  },
  {
    name: 'Cold-Pressed Citrus',
    desc: 'Bergamot and yuzu peel, pressed the day they are picked.',
  },
  {
    name: 'Volcanic Minerals',
    desc: 'A measured addition for structure and a long, clean finish.',
  },
]

export function IngredientsSection() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const revealRefs = useMemo(() => [headRef, listRef], [])

  useScrollReveal(revealRefs, { stagger: 0.18 })

  return (
    <section
      id="ingredients"
      className="relative min-h-screen z-10 bg-[#fbf9f2] overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-[1320px] h-full">
        <div className="grid items-start lg:h-[calc(100vh-72px)]">
          <div className="pt-20 lg:pt-32 max-w-[520px]">
            <SectionHead
              kicker="THE BOTANICALS"
              head="What lives inside."
              headRef={headRef}
            />
          </div>
          <div className="pt-20 lg:pt-32">
            <ul ref={listRef} className="grid lg:grid-cols-3 gap-8 reveal lg:max-w-[900px]">
              {BOTANICALS.map((b) => (
                <li key={b.name} className="p-6 lg:p-8 border border-black/10 rounded-2xl bg-white/60 backdrop-blur-sm">
                  <h3 className="text-base font-semibold tracking-tight mb-3">{b.name}</h3>
                  <p className="text-sm text-[#6b6b63] leading-relaxed">{b.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
