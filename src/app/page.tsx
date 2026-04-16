import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { BeforeAfter } from "@/components/before-after";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BuildingNext } from "@/components/building-next";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { TerminalBoot } from "@/components/terminal-boot";
import { CommandPalette } from "@/components/command-palette";
import { ScrollProgress } from "@/components/scroll-progress";
import { HueShift } from "@/components/hue-shift";
import { AgentBar } from "@/components/agent-bar";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";

export default function Home(): React.ReactElement {
  return (
    <main>
      <TerminalBoot />
      <ScrollProgress />
      <HueShift />
      <Nav />
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <BeforeAfter />
        <Projects />
        <Skills />
        <BuildingNext />
        <Testimonials />
        <FAQ />
        <Contact />
      </div>
      <Footer />
      <CommandPalette />
      <AgentBar />
      <ShortcutsOverlay />
    </main>
  );
}
