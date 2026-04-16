import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { Story } from "./story";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return projects.filter((p) => p.featured).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<{ title: string; description: string }> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not Found", description: "" };
  return {
    title: `${project.title} · story mode · Ahtesham Ahmad`,
    description: project.impact,
  };
}

export default async function StoryPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.featured) notFound();
  return <Story project={project} />;
}
