import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Conversation } from "../../types/chats";

interface ChatWindowProps {
  conversation: Conversation;
  onSend: (text: string) => void;
}

export default function ChatWindow({
  conversation,
  onSend,
}: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (messagesElement) {
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  }, [conversation.messages.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message) return;

    onSend(message);
    setDraft("");
  };

  return (
    <div className="chat-window">
      <div className="chat-window-head">{conversation.name}</div>

      <div className="chat-messages" ref={messagesRef}>
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-msg${message.from === "me" ? " me" : ""}`}
          >
            {message.text}
            <small>{message.time}</small>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập nội dung tin nhắn"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" disabled={!draft.trim()} title="Gửi" data-sound-hover="true" data-sound-click="true">
          <i className="bi bi-send-fill" />
        </button>
      </form>
    </div>
  );
}
