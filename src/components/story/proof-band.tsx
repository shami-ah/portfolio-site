"use client";

import { useStatus } from "@/lib/use-status";
import { CountUp, Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Who you'd be working with — a face, three numbers, then the work.  */
/*  Replaces the empty "scroll to explore" intro in the plain lens.    */
/* ------------------------------------------------------------------ */

export function ProofBand(): React.ReactElement {
  const { status } = useStatus();

  const numbers = [
    { value: `${status.portfolio.productionSystems}+`, label: "systems shipped to real users" },
    { value: `${status.openevent.clients}+`, label: "companies run on my flagship product" },
    { value: `${status.portfolio.yearsBuilding}+`, label: "years building software end to end" },
  ];

  return (
    <div className="px-5 md:px-10 lg:pl-28 lg:pr-16 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ahtesham.jpg"
            alt="Ahtesham Ahmad"
            loading="lazy"
            className="w-28 h-28 md:w-48 md:h-48 rounded-2xl object-cover border border-card-border shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow className="mb-3">Who you&apos;d be working with</Eyebrow>
            <p className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight max-w-3xl text-balance">
              One engineer who designs, builds and runs the whole product,
              <span className="text-foreground/50"> for clients in Germany, France, the UK and the US.</span>
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="mt-8 md:mt-10 grid grid-cols-3 gap-4 md:gap-10 max-w-3xl">
              {numbers.map((n) => (
                <div key={n.label}>
                  <dd className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl leading-none text-gradient">
                    <CountUp value={n.value} />
                  </dd>
                  <dt className="mt-2 text-xs md:text-base text-foreground/65 leading-snug">{n.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <Reveal className="max-w-[1200px] mx-auto mt-16 md:mt-28">
        <Eyebrow className="mb-3">The work</Eyebrow>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-[20ch] text-balance">
          Four products. Each one fixed a real problem.
        </h2>
      </Reveal>
    </div>
  );
}
