import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { FlowingBackground } from '@/components/FlowingBackground'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { RightNavDock } from '@/components/RightNavDock'
import { ProjectsSection } from '@/components/ProjectsSection'
import { InteractiveSandbox } from '@/components/InteractiveSandbox'
import { SkillsSection } from '@/components/SkillsSection'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { MascotCompanion } from '@/components/MascotCompanion'
import { MascotProvider } from '@/context/MascotContext'
import { ThemeProvider } from '@/context/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <MascotProvider>
        <SmoothScroll>
          <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-x-hidden selection:bg-cyan-500/25 selection:text-cyan-800 dark:selection:text-cyan-200">
            {/* Continuously Flowing Chromatic Fluid Background */}
            <FlowingBackground />

            {/* Subtle decorative grain texture */}
            <div className="pointer-events-none fixed inset-0 z-30 grain-overlay" aria-hidden="true" />

            {/* Top Architectural Navbar Plate with Theme & SFX Controls */}
            <Navbar />

            {/* Right Border Vertical Navigation Dock */}
            <RightNavDock />

            {/* Main Content Flow */}
            <main className="relative z-10">
              <Hero />
              <ProjectsSection />
              <InteractiveSandbox />
              <SkillsSection />
              <AboutSection />
              <ContactSection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Persistent Floating 3D Lego Mascot Companion */}
            <MascotCompanion />
          </div>
        </SmoothScroll>
      </MascotProvider>
    </ThemeProvider>
  )
}

export default App
