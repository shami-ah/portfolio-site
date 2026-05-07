import type { Metadata } from "next";
import { Suspense } from "react";
import { VisualCV } from "./visual-cv";

export const metadata: Metadata = {
  title: "CV · Ahtesham Ahmad | AI Engineer",
  description: "Visual CV of Ahtesham Ahmad — AI Engineer with 250+ projects delivered, production SaaS, and open-source AI developer tools.",
};

export default function CVPage(): React.ReactElement {
  return (
    <Suspense>
      <VisualCV />
    </Suspense>
  );
}
