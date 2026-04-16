import type { Metadata } from "next";
import { ChatCV } from "./chat";

export const metadata: Metadata = {
  title: "Chat · Ahtesham Ahmad",
  description:
    "Ask me anything about my work, rates, availability, or technical approach.",
};

export default function ChatPage(): React.ReactElement {
  return <ChatCV />;
}
