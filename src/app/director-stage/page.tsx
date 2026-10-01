import type { Metadata } from "next";
import { DirectorStageMock } from "@/components/director-stage-mock";

export const metadata: Metadata = {
  title: "Director Stage Mock",
  description: "Action-first fixed-stage mock for the agent-directed portfolio.",
};

export default function DirectorStagePage(): React.ReactElement {
  return <DirectorStageMock />;
}
