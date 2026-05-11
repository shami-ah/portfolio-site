import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ChatWidget } from "@/components/chat-widget";
import { CVDrawer } from "@/components/cv-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  metadataBase: new URL("https://ahtesham.dev.wadwarehouse.com"),
  title: {
    default: "Ahtesham Ahmad | AI Engineer",
    template: "%s | Ahtesham Ahmad",
  },
  description:
    "AI engineer building production AI systems end-to-end. 50+ production systems, AI-powered SaaS with 100+ clients, and open-source developer tools.",
  keywords: [
    "Ahtesham Ahmad",
    "AI Engineer",
    "AI Automation",
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
    title: "Ahtesham Ahmad | AI Engineer",
    description:
      "AI engineer building production AI systems end-to-end. 50+ production systems, AI-powered SaaS with 100+ clients, and open-source developer tools.",
    type: "website",
    url: "https://ahtesham.dev.wadwarehouse.com",
    siteName: "Ahtesham Ahmad Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ahtesham Ahmad | AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahtesham Ahmad | AI Engineer",
    description:
      "I turn business workflows into AI-powered products. 50+ production systems, production SaaS, open-source developer tools.",
    images: ["/og.png"],
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
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||((document.cookie.match(/(?:^|;)\\s*theme=([^;]*)/)||[])[1]);if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ahtesham Ahmad",
              url: "https://ahtesham.dev.wadwarehouse.com",
              image: "https://ahtesham.dev.wadwarehouse.com/ahtesham.jpg",
              jobTitle: "AI Engineer",
              description:
                "AI engineer building production AI systems end-to-end. 50+ production systems, AI-powered SaaS with 100+ clients, and open-source developer tools.",
              sameAs: [
                "https://github.com/shami-ah",
                "https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5",
                "https://www.upwork.com/freelancers/~01bd0ab6e093ea2d49",
              ],
              knowsAbout: [
                "Artificial Intelligence",
                "Large Language Models",
                "Multi-Agent Systems",
                "TypeScript",
                "React",
                "Full Stack Development",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <div className="fixed bottom-5 left-5 z-50 print:hidden">
          <ThemeToggle />
        </div>
        <CVDrawer />
        <ChatWidget />
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.hostname==='ahtesham.dev.wadwarehouse.com'){fetch('https://shami-command-center.vercel.app/api/server/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:location.pathname,referrer:document.referrer})}).catch(function(){});}`,
          }}
        />
      </body>
    </html>
  );
}
