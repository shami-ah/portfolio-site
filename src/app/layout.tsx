import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  title: "Ahtesham Ahmad | AI Automation Architect",
  description:
    "I architect AI systems that run businesses autonomously. Full-stack AI engineer with 250+ delivered projects, production SaaS, and open-source developer tools.",
  keywords: [
    "AI Engineer",
    "AI Automation",
    "LLM",
    "Multi-Agent Systems",
    "Full Stack",
    "TypeScript",
    "React",
    "Supabase",
  ],
  openGraph: {
    title: "Ahtesham Ahmad | AI Automation Architect",
    description:
      "I architect AI systems that run businesses autonomously. 250+ projects, production SaaS, open-source tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
