import type { Metadata } from "next";
import { WritingPage } from "./writing-page";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Field notes from shipping OpenEvent, CodeLens, Gogaa, and production software people actually use.",
};

export default function Page(): React.ReactElement {
  return <WritingPage />;
}
