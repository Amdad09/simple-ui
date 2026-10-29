'use client'

const LINKS = ['The Bottle', 'Ingredients', 'Details']

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#fbf9f2] py-12 px-6">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1320px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-xs font-bold tracking-[0.25em] uppercase text-[#6b6b63]">
            {LINKS.map((name) => (
              <a
                key={name}
                href={`#${name.toLowerCase()}`}
                className="hover:text-black transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#6b6b63]">
            © 2026 Aurelia. All rights reserved.
          </p>
          <a
            href="mailto:hello@aurelia.studio"
            className="text-xs font-bold tracking-[0.25em] uppercase text-[#6b6b63] hover:text-black transition-colors"
          >
            hello@aurelia.studio
          </a>
        </div>
      </div>
    </footer>
  )
}
