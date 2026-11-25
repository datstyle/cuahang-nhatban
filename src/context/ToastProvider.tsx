import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./toastContext";
import "../css/Toast.css";

const DURATION = 3000; // ms

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | undefined>(undefined);

  const hide = useCallback(() => setMessage(""), []);

  const showToast = useCallback(
    (text: string) => {
      window.clearTimeout(timerRef.current);
      setMessage(text);
      timerRef.current = window.setTimeout(hide, DURATION);
    },
    [hide]
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="toast-box alert alert-success" role="status">
          <span>{message}</span>
          <button type="button" className="btn-close" aria-label="Đóng" onClick={hide} />
        </div>
      )}
    </ToastContext.Provider>
  );
}