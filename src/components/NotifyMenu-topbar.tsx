import { useCallback, useRef, useState } from "react";
import useClickOutside from "../components/useClickOutside-topbar";
import TopBarButton from "./TopBarButton";
import { NOTIFY_TABS, notifications } from "../types/notifications-Topbar";
import type { NotifyTab } from "../types/notifications-Topbar";

export default function NotifyMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotifyTab>("all");

  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(wrapRef, close);

  const shown = notifications.filter((item) => {
    return tab === "all" || item.tab === tab;
  });

  return (
    <div className="notify-wrap" ref={wrapRef}>
      <TopBarButton
        icon="bi-bell"
        label="Thông báo"
        className={open ? "active" : ""}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="notify-popup">
          <div className="notify-head">
            <h5>Thông báo</h5>

            <div className="notify-actions">
              <button type="button" title="Đánh dấu đã đọc">
                <i className="bi bi-eye" />
              </button>

              <button type="button" title="Đóng" onClick={close}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          <div className="notify-tabs">
            {NOTIFY_TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={tab === item.key ? "on" : ""}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="notify-body">
            {shown.length === 0 ? (
              <div className="notify-empty">
                <i className="bi bi-inbox" />
                <span>Trống</span>
              </div>
            ) : (
              shown.map((item) => (
                <div key={item.id} className="notify-item">
                  {item.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}