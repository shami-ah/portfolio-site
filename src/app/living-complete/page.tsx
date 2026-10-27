import type { Metadata } from "next";
import { LivingCompleteMock } from "@/components/living-complete-mock";

export const metadata: Metadata = {
  title: "Complete Living Portfolio Mock",
  description: "Faithful complete mock for the agent-directed living portfolio architecture.",
};

export default function LivingCompletePage(): React.ReactElement {
  return <LivingCompleteMock />;
}
