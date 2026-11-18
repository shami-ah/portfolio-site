"use client";

import { Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Intro to the work. The face + numbers that used to live here are   */
/*  now the profile card at the end of the spotlight hero.             */
/* ------------------------------------------------------------------ */

export function ProofBand(): React.ReactElement {
  return (
    <div className="px-5 md:px-10 lg:px-28 pt-10 pb-16 md:pt-16 md:pb-24">
      <Reveal className="max-w-[1200px] mx-auto text-center">
        <Eyebrow className="mb-3">The work</Eyebrow>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-[28ch] mx-auto text-balance">
          Four products.
          <span className="block text-gradient">Each one fixed a real problem.</span>
        </h2>
      </Reveal>
    </div>
  );
}
