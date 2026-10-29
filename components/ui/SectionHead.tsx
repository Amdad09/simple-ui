'use client'

export interface SectionHeadProps {
  kicker: string
  head: string
  sub?: string
  className?: string
  headRef?: React.Ref<HTMLHeadingElement>
  subRef?: React.Ref<HTMLParagraphElement>
}

export function SectionHead({ kicker, head, sub, className, headRef, subRef }: SectionHeadProps) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6b6b63] mb-6">
        {kicker}
      </p>
      <h2
        ref={headRef}
        className="text-5xl lg:text-7xl font-semibold tracking-tighter leading-[1.05]"
      >
        {head}
      </h2>
      {sub && (
        <p
          ref={subRef}
          className="mt-6 text-lg lg:text-xl text-[#6b6b63] leading-relaxed max-w-[44ch]"
        >
          {sub}
        </p>
      )}
    </div>
  )
}
