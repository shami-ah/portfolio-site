import type { Metadata } from "next";
import { Workspace } from "./workspace";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Interactive agent workspace — terminal, neural map, live status.",
};

export default function WorkspacePage(): React.ReactElement {
  return <Workspace />;
}
