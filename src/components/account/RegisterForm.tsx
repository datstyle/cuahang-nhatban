import { useState } from "react";
import type { FormEvent } from "react";
import useAuth from "../../types/useAuth";
import useToast from "../../types/useToast";
import PasswordInput from "./PasswordInput";
import { authService } from "../../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const validate = (): string => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      return "Vui lòng nhập đầy đủ thông tin.";
    }
    if (!EMAIL_REGEX.test(email.trim())) return "Email không hợp lệ.";
    if (password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    if (password !== confirm) return "Mật khẩu nhập lại không khớp.";
    return "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }

    const registerError = authService.register({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    if (registerError) {
      setError(registerError);
      return;
    }

    // Đăng ký xong tự đăng nhập luôn
    const account = authService.login(email.trim(), password);
    if (account) {
      login(account, true);
      showToast("Đăng ký thành công!");
    }
  };

  const clearError = () => setError("");

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        className="auth-input"
        placeholder="Họ và tên (*)"
        aria-label="Họ và tên"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          clearError();
        }}
        autoFocus
      />

      <input
        type="email"
        className="auth-input"
        placeholder="Email (*)"
        aria-label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearError();
        }}
      />

      <PasswordInput
        id="reg-password"
        placeholder="Mật khẩu (*)"
        value={password}
        onChange={(v) => {
          setPassword(v);
          clearError();
        }}
      />

      <PasswordInput
        id="reg-confirm"
        placeholder="Nhập lại mật khẩu (*)"
        value={confirm}
        onChange={(v) => {
          setConfirm(v);
          clearError();
        }}
      />

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" className="auth-submit" data-sound-hover="true" data-sound-click="true">Đăng ký</button>
    </form>
  );
}
