'use client'

import { forwardRef } from 'react'
import type { ReactNode, Ref } from 'react'

type Variant = 'primary' | 'accent' | 'outline'

interface ButtonProps {
  variant?: Variant
  as?: 'a' | 'button'
  href?: string
  className?: string
  onClick?: () => void
  children?: ReactNode
}

const base =
  'inline-flex items-center justify-center rounded-full border border-black/20 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300'

const variants: Record<string, string> = {
  primary: 'bg-black text-white border-black hover:bg-white hover:text-black',
  accent: 'bg-[#c59d5f] text-[#141412] border-[#c59d5f] hover:bg-[#b48d4f] hover:text-[#141412]',
  outline: 'bg-transparent text-black hover:bg-black hover:text-white',
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
  ({ variant = 'primary', as = 'button', className = '', href, children, onClick }, ref) => {
    const classNameFull = [base, variants[variant], className].filter(Boolean).join(' ')
    if (as === 'a') {
      return (
        <a
          ref={ref as unknown as Ref<HTMLAnchorElement>}
          className={classNameFull}
          href={href}
          onClick={onClick}
        >
          {children}
        </a>
      )
    }
    return (
      <button
        ref={ref as unknown as Ref<HTMLButtonElement>}
        className={classNameFull}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
