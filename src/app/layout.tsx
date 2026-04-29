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
  metadataBase: new URL("https://ahtesham.dev.wadwarehouse.com"),
  title: {
    default: "Ahtesham Ahmad | AI Automation Architect",
    template: "%s | Ahtesham Ahmad",
  },
  description:
    "I build AI systems that run businesses on their own, while humans stay in control. Full-stack AI engineer with 250+ delivered projects, production SaaS, and open-source developer tools.",
  keywords: [
    "Ahtesham Ahmad",
    "AI Engineer",
    "AI Automation Architect",
    "LLM",
    "Multi-Agent Systems",
    "Full Stack Developer",
    "TypeScript",
    "React",
    "Supabase",
    "CodeLens",
    "Gogaa CLI",
    "OpenEvent",
    "Claude Code",
    "AI Code Review",
  ],
  authors: [{ name: "Ahtesham Ahmad", url: "https://ahtesham.dev.wadwarehouse.com" }],
  creator: "Ahtesham Ahmad",
  openGraph: {
    title: "Ahtesham Ahmad | AI Automation Architect",
    description:
      "I build AI systems that run businesses on their own, while humans stay in control. 250+ projects, production SaaS, open-source tools.",
    type: "website",
    url: "https://ahtesham.dev.wadwarehouse.com",
    siteName: "Ahtesham Ahmad Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/ahtesham.jpg",
        width: 600,
        height: 600,
        alt: "Ahtesham Ahmad — AI Automation Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahtesham Ahmad | AI Automation Architect",
    description:
      "I build AI systems that run businesses on their own. 250+ projects, production SaaS, open-source tools.",
    images: ["/ahtesham.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://ahtesham.dev.wadwarehouse.com",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `fetch('https://shami-command-center.vercel.app/api/server/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:location.pathname,referrer:document.referrer})}).catch(function(){});`,
          }}
        />
      </body>
    </html>
  );
}
