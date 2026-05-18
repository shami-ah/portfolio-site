import type { Metadata } from "next";
import { Journey } from "./journey";

export const metadata: Metadata = {
  title: "Journey · Ahtesham Ahmad",
  description:
    "The operating principles behind Ahtesham Ahmad's AI engineering work: human gates, architecture-first delivery, tooling, and production rollout discipline.",
};

export default function JourneyPage(): React.ReactElement {
  return <Journey />;
}
