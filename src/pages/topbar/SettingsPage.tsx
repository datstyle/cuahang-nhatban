import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useProductSound } from "../../context/ProductSoundProvider";
import useAuth from "../../types/useAuth";
import type { ProductSoundTheme } from "../../types";
import { authService } from "../../services/authService";
import {
  settingsService,
  type BankAccount,
  type ShippingAddress,
  type UserSettings,
} from "../../services/settingsService";
import { PRODUCT_SOUND_OPTIONS } from "../../utils/productSounds";
import "../../css/Settings.css";

const SETTINGS_MENU = [
  {
    id: "addresses",
    label: "Địa chỉ nhận hàng",
    description: "Quản lý địa chỉ dùng khi đặt hàng.",
  },
  {
    id: "bank-accounts",
    label: "Tài khoản ngân hàng",
    description: "Quản lý các tài khoản ngân hàng đã lưu.",
  },
  {
    id: "password",
    label: "Đổi mật khẩu",
    description: "Cập nhật mật khẩu đăng nhập của bạn.",
  },
  {
    id: "notifications",
    label: "Thông báo",
    description: "Chọn những thông báo bạn muốn nhận.",
  },
  {
    id: "product-sounds",
    label: "Âm thanh",
    description: "Tùy chỉnh âm thanh khi tương tác với sản phẩm.",
  },
  {
    id: "privacy",
    label: "Quyền riêng tư",
    description: "Quản lý quyền riêng tư và tài khoản của bạn.",
  },
] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const location = useLocation();

  const activeSection =
    SETTINGS_MENU.find(
      (item) => `#${item.id}` === location.hash,
    ) ?? SETTINGS_MENU[0];

  const { updateSettings: updateProductSoundSettings } =
    useProductSound();

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

  const [showBankForm, setShowBankForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

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
    setShowBankForm(false);
  };

  const removeBankAccount = (id: string) => {
    saveSettings({
      ...settings,
      bankAccounts: settings.bankAccounts.filter(
        (account) => account.id !== id,
      ),
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

    saveSettings({
      ...settings,
      addresses: [...settings.addresses, newAddress],
    });

    setRecipient("");
    setPhone("");
    setAddress("");
    setShowAddressForm(false);
  };

  const removeAddress = (id: string) => {
    const remainingAddresses = settings.addresses.filter(
      (item) => item.id !== id,
    );

    if (
      remainingAddresses.length > 0 &&
      !remainingAddresses.some((item) => item.isDefault)
    ) {
      remainingAddresses[0].isDefault = true;
    }

    saveSettings({
      ...settings,
      addresses: remainingAddresses,
    });
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
      notifications: {
        ...settings.notifications,
        [key]: enabled,
      },
    });
  };

  const updateProductSoundEnabled = (enabled: boolean) => {
    const productSounds = {
      ...settings.productSounds,
      enabled,
    };

    saveSettings({ ...settings, productSounds });
    updateProductSoundSettings(productSounds);
  };

  const updateProductSoundTheme = (theme: ProductSoundTheme) => {
    const productSounds = {
      ...settings.productSounds,
      theme,
    };

    saveSettings({ ...settings, productSounds });
    updateProductSoundSettings(productSounds);
  };

  const updateProductSoundVolume = (volume: number) => {
    const productSounds = {
      ...settings.productSounds,
      volume,
    };

    saveSettings({ ...settings, productSounds });
    updateProductSoundSettings(productSounds);
  };

  const handleChangePassword = (
    event: FormEvent<HTMLFormElement>,
  ) => {
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

    const error = authService.changePassword(
      email,
      currentPassword,
      newPassword,
    );

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

    saveSettings({
      ...settings,
      deletionRequestedAt: new Date().toISOString(),
    });
  };

  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1>Cài đặt tài khoản</h1>
        <p>
          Quản lý tài khoản và tùy chỉnh trải nghiệm mua sắm của bạn.
        </p>
      </header>

      <div className="settings-layout">
        {/* Menu bên trái */}
        <aside className="settings-sidebar">
          <div className="settings-sidebar-account">
            <span className="settings-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={`Ảnh đại diện của ${user.name}`} />
              ) : (
                (user.name?.trim().charAt(0) || email.charAt(0) || "U").toUpperCase()
              )}
            </span>

            <div>
              <strong>Tài khoản của tôi</strong>
              <span title={email}>{email}</span>
            </div>
          </div>

          <nav
            className="settings-nav"
            aria-label="Danh mục cài đặt"
          >
            {SETTINGS_MENU.map((item) => (
              <Link
                key={item.id}
                to={{
                  pathname: location.pathname,
                  search: location.search,
                  hash: `#${item.id}`,
                }}
                className={
                  activeSection.id === item.id ? "active" : undefined
                }
                aria-current={
                  activeSection.id === item.id
                    ? "location"
                    : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Nội dung bên phải */}
        <div className="settings-content">
          <div className="settings-content-header">
            <h2>{activeSection.label}</h2>
            <p>{activeSection.description}</p>
          </div>

          {/* Địa chỉ nhận hàng */}
          <section
            className="settings-section"
            id="addresses"
            aria-label="Địa chỉ nhận hàng"
            hidden={activeSection.id !== "addresses"}
          >
            <div className="settings-list-header">
              <h3>Địa chỉ đã lưu ({settings.addresses.length})</h3>

              {!showAddressForm && (
                <button
                  className="settings-primary"
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                >
                  + Thêm địa chỉ
                </button>
              )}
            </div>

            {settings.addresses.length === 0 ? (
              <p className="settings-empty">
                Bạn chưa lưu địa chỉ nhận hàng nào.
              </p>
            ) : (
              <div className="settings-list">
                {settings.addresses.map((item) => (
                  <div
                    className="settings-saved-item sound-hover-card"
                    data-sound-hover="true"
                    key={item.id}
                  >
                    <div className="settings-item-info">
                      <div className="settings-item-title">
                        <strong>{item.recipient}</strong>

                        {item.isDefault && (
                          <span className="settings-default">
                            Mặc định
                          </span>
                        )}
                      </div>

                      <span>{item.phone}</span>
                      <span>{item.address}</span>
                    </div>

                    <div className="settings-item-actions">
                      {!item.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(item.id)}
                        >
                          Đặt mặc định
                        </button>
                      )}

                      <button
                        className="settings-danger-link"
                        type="button"
                        onClick={() => removeAddress(item.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddressForm && (
              <form
                className="settings-form settings-address-form"
                onSubmit={addAddress}
              >
                <h3 className="settings-wide">
                  Thêm địa chỉ mới
                </h3>

                <label>
                  Người nhận
                  <input
                    autoComplete="name"
                    value={recipient}
                    onChange={(event) =>
                      setRecipient(event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Số điện thoại
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    required
                  />
                </label>

                <label className="settings-wide">
                  Địa chỉ
                  <input
                    autoComplete="street-address"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
                    required
                  />
                </label>

                <div className="settings-form-actions settings-wide">
                  <button
                    className="settings-secondary"
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setRecipient("");
                      setPhone("");
                      setAddress("");
                    }}
                  >
                    Hủy
                  </button>

                  <button
                    className="settings-primary"
                    type="submit"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Tài khoản ngân hàng */}
          <section
            className="settings-section"
            id="bank-accounts"
            aria-label="Tài khoản ngân hàng"
            hidden={activeSection.id !== "bank-accounts"}
          >
            <div className="settings-list-header">
              <h3>
                Tài khoản đã lưu ({settings.bankAccounts.length})
              </h3>

              {!showBankForm && (
                <button
                  className="settings-primary"
                  type="button"
                  onClick={() => setShowBankForm(true)}
                >
                  + Thêm tài khoản
                </button>
              )}
            </div>

            {settings.bankAccounts.length === 0 ? (
              <p className="settings-empty">
                Bạn chưa lưu tài khoản ngân hàng nào.
              </p>
            ) : (
              <div className="settings-list">
                {settings.bankAccounts.map((account) => (
                  <div
                    className="settings-saved-item sound-hover-card"
                    data-sound-hover="true"
                    key={account.id}
                  >
                    <div className="settings-item-info">
                      <strong>{account.bankName}</strong>
                      <span>{account.accountName}</span>
                      <span>
                        •••• {account.accountNumber.slice(-4)}
                      </span>
                    </div>

                    <div className="settings-item-actions">
                      <button
                        className="settings-danger-link"
                        type="button"
                        onClick={() =>
                          removeBankAccount(account.id)
                        }
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showBankForm && (
              <form
                className="settings-form settings-bank-form"
                onSubmit={addBankAccount}
              >
                <h3 className="settings-wide">
                  Thêm tài khoản ngân hàng
                </h3>

                <label>
                  Ngân hàng
                  <input
                    value={bankName}
                    onChange={(event) =>
                      setBankName(event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Chủ tài khoản
                  <input
                    value={accountName}
                    onChange={(event) =>
                      setAccountName(event.target.value)
                    }
                    required
                  />
                </label>

                <label className="settings-wide">
                  Số tài khoản
                  <input
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(event) =>
                      setAccountNumber(event.target.value)
                    }
                    required
                  />
                </label>

                <div className="settings-form-actions settings-wide">
                  <button
                    className="settings-secondary"
                    type="button"
                    onClick={() => {
                      setShowBankForm(false);
                      setBankName("");
                      setAccountName("");
                      setAccountNumber("");
                    }}
                  >
                    Hủy
                  </button>

                  <button
                    className="settings-primary"
                    type="submit"
                  >
                    Lưu tài khoản
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Đổi mật khẩu */}
          <section
            className="settings-section"
            id="password"
            aria-label="Đổi mật khẩu"
            hidden={activeSection.id !== "password"}
          >
            <form
              className="settings-form settings-password-form"
              onSubmit={handleChangePassword}
            >
              <label>
                Mật khẩu hiện tại
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Mật khẩu mới
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  required
                />
                <small>Ít nhất 6 ký tự.</small>
              </label>

              <label>
                Nhập lại mật khẩu mới
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </label>

              {passwordError && (
                <p className="settings-error" role="alert">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p className="settings-success" role="status">
                  {passwordMessage}
                </p>
              )}

              <button className="settings-primary" type="submit">
                Cập nhật mật khẩu
              </button>
            </form>
          </section>

          {/* Thông báo */}
          <section
            className="settings-section"
            id="notifications"
            aria-label="Thông báo"
            hidden={activeSection.id !== "notifications"}
          >
            <label className="settings-toggle">
              <span>
                <strong>Thông tin đơn hàng</strong>
                <small>
                  Cập nhật trạng thái đơn hàng và giao hàng.
                </small>
              </span>

              <input
                type="checkbox"
                role="switch"
                checked={settings.notifications.orderUpdates}
                onChange={(event) =>
                  updateNotifications(
                    "orderUpdates",
                    event.target.checked,
                  )
                }
              />
            </label>

            <label className="settings-toggle">
              <span>
                <strong>Ưu đãi và khuyến mãi</strong>
                <small>
                  Thông báo về chương trình giảm giá và ưu đãi.
                </small>
              </span>

              <input
                type="checkbox"
                role="switch"
                checked={settings.notifications.promotions}
                onChange={(event) =>
                  updateNotifications(
                    "promotions",
                    event.target.checked,
                  )
                }
              />
            </label>

            <label className="settings-toggle">
              <span>
                <strong>Hoạt động bảo mật</strong>
                <small>
                  Thông báo về hoạt động bảo mật tài khoản.
                </small>
              </span>

              <input
                type="checkbox"
                role="switch"
                checked={settings.notifications.accountActivity}
                onChange={(event) =>
                  updateNotifications(
                    "accountActivity",
                    event.target.checked,
                  )
                }
              />
            </label>

            <p className="settings-note">
              Thay đổi được lưu tự động.
            </p>
          </section>

          {/* Âm thanh */}
          <section
            className="settings-section"
            id="product-sounds"
            aria-label="Âm thanh"
            hidden={activeSection.id !== "product-sounds"}
          >
            <label className="settings-toggle">
              <span>
                <strong>Âm thanh sản phẩm</strong>
                <small>
                  Phát âm thanh khi rê chuột và bấm xem sản phẩm.
                </small>
              </span>

              <input
                type="checkbox"
                role="switch"
                checked={settings.productSounds.enabled}
                onChange={(event) =>
                  updateProductSoundEnabled(event.target.checked)
                }
              />
            </label>

            {settings.productSounds.enabled && (
              <>
                <fieldset className="settings-sound-options">
                  <legend>Bộ âm thanh</legend>

                  {PRODUCT_SOUND_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={
                        "settings-sound-option" +
                        (settings.productSounds.theme === option.value
                          ? " selected"
                          : "")
                      }
                    >
                      <input
                        type="radio"
                        name="product-sound-theme"
                        value={option.value}
                        checked={
                          settings.productSounds.theme === option.value
                        }
                        onChange={() =>
                          updateProductSoundTheme(option.value)
                        }
                      />

                      <span>{option.label}</span>
                    </label>
                  ))}
                </fieldset>

                <label className="settings-volume">
                  <span>
                    <strong>Âm lượng</strong>
                    <small>{settings.productSounds.volume}%</small>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.productSounds.volume}
                    aria-label="Âm lượng âm thanh sản phẩm"
                    onChange={(event) =>
                      updateProductSoundVolume(Number(event.target.value))
                    }
                  />
                </label>
              </>
            )}

            <p className="settings-note">
              Thay đổi được lưu tự động.
            </p>
          </section>

          {/* Quyền riêng tư */}
          <section
            className="settings-section settings-privacy"
            id="privacy"
            aria-label="Quyền riêng tư"
            hidden={activeSection.id !== "privacy"}
          >
            <label className="settings-toggle">
              <span>
                <strong>Gợi ý sản phẩm cá nhân hóa</strong>
                <small>
                  Cho phép gợi ý sản phẩm phù hợp với hoạt động của bạn.
                </small>
              </span>

              <input
                type="checkbox"
                role="switch"
                checked={settings.personalizedRecommendations}
                onChange={(event) =>
                  saveSettings({
                    ...settings,
                    personalizedRecommendations: event.target.checked,
                  })
                }
              />
            </label>

            <div className="settings-delete-account">
              <div>
                <h3>Yêu cầu xóa tài khoản</h3>
                <p>
                  Tài khoản sẽ không bị xóa ngay khi gửi yêu cầu.
                </p>

                {settings.deletionRequestedAt && (
                  <span>
                    Đã ghi nhận yêu cầu ngày{" "}
                    {new Date(
                      settings.deletionRequestedAt,
                    ).toLocaleDateString("vi-VN")}
                    .
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={Boolean(settings.deletionRequestedAt)}
                onClick={requestAccountDeletion}
              >
                {settings.deletionRequestedAt
                  ? "Đã gửi yêu cầu"
                  : "Gửi yêu cầu"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
