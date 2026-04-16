import type { Metadata } from "next";
import { BuildWithMe } from "./build";

export const metadata: Metadata = {
  title: "Build with me · Ahtesham Ahmad",
  description:
    "A 6-step walkthrough of how I actually ship a feature: architecture → spec → scaffold → code → review → deploy.",
};

export default function BuildPage(): React.ReactElement {
  return <BuildWithMe />;
}
