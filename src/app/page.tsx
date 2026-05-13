import { TopBar } from "@/components/top-bar";
import { ConfigHero } from "@/components/config-hero";
import { SidebarNav } from "@/components/sidebar-nav";
import { Projects } from "@/components/projects";
import { ExperienceAndWriting } from "@/components/experience-writing";
import { Footer } from "@/components/footer";
import { TerminalBoot } from "@/components/terminal-boot";
import { AgentBar } from "@/components/agent-bar";
import { SkillsModal } from "@/components/skills-modal";
import { CursorGlow } from "@/components/cursor-glow";
import { BootParticles } from "@/components/boot-particles";
import { AgentRevealParticles } from "@/components/agent-reveal-particles";
import { HomeHashScroll } from "@/components/home-hash-scroll";

export default function Home(): React.ReactElement {
  return (
    <main id="main-content">
      <HomeHashScroll />
      <TerminalBoot />
      <TopBar />
      <SidebarNav />
      <CursorGlow />
      <div className="relative z-10">
        <ConfigHero />
        <Projects />
        <ExperienceAndWriting />
        <Footer />
      </div>
      <AgentBar />
      <BootParticles />
      <AgentRevealParticles />
      <SkillsModal />
    </main>
  );
}
