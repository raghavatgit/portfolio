import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { FlowingBackground } from '@/components/FlowingBackground'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { RightNavDock } from '@/components/RightNavDock'
import { WorkIndex } from '@/components/WorkIndex'
import { SystemsLab } from '@/components/SystemsLab'
import { SkillGraph } from '@/components/SkillGraph'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { MascotCompanion } from '@/components/MascotCompanion'
import { CursorFx } from '@/components/CursorFx'
import { CommandPalette } from '@/components/CommandPalette'
import { MascotProvider } from '@/context/MascotContext'
import { ThemeProvider } from '@/context/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <MascotProvider>
        <SmoothScroll>
          <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 selection:bg-cyan-500/25">
            <FlowingBackground />
            <div className="pointer-events-none fixed inset-0 z-30 grain-overlay" aria-hidden="true" />

            <CursorFx />
            <CommandPalette />
            <Navbar />
            <RightNavDock />

            <main className="relative z-10">
              <Hero />
              <WorkIndex />
              <SystemsLab />
              <SkillGraph />
              <AboutSection />
              <ContactSection />
            </main>

            <Footer />
            <MascotCompanion />
          </div>
        </SmoothScroll>
      </MascotProvider>
    </ThemeProvider>
  )
}

export default App
