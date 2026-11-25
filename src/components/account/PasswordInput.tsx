import { useState } from "react";

interface PasswordInputProps {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function PasswordInput({ id, value, placeholder, onChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="pw-field">
      <input
        id={id}
        type={show ? "text" : "password"}
        className="auth-input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="pw-toggle"
        title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        onClick={() => setShow((v) => !v)}
      >
        <i className={`bi ${show ? "bi-eye" : "bi-eye-slash"}`} />
      </button>
    </div>
  );
}