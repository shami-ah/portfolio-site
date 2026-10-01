import type { Metadata } from "next";
import { LivingHomeStoryboard } from "@/components/living-home-storyboard";

export const metadata: Metadata = {
  title: "Living Home Storyboard",
  description: "Faithful interactive mock of the portfolio homepage as an agent-guided living stage.",
};

export default function LivingHomePage(): React.ReactElement {
  return <LivingHomeStoryboard />;
}
