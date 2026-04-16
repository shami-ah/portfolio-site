import { TopBar } from "@/components/top-bar";
import { Hero } from "@/components/hero";
import { ContextSwitcher } from "@/components/context-switcher";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { BeforeAfter } from "@/components/before-after";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BuildingNext } from "@/components/building-next";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { TerminalBoot } from "@/components/terminal-boot";
import { CommandPalette } from "@/components/command-palette";
import { ScrollProgress } from "@/components/scroll-progress";
import { HueShift } from "@/components/hue-shift";
import { AgentBar } from "@/components/agent-bar";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { Cursor } from "@/components/cursor";
import { CursorPresence } from "@/components/cursor-presence";

export default function Home(): React.ReactElement {
  return (
    <main>
      <TerminalBoot />
      <ScrollProgress />
      <HueShift />
      <TopBar />
      <div className="relative z-10">
        <Hero />
        <ContextSwitcher />
        <About />
        <Experience />
        <BeforeAfter />
        <Projects />
        <Skills />
        <BuildingNext />
        <Testimonials />
        <Contact />
      </div>
      <Footer />
      <CommandPalette />
      <AgentBar />
      <ShortcutsOverlay />
      <CursorPresence />
      <Cursor />
    </main>
  );
}
