import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "../../css/login.css";

interface AuthLayoutProps {
  mode: "login" | "register";
  children: ReactNode;
}

export default function AuthLayout({
  mode,
  children,
}: AuthLayoutProps) {
  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <section className="auth-form-side">
          <div className="auth-tabs">
            <Link to="/login" className={isLogin ? "on" : ""}>
              Đăng nhập
            </Link>

            <Link to="/register" className={!isLogin ? "on" : ""}>
              Đăng ký
            </Link>
          </div>

          {children}

          <p className="auth-switch">
            {isLogin
              ? "Bạn chưa có tài khoản?"
              : "Bạn đã có tài khoản?"}

            <Link to={isLogin ? "/register" : "/login"}>
              {isLogin ? "Đăng ký" : "Đăng nhập"}
            </Link>
          </p>

          <Link to="/" className="auth-back">
            <i className="bi bi-arrow-left"></i>
            Về trang chủ
          </Link>
        </section>
      </div>
    </div>
  );
}
