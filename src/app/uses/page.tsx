import type { Metadata } from "next";
import { Uses } from "./uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The workbench, stack, workflow, and context discipline behind OpenEvent, CodeLens, Gogaa, and 50+ shipped systems.",
};

export default function UsesPage(): React.ReactElement {
  return <Uses />;
}
