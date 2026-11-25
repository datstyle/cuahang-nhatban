import { useContext } from "react";
import { ToastContext } from "../context/toastContext";

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải dùng bên trong ToastProvider");
  return ctx;
}