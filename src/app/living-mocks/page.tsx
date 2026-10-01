import type { Metadata } from "next";
import { LivingPortfolioMock } from "@/components/living-portfolio-mock";

export const metadata: Metadata = {
  title: "Living Portfolio Mock",
  description: "Interactive prototype for an agent-directed portfolio experience.",
};

export default function LivingMocksPage(): React.ReactElement {
  return <LivingPortfolioMock />;
}
