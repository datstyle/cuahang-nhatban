import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../types/useAuth";
import { authService } from "../../services/authService";
import "../../css/Profile.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [birthday, setBirthday] = useState(user?.birthday ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Ảnh đại diện cần nhỏ hơn 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Email không hợp lệ.");
      return;
    }

    try {
      const updatedUser = authService.updateProfile(user.email ?? email, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        gender,
        birthday,
        avatar,
      });

      if (!updatedUser) {
        setError("Không tìm thấy tài khoản để cập nhật.");
        return;
      }

      updateUser(updatedUser);
      setMessage("Thông tin hồ sơ đã được lưu.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Không thể lưu thông tin hồ sơ.",
      );
    }
  };

  return (
    <section className="profile-page">
      <header className="profile-header">
        <h1>Hồ sơ của tôi</h1>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </header>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-fields">
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="profile-name">Tên</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="profile-phone">Số điện thoại</label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Thêm số điện thoại"
          />

          <span className="profile-label">Giới tính</span>
          <div className="profile-genders">
            <label>
              <input type="radio" name="gender" checked={gender === "male"} onChange={() => setGender("male")} /> Nam
            </label>
            <label>
              <input type="radio" name="gender" checked={gender === "female"} onChange={() => setGender("female")} /> Nữ
            </label>
            <label>
              <input type="radio" name="gender" checked={gender === "other"} onChange={() => setGender("other")} /> Khác
            </label>
          </div>

          <label htmlFor="profile-birthday">Ngày sinh</label>
          <input
            id="profile-birthday"
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
          />
        </div>

        <aside className="profile-avatar-section">
          <div className="profile-avatar">
            {avatar ? <img src={avatar} alt="Ảnh đại diện" /> : <i className="bi bi-person" />}
          </div>
          <input
            ref={fileInputRef}
            className="profile-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
          />
          <button type="button" className="profile-pick-avatar" onClick={() => fileInputRef.current?.click()}>
            Chọn ảnh
          </button>
          <p>Dung lượng tối đa 1 MB<br />Định dạng: JPG, PNG, WEBP</p>
        </aside>

        <div className="profile-actions">
          {error && <p className="profile-error" role="alert">{error}</p>}
          {message && <p className="profile-success" role="status">{message}</p>}
          <button type="submit" className="profile-save">Lưu</button>
        </div>
      </form>
    </section>
  );
}
