export type NotifyTab = "all" | "order";

export interface NotificationItem {
  id: number;
  text: string;
  tab: NotifyTab;
}

interface NotificationTab {
  key: NotifyTab;
  label: string;
}

export const NOTIFY_TABS: NotificationTab[] = [
  { key: "all", label: "Tất cả" },
  { key: "order", label: "Đơn hàng" },
];

export const notifications: NotificationItem[] = [];