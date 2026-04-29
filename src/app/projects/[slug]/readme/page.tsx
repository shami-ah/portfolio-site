import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ReadmeView } from "./readme-view";

interface Props {
  params: Promise<{ slug: string }>;
}

const GITEA_BASE = "https://ahtesham.dev.wadwarehouse.com/git";

export function generateStaticParams(): { slug: string }[] {
  return projects.filter((p) => p.giteaRepo).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<{ title: string; description: string }> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.giteaRepo) return { title: "Not Found", description: "" };
  return {
    title: `${project.title} — Repository | Ahtesham Ahmad`,
    description: `About ${project.title}: ${project.subtitle}`,
  };
}

async function fetchReadme(giteaRepo: string): Promise<string> {
  const url = `${GITEA_BASE}/api/v1/repos/${giteaRepo}/raw/README.md`;
  const token = process.env.GITEA_TOKEN;
  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `token ${token}`;
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return "";
    return res.text();
  } catch {
    return "";
  }
}

export default async function ReadmePage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.giteaRepo) notFound();

  const readme = await fetchReadme(project.giteaRepo);

  return <ReadmeView project={project} readme={readme} />;
}
