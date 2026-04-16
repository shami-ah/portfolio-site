import type { Metadata } from "next";
import { Journey } from "./journey";

export const metadata: Metadata = {
  title: "Journey · Ahtesham Ahmad",
  description:
    "An immersive walk through 5 years of shipping production AI. Career milestones, a day in the life, and the tools that matter.",
};

export default function JourneyPage(): React.ReactElement {
  return <Journey />;
}
