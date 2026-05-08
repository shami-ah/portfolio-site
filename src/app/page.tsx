import { TopBar } from "@/components/top-bar";
import { ConfigHero } from "@/components/config-hero";
import { SidebarNav } from "@/components/sidebar-nav";
import { MissionStats } from "@/components/mission-stats";
import { Projects } from "@/components/projects";
import { GitLog } from "@/components/git-log";
import { Writing } from "@/components/writing";
import { ConfigContact } from "@/components/config-contact";
import { Footer } from "@/components/footer";
import { TerminalBoot } from "@/components/terminal-boot";
import { AgentBar } from "@/components/agent-bar";
import { SkillsModal } from "@/components/skills-modal";
import { CursorGlow } from "@/components/cursor-glow";
import { SectionDivider } from "@/components/section-divider";

export default function Home(): React.ReactElement {
  return (
    <main id="main-content">
      <TerminalBoot />
      <TopBar />
      <SidebarNav />
      <CursorGlow />
      <div className="relative z-10">
        <ConfigHero />
        <SectionDivider />
        <MissionStats />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <GitLog />
        <SectionDivider />
        <Writing />
        <SectionDivider />
        <ConfigContact />
      </div>
      <Footer />
      <AgentBar />
      <SkillsModal />
    </main>
  );
}
