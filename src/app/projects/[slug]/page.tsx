import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectDetail } from "./project-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<{ title: string; description: string }> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not Found", description: "" };
  return {
    title: `${project.title} | Ahtesham Ahmad`,
    description: project.impact,
  };
}

export default async function ProjectPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
