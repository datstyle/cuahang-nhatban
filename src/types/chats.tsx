export interface ChatMessage {
  id: number;
  from: "me" | "shop";
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  date: string;
  unread: number;
  messages: ChatMessage[];
}

export const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Japan Shop Official",
    date: "08/10",
    unread: 0,
    messages: [
      { id: 1, from: "shop", text: "Japan Shop xin chào bạn! Cảm ơn bạn đã quan tâm đến sản phẩm của shop.", time: "09:18" },
      { id: 2, from: "me", text: "Shop ơi, matcha còn hàng không?", time: "09:20" },
    ],
  },
  {
    id: 2,
    name: "Tokyo Snacks",
    date: "27/06",
    unread: 1,
    messages: [
      { id: 1, from: "shop", text: "Đơn Kit Kat của bạn đã được gửi đi rồi nhé!", time: "14:05" },
    ],
  },
  {
    id: 3,
    name: "Kyoto Matcha Store",
    date: "23/06",
    unread: 1,
    messages: [
      { id: 1, from: "shop", text: "Cảm ơn bạn đã mua hàng, hẹn gặp lại!", time: "10:30" },
    ],
  },
];