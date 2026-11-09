import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { SectionNav } from '@/components/SectionNav'
import { ProjectsSection } from '@/components/ProjectsSection'
import { InteractiveSandbox } from '@/components/InteractiveSandbox'
import { SkillsSection } from '@/components/SkillsSection'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

export function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#07080b] text-slate-200 overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200">
        {/* Subtle decorative grain */}
        <div className="pointer-events-none fixed inset-0 z-30 grain-overlay" aria-hidden="true" />

        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Flow */}
        <main>
          <Hero />
          <SectionNav />
          <ProjectsSection />
          <InteractiveSandbox />
          <SkillsSection />
          <AboutSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  )
}

export default App
