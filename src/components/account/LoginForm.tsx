import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import useAuth from "../../types/useAuth";
import useToast from "../../types/useToast";
import PasswordInput from "./PasswordInput";
import { authService } from "../../services/authService";

export default function LoginForm() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = Boolean(email.trim() && password);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const account = authService.login(email.trim(), password);

    if (!account) {
      setError("Email hoặc mật khẩu không chính xác.");
      return;
    }

    login(account, remember);
    showToast("Đăng nhập thành công!");
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      setError("Không thể đăng nhập bằng Google.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        }
      );

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const data = await response.json();

      login(data.account, remember);
      showToast("Đăng nhập Google thành công!");
    } catch {
      setError("Không thể đăng nhập Google. Bạn thử lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="auth-input"
        placeholder="Email (*)"
        aria-label="Email"
        autoComplete="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
        }}
      />

      <PasswordInput
        id="login-password"
        placeholder="Mật khẩu (*)"
        value={password}
        onChange={(value) => {
          setPassword(value);
          setError("");
        }}
      />

      <div className="auth-options">
        <label className="auth-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Ghi nhớ đăng nhập
        </label>

        <Link to="/forgot-password" className="auth-forgot">
          Quên mật khẩu?
        </Link>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="auth-submit"
        disabled={!canSubmit || loading}
      >
        <i className="bi bi-box-arrow-in-right"></i>
        Đăng nhập
      </button>

      <div className="auth-divider">
        <span>Đăng nhập với</span>
      </div>

      <div className="auth-google">
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={(response) =>
                handleGoogleLogin(response.credential)
              }
              onError={() =>
                setError("Đăng nhập Google không thành công.")
              }
              theme="outline"
              shape="pill"
              size="large"
              text="signin_with"
              width="280"
            />
          </GoogleOAuthProvider>
        ) : (
          <button type="button" className="google-button" disabled>
            Đăng nhập bằng Google
          </button>
        )}
      </div>

      {loading && (
        <p className="auth-loading">
          Đang đăng nhập...
        </p>
      )}
    </form>
  );
}
