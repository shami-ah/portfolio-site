import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
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
import { EasterEggs } from "@/components/easter-eggs";
import { DiscoveryToast } from "@/components/discovery-toast";

export default function Home(): React.ReactElement {
  return (
    <main>
      <TerminalBoot />
      <ScrollProgress />
      <HueShift />
      <EasterEggs />
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
        <Contact />
      </div>
      <Footer />
      <CommandPalette />
      <DiscoveryToast />
    </main>
  );
}
