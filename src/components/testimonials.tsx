"use client";

import { FadeUp } from "./motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  platform?: "upwork" | "linkedin" | "direct";
}

const testimonials: Testimonial[] = [
  {
    quote: "Ahtesham was extremely helpful, great developer and communication skills. Will hire again.",
    name: "River Soellner",
    role: "Founder, More Life Hospitality GmbH",
    company: "Upwork client, then offered full-time",
    platform: "upwork",
  },
  {
    quote: "A serious and helpful guy. If you're looking for a technical and competent engineer and project manager who knows how to deal with specific and in-depth topics to monitor your teams and your projects, he's well-placed to do it.",
    name: "Mouad B.",
    role: "Project Manager",
    company: "France",
    platform: "direct",
  },
  {
    quote: "I had a great experience working with Ahtesham on the creation of a Basic META AI Course. They were highly professional, delivered high-quality content, and adhered to the project timeline.",
    name: "Upwork Client",
    role: "Course Director",
    company: "META AI Workshop",
    platform: "upwork",
  },
];

const platformLabel: Record<string, string> = {
  upwork: "via Upwork",
  linkedin: "via LinkedIn",
  direct: "",
};

const avatarPalette: { bg: string; ring: string; text: string }[] = [
  { bg: "bg-gradient-to-br from-accent/80 to-blue-500/80", ring: "ring-accent/30", text: "text-white" },
  { bg: "bg-gradient-to-br from-emerald-400/80 to-emerald-600/80", ring: "ring-emerald-500/30", text: "text-white" },
  { bg: "bg-gradient-to-br from-amber-400/80 to-orange-500/80", ring: "ring-amber-500/30", text: "text-white" },
  { bg: "bg-gradient-to-br from-purple-400/80 to-pink-500/80", ring: "ring-purple-500/30", text: "text-white" },
];

function Avatar({ name, index }: { name: string; index: number }): React.ReactElement {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const palette = avatarPalette[index % avatarPalette.length];
  return (
    <div
      className={`shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full ${palette.bg} ${palette.text} ring-2 ${palette.ring} flex items-center justify-center text-xs md:text-sm font-bold tracking-tight`}
    >
      {initials}
    </div>
  );
}

export function Testimonials(): React.ReactElement | null {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            What clients say
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-16 leading-tight">
            In their own words.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.08}>
              <div className="h-full p-5 md:p-6 rounded-xl bg-card border border-card-border hover:border-muted/30 transition-all duration-300 flex flex-col">
                <p className="text-3xl text-accent/30 font-serif leading-none mb-2 md:mb-3 select-none">
                  &ldquo;
                </p>
                <p className="text-xs md:text-sm text-muted leading-relaxed flex-1 mb-4 md:mb-6">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-3 md:pt-4 border-t border-card-border">
                  <Avatar name={t.name} index={i} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-semibold truncate">{t.name}</p>
                    <p className="text-[11px] md:text-xs text-muted truncate">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                  {t.platform && t.platform !== "direct" && (
                    <span className="shrink-0 text-[10px] font-mono text-muted/50 border border-card-border rounded px-2 py-0.5">
                      {platformLabel[t.platform]}
                    </span>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
