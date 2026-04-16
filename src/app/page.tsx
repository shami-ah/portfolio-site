import { TopBar } from "@/components/top-bar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { TerminalBoot } from "@/components/terminal-boot";
import { CommandPalette } from "@/components/command-palette";
import { AgentBar } from "@/components/agent-bar";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { Cursor } from "@/components/cursor";
import { CursorPresence } from "@/components/cursor-presence";

export default function Home(): React.ReactElement {
  return (
    <main>
      <TerminalBoot />
      <TopBar />
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Experience />
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
