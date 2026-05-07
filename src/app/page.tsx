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
import { CommandPalette } from "@/components/command-palette";
import { AgentBar } from "@/components/agent-bar";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { SkillsModal } from "@/components/skills-modal";

export default function Home(): React.ReactElement {
  return (
    <main>
      <TerminalBoot />
      <TopBar />
      <SidebarNav />
      <div className="relative z-10">
        <ConfigHero />
        <MissionStats />
        <Projects />
        <GitLog />
        <Writing />
        <ConfigContact />
      </div>
      <Footer />
      <CommandPalette />
      <AgentBar />
      <ShortcutsOverlay />
      <SkillsModal />
    </main>
  );
}
