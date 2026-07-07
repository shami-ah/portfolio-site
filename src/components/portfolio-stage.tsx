"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { type Room, roomOrder, CurtainPullAgent, NextRoomPreview } from "@/components/curtain-pull-agent";
import { RoomShell } from "@/components/room-shell";
import { Atmosphere } from "@/components/atmosphere";
import { SignalRail } from "@/components/signal-rail";
import { FloatingAgent } from "@/components/floating-agent";
import { HomeRoom } from "@/components/rooms/home-room";
import { ProjectsRoom, type FlagshipSlug, type GestureState, flagshipSlugs } from "@/components/rooms/projects-room";
import { ExperienceRoom } from "@/components/rooms/experience-room";
import { SkillsRoom } from "@/components/rooms/skills-room";
import { ContactRoom } from "@/components/rooms/contact-room";
import { ProjectModal } from "@/components/project-modal";
import { projects, type ProjectData } from "@/data/projects";
import { getFeaturedArticles } from "@/data/writing";

const roomVariantFactory = (transitionDir: 1 | -1) => ({
  initial: { opacity: 0, y: transitionDir * 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: transitionDir * -60 },
});

export function PortfolioStage(): React.ReactElement {
  const [room, setRoom] = useState<Room>("home");
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);
  const [activeFlagship, setActiveFlagship] = useState(0);
  const [gestureDone, setGestureDone] = useState<GestureState>({
    openevent: false,
    codelens: false,
    "gogaa-cli": false,
    rasad: false,
  });
  const [otherIndex, setOtherIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectData | null>(null);

  // URL param: ?room=projects or ?scene=projects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("scene") ?? params.get("room");
    if (next && (roomOrder as string[]).includes(next)) {
      setRoom(next as Room);
    }
  }, []);

  const goRoom = useCallback((next: Room): void => {
    const currentIdx = roomOrder.indexOf(room);
    const nextIdx = roomOrder.indexOf(next);
    setTransitionDir(nextIdx >= currentIdx ? 1 : -1);
    setRoom(next);
  }, [room]);

  // When room changes, nudge AgentBar's scroll-based hero detection.
  // AgentBar checks document.getElementById("hero").getBoundingClientRect()
  // on scroll events. In room mode there's no scrolling, so we dispatch
  // scroll after the AnimatePresence transition has mounted/unmounted the hero.
  useEffect(() => {
    const delays = [100, 300, 600, 1000];
    const timers = delays.map((ms) =>
      setTimeout(() => window.dispatchEvent(new Event("scroll")), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [room]);

  const goNext = useCallback((): void => {
    const currentIdx = roomOrder.indexOf(room);
    const next = roomOrder[currentIdx + 1];
    if (next) {
      setTransitionDir(1);
      setRoom(next);
    }
  }, [room]);

  const solve = useCallback((slug: FlagshipSlug): void => {
    setGestureDone(prev => ({ ...prev, [slug]: true }));
  }, []);

  const flagships = useMemo(
    () => flagshipSlugs.map(slug => projects.find(p => p.slug === slug)).filter(Boolean) as ProjectData[],
    [],
  );
  const otherProjects = useMemo(
    () => projects.filter(p => !flagshipSlugs.includes(p.slug as FlagshipSlug)),
    [],
  );
  const featuredArticles = useMemo(() => getFeaturedArticles(), []);
  const activeProject = flagships[activeFlagship] ?? flagships[0];
  const activeSlug = activeProject.slug as FlagshipSlug;

  const allProjects = useMemo(() => [...flagships, ...otherProjects], [flagships, otherProjects]);

  const navigateModal = useCallback((dir: 1 | -1): void => {
    setModalProject(current => {
      if (!current) return current;
      const index = allProjects.findIndex(p => p.slug === current.slug);
      if (index < 0) return current;
      return allProjects[(index + dir + allProjects.length) % allProjects.length] ?? null;
    });
  }, [allProjects]);

  const roomVariants = roomVariantFactory(transitionDir);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <Atmosphere room={room} projectSlug={activeSlug} />
      <SignalRail room={room} setRoom={goRoom} />
      <CurtainPullAgent
        room={room}
        onNext={goNext}
        nextRoomContent={<NextRoomPreview room={room} />}
      />

      <AnimatePresence mode="wait" custom={transitionDir}>
        {room === "home" && (
          <RoomShell key="home" variants={roomVariants}>
            <HomeRoom />
          </RoomShell>
        )}
        {room === "projects" && (
          <RoomShell key="projects" variants={roomVariants}>
            <ProjectsRoom
              flagships={flagships}
              activeIndex={activeFlagship}
              setActiveIndex={setActiveFlagship}
              solved={gestureDone}
              solve={solve}
              otherProjects={otherProjects}
              otherIndex={otherIndex}
              setOtherIndex={setOtherIndex}
              openProject={setModalProject}
            />
          </RoomShell>
        )}
        {room === "experience" && (
          <RoomShell key="experience" variants={roomVariants}>
            <ExperienceRoom articles={featuredArticles} />
          </RoomShell>
        )}
        {room === "toolbelt" && (
          <RoomShell key="toolbelt" variants={roomVariants}>
            <SkillsRoom />
          </RoomShell>
        )}
        {room === "contact" && (
          <RoomShell key="contact" variants={roomVariants}>
            <ContactRoom onGoTop={() => goRoom("home")} />
          </RoomShell>
        )}
      </AnimatePresence>

      <FloatingAgent room={room} />
      <ProjectModal
        project={modalProject}
        onClose={() => setModalProject(null)}
        onNavigate={navigateModal}
      />
    </div>
  );
}
