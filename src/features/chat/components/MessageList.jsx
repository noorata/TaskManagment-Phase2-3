import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, meNorm, formatTime }) {
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto pb-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.ts}
          msg={m}
          mine={m.from.trim().toLowerCase() === meNorm}
          formatTime={formatTime}
        />
      ))}
      <div ref={bottom} />
    </div>
  );
}
