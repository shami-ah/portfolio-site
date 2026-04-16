import type { Metadata } from "next";
import { Suspense } from "react";
import { VisualCV } from "./visual-cv";

export const metadata: Metadata = {
  title: "CV · Ahtesham Ahmad | AI Automation Architect",
  description: "Visual CV of Ahtesham Ahmad, AI Automation Architect with 5+ years experience, 250+ projects, open-source tools.",
};

export default function CVPage(): React.ReactElement {
  return (
    <Suspense>
      <VisualCV />
    </Suspense>
  );
}
