import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { BuildingNext } from "@/components/building-next";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home(): React.ReactElement {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <BuildingNext />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
