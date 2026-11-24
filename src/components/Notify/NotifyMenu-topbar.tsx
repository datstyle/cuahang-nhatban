import { useCallback, useEffect, useRef, useState } from "react";
import useClickOutside from "../useClickOutside-topbar";
import TopBarButton from "../TopBarButton";
import { NOTIFY_TABS, notifications } from "../../types/notifications";
import type { NotifyTab } from "../../types/notifications";

const TOAST_DURATION = 2000;

export default function NotifyMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotifyTab>("all");
  const [showRead, setShowRead] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setShowRead(false);
  }, []);
  useClickOutside(wrapRef, close);
  
  useEffect(() => {
    if (!showRead) return;
    const timer = setTimeout(() => setShowRead(false), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [showRead]);

  const shown = notifications.filter((n) => tab === "all" || n.tab === tab);

  return (
    <div className="notify-wrap" ref={wrapRef}>
      <TopBarButton
        icon="bi-bell"
        label="Thông báo"
        className={open ? "active" : ""}
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <div className="notify-popup">
          <div className="notify-head">
            <h5>Thông báo</h5>
            <div className="notify-actions">
              <button
                type="button"
                title="Đánh dấu đã đọc"
                onClick={() => setShowRead(true)}
              >
                <i className={`bi ${showRead ? "bi-check2-all" : "bi-eye"}`} />
              </button>
              <button type="button" title="Đóng" onClick={close}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          <div className="notify-tabs">
            {NOTIFY_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={tab === t.key ? "on" : ""}
                onClick={() => setTab(t.key)}
              >
                {t.label}
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
              shown.map((n) => (
                <div key={n.id} className="notify-item">
                  {n.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}