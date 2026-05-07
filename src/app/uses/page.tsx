import type { Metadata } from "next";
import { Uses } from "./uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, stack, workflow, and philosophy behind 50+ production systems. A self-reinforcing AI development ecosystem.",
};

export default function UsesPage(): React.ReactElement {
  return <Uses />;
}
