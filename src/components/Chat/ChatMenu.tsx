import { useCallback, useRef, useState } from "react";
import useClickOutside from "../menu/useClickOutside";
import TopBarButton from "../menu/TopBarButton";
import { initialConversations } from "../../types/chats";
import type { Conversation } from "../../types/chats";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef, closeMenu);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId,
  );
  const totalUnread = conversations.reduce(
    (total, conversation) => total + conversation.unread,
    0,
  );

  const handleSelect = (id: number) => {
    setActiveId(id);
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  };

  const handleSend = (text: string) => {
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                { id: Date.now(), from: "me", text, time },
              ],
            }
          : conversation,
      ),
    );
  };

  return (
    <div ref={wrapperRef}>
      <TopBarButton
        icon="bi-send"
        label="Trò chuyện"
        className={isOpen ? "active" : ""}
        onClick={() => setIsOpen((open) => !open)}
      />

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-head">
            <h5>
              Chat {totalUnread > 0 && <small>({totalUnread})</small>}
            </h5>
            <button type="button" title="Đóng" data-sound-hover="true" data-sound-click="true" onClick={closeMenu}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="chat-body">
            <ChatList
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelect}
            />
            {activeConversation && (
              <ChatWindow
                key={activeConversation.id}
                conversation={activeConversation}
                onSend={handleSend}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
