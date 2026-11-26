import { useState } from "react";
import type { Conversation } from "../../types/chats";

interface ChatListProps {
  conversations: Conversation[];
  activeId: number;
  onSelect: (id: number) => void;
}

export default function ChatList({
  conversations,
  activeId,
  onSelect,
}: ChatListProps) {
  const [keyword, setKeyword] = useState("");
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(normalizedKeyword),
  );

  return (
    <div className="chat-list">
      <div className="chat-search">
        <input
          type="text"
          placeholder="Tìm theo tên"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="chat-list-items">
        {filteredConversations.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1];

          return (
            <button
              key={conversation.id}
              type="button"
              className={`chat-conv sound-hover-card${conversation.id === activeId ? " on" : ""}`}
              data-sound-hover="true"
              data-sound-click="true"
              onClick={() => onSelect(conversation.id)}
            >
              <div className="chat-avatar">{conversation.name[0]}</div>
              <div className="chat-conv-info">
                <div className="chat-conv-top">
                  <span>{conversation.name}</span>
                  <small>{conversation.date}</small>
                </div>
                <div className="chat-conv-bottom">
                  <span className="chat-conv-last">{lastMessage?.text}</span>
                  {conversation.unread > 0 && (
                    <span className="chat-badge">{conversation.unread}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredConversations.length === 0 && (
          <p className="chat-none">Không tìm thấy</p>
        )}
      </div>
    </div>
  );
}
