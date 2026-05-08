"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirect(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
    // Open the chat widget after redirect
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
    }, 500);
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted/40">Redirecting...</p>
    </div>
  );
}
