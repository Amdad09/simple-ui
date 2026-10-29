'use client'

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10 lg:py-6">
        <a href="#" className="text-xs font-bold tracking-[0.25em] uppercase text-black">
          AURELIA
        </a>
        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#product"
            className="text-xs font-semibold tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors"
          >
            The Bottle
          </a>
          <a
            href="#ingredients"
            className="text-xs font-semibold tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors"
          >
            Ingredients
          </a>
          <a
            href="#details"
            className="text-xs font-semibold tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors"
          >
            Details
          </a>
        </div>
        <a
          href="#final"
          className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black transition-colors hover:bg-black hover:text-white lg:px-7 lg:py-2.5 lg:text-xs"
        >
          Order
        </a>
      </div>
    </nav>
  )
}
