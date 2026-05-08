import type { Metadata } from "next";
import { WritingPage } from "./writing-page";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Lessons from building AI systems, developer tools, and production software. Not theory. Things I learned by shipping.",
};

export default function Page(): React.ReactElement {
  return <WritingPage />;
}
