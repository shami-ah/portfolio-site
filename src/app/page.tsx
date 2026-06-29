import { TopBar } from "@/components/top-bar";
import { TerminalBoot } from "@/components/terminal-boot";
import { AgentBar } from "@/components/agent-bar";
import { BootParticles } from "@/components/boot-particles";
import { AgentRevealParticles } from "@/components/agent-reveal-particles";
import { WelcomeBack } from "@/components/welcome-back";
import { PortfolioStage } from "@/components/portfolio-stage";
import { ChatWidget } from "@/components/chat-widget";
import { CVDrawer } from "@/components/cv-drawer";
import { SkillsModal } from "@/components/skills-modal";

export default function Home(): React.ReactElement {
  return (
    <main id="main-content">
      <WelcomeBack />
      <TerminalBoot />
      <TopBar />
      <PortfolioStage />
      <AgentBar />
      <BootParticles />
      <AgentRevealParticles />
      <ChatWidget />
      <CVDrawer />
      <SkillsModal />
    </main>
  );
}
