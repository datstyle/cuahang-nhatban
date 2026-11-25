import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../types/useAuth";
import { authService } from "../../services/authService";
import {
  settingsService,
  type BankAccount,
  type ShippingAddress,
  type UserSettings,
} from "../../services/settingsService";
import "../../css/Settings.css";

export default function SettingsPage() {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const [settings, setSettings] = useState<UserSettings>(() =>
    settingsService.load(email),
  );
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const saveSettings = (nextSettings: UserSettings) => {
    setSettings(nextSettings);
    settingsService.save(email, nextSettings);
  };

  const addBankAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bankAccount: BankAccount = {
      id: String(Date.now()),
      bankName: bankName.trim(),
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
    };

    saveSettings({
      ...settings,
      bankAccounts: [...settings.bankAccounts, bankAccount],
    });
    setBankName("");
    setAccountName("");
    setAccountNumber("");
  };

  const removeBankAccount = (id: string) => {
    saveSettings({
      ...settings,
      bankAccounts: settings.bankAccounts.filter((account) => account.id !== id),
    });
  };

  const addAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newAddress: ShippingAddress = {
      id: String(Date.now()),
      recipient: recipient.trim(),
      phone: phone.trim(),
      address: address.trim(),
      isDefault: settings.addresses.length === 0,
    };

    saveSettings({ ...settings, addresses: [...settings.addresses, newAddress] });
    setRecipient("");
    setPhone("");
    setAddress("");
  };

  const removeAddress = (id: string) => {
    const remainingAddresses = settings.addresses.filter((item) => item.id !== id);
    if (remainingAddresses.length > 0 && !remainingAddresses.some((item) => item.isDefault)) {
      remainingAddresses[0].isDefault = true;
    }
    saveSettings({ ...settings, addresses: remainingAddresses });
  };

  const setDefaultAddress = (id: string) => {
    saveSettings({
      ...settings,
      addresses: settings.addresses.map((item) => ({
        ...item,
        isDefault: item.id === id,
      })),
    });
  };

  const updateNotifications = (
    key: keyof UserSettings["notifications"],
    enabled: boolean,
  ) => {
    saveSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: enabled },
    });
  };

  const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới cần có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    const error = authService.changePassword(email, currentPassword, newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Đổi mật khẩu thành công.");
  };

  const requestAccountDeletion = () => {
    if (settings.deletionRequestedAt) return;
    const confirmed = window.confirm(
      "Gửi yêu cầu xóa tài khoản? Tài khoản sẽ chưa bị xóa ngay.",
    );
    if (!confirmed) return;

    saveSettings({ ...settings, deletionRequestedAt: new Date().toISOString() });
  };

  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1>Cài đặt</h1>
        <p>Quản lý thông tin thanh toán, địa chỉ và bảo mật tài khoản.</p>
      </header>

      <section className="settings-section" id="bank-accounts">
        <h2>Tài khoản ngân hàng</h2>
        {settings.bankAccounts.map((account) => (
          <div className="settings-saved-item" key={account.id}>
            <div>
              <strong>{account.bankName}</strong>
              <span>{account.accountName} ···· {account.accountNumber.slice(-4)}</span>
            </div>
            <button type="button" onClick={() => removeBankAccount(account.id)}>Xóa</button>
          </div>
        ))}
        <form className="settings-form settings-bank-form" onSubmit={addBankAccount}>
          <label>
            Ngân hàng
            <input value={bankName} onChange={(event) => setBankName(event.target.value)} required />
          </label>
          <label>
            Chủ tài khoản
            <input value={accountName} onChange={(event) => setAccountName(event.target.value)} required />
          </label>
          <label>
            Số tài khoản
            <input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} required />
          </label>
          <button className="settings-primary" type="submit">Thêm tài khoản</button>
        </form>
      </section>

      <section className="settings-section" id="addresses">
        <h2>Địa chỉ nhận hàng</h2>
        {settings.addresses.map((item) => (
          <div className="settings-saved-item" key={item.id}>
            <div>
              <strong>{item.recipient} · {item.phone}</strong>
              <span>{item.address}{item.isDefault ? " · Mặc định" : ""}</span>
            </div>
            <div className="settings-item-actions">
              {!item.isDefault && <button type="button" onClick={() => setDefaultAddress(item.id)}>Đặt mặc định</button>}
              <button type="button" onClick={() => removeAddress(item.id)}>Xóa</button>
            </div>
          </div>
        ))}
        <form className="settings-form settings-address-form" onSubmit={addAddress}>
          <label>
            Người nhận
            <input value={recipient} onChange={(event) => setRecipient(event.target.value)} required />
          </label>
          <label>
            Số điện thoại
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </label>
          <label className="settings-wide">
            Địa chỉ
            <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
          </label>
          <button className="settings-primary" type="submit">Thêm địa chỉ</button>
        </form>
      </section>

      <section className="settings-section" id="password">
        <h2>Đổi mật khẩu</h2>
        <form className="settings-form settings-password-form" onSubmit={handleChangePassword}>
          <label>
            Mật khẩu hiện tại
            <input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          </label>
          <label>
            Mật khẩu mới
            <input type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          </label>
          <label>
            Nhập lại mật khẩu mới
            <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>
          {passwordError && <p className="settings-error" role="alert">{passwordError}</p>}
          {passwordMessage && <p className="settings-success" role="status">{passwordMessage}</p>}
          <button className="settings-primary" type="submit">Cập nhật mật khẩu</button>
        </form>
      </section>

      <section className="settings-section" id="notifications">
        <h2>Cài đặt thông báo</h2>
        <label className="settings-toggle">
          <span>Thông tin đơn hàng</span>
          <input type="checkbox" checked={settings.notifications.orderUpdates} onChange={(event) => updateNotifications("orderUpdates", event.target.checked)} />
        </label>
        <label className="settings-toggle">
          <span>Ưu đãi và khuyến mãi</span>
          <input type="checkbox" checked={settings.notifications.promotions} onChange={(event) => updateNotifications("promotions", event.target.checked)} />
        </label>
        <label className="settings-toggle">
          <span>Hoạt động bảo mật tài khoản</span>
          <input type="checkbox" checked={settings.notifications.accountActivity} onChange={(event) => updateNotifications("accountActivity", event.target.checked)} />
        </label>
      </section>

      <section className="settings-section settings-privacy" id="privacy">
        <h2>Quyền riêng tư</h2>
        <label className="settings-toggle">
          <span>Gợi ý sản phẩm phù hợp với hoạt động của tôi</span>
          <input type="checkbox" checked={settings.personalizedRecommendations} onChange={(event) => saveSettings({ ...settings, personalizedRecommendations: event.target.checked })} />
        </label>
        <div className="settings-delete-account">
          <div>
            <strong>Yêu cầu xóa tài khoản</strong>
            <p>Gửi yêu cầu để bộ phận hỗ trợ xử lý việc xóa tài khoản.</p>
            {settings.deletionRequestedAt && <span>Đã gửi yêu cầu vào {new Date(settings.deletionRequestedAt).toLocaleDateString("vi-VN")}.</span>}
          </div>
          <button type="button" disabled={Boolean(settings.deletionRequestedAt)} onClick={requestAccountDeletion}>
            {settings.deletionRequestedAt ? "Đã gửi yêu cầu" : "Gửi yêu cầu"}
          </button>
        </div>
      </section>
    </main>
  );
}
