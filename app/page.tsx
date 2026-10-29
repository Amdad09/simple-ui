import ScrollExperience from '@/components/animations/ScrollExperience'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProductSection } from '@/components/sections/ProductSection'
import { IngredientsSection } from '@/components/sections/IngredientsSection'
import { DetailsSection } from '@/components/sections/DetailsSection'
import { FinalCTASection } from '@/components/sections/FinalCTASection'
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  return (
    <ScrollExperience>
      <HeroSection />
      <ProductSection />
      <IngredientsSection />
      <DetailsSection />
      <FinalCTASection />
      <Footer />
    </ScrollExperience>
  )
}
