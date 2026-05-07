import type { Metadata } from "next";
import { Uses } from "./uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, stack, workflow, and philosophy behind 250+ shipped projects. A self-reinforcing AI development ecosystem.",
};

export default function UsesPage(): React.ReactElement {
  return <Uses />;
}
