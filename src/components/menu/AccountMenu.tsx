import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickOutside from "./useClickOutside";
import useAuth from "../../types/useAuth";
import type { AuthUser } from "../../context/authContext";

interface MenuItem {
  label: string;
  icon: string;
  to: string;
  red?: boolean;
}

const ADMIN_ITEMS: MenuItem[] = [
  {
    label: "Trang Quản Lý Admin",
    icon: "bi-person-gear",
    to: "/admin",
    red: true,
  },
  {
    label: "Quản Lý Sản Phẩm",
    icon: "bi-boxes",
    to: "/admin/products",
  },
];

const USER_ITEMS: MenuItem[] = [
  { label: "Hồ sơ của tôi", icon: "bi-person-vcard", to: "/profile" },
  { label: "Giỏ hàng của tôi", icon: "bi-cart-fill", to: "/cart" },
  {
    label: "Lịch sử mua hàng",
    icon: "bi-clipboard-check-fill",
    to: "/orders",
  },
];

const DEMO_ADMIN: AuthUser = {
  name: "Quản Trị Viên",
  role: "admin",
  email: "admin@gmail.com",
};

const DEMO_USER: AuthUser = {
  name: "Người dùng",
  role: "user",
  email: "user@gmail.com",
};

export default function AccountMenu() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef, closeMenu);

  const handleNavigate = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const handleLogin = (account: AuthUser) => {
    login(account);
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const menuGroups: MenuItem[][] = [];

  if (user?.role === "admin") {
    menuGroups.push(ADMIN_ITEMS);
  }

  menuGroups.push(USER_ITEMS);

  return (
    <div className="account-wrap" ref={wrapperRef}>
      <button
        type="button"
        className={`top-item account-trigger${user?.role === "admin" ? " admin" : ""}`}
        data-sound-hover="true"
        data-sound-click="true"
        onClick={() => (user ? setIsOpen((open) => !open) : navigate("/login"))}
      >
        {user?.avatar ? (
          <img className="account-avatar" src={user.avatar} alt="Ảnh đại diện" />
        ) : (
          <i className={`bi ${user ? "bi-person-circle" : "bi-fingerprint"}`} />
        )}
        <span>{user ? user.name : "Đăng nhập"}</span>
        {user && <i className="bi bi-chevron-down account-chevron" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="account-popup">
          {!user ? (
            <>
              <p className="account-hint">Chọn tài khoản demo</p>
              <button
                type="button"
                className="account-item"
                data-sound-hover="true"
                data-sound-click="true"
                onClick={() => handleLogin(DEMO_ADMIN)}
              >
                <i className="bi bi-person-gear" />
                <span>Đăng nhập Admin</span>
              </button>
              <button
                type="button"
                className="account-item"
                data-sound-hover="true"
                data-sound-click="true"
                onClick={() => handleLogin(DEMO_USER)}
              >
                <i className="bi bi-person" />
                <span>Đăng nhập Người dùng</span>
              </button>
            </>
          ) : (
            <>
              {menuGroups.map((group, index) => (
                <div key={index}>
                  {group.map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      className={`account-item${item.red ? " red" : ""}`}
                      data-sound-hover="true"
                      data-sound-click="true"
                      onClick={() => handleNavigate(item.to)}
                    >
                      <i className={`bi ${item.icon}`} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div className="account-divider" />
                </div>
              ))}

              <button
                type="button"
                className="account-item red"
                data-sound-hover="true"
                data-sound-click="true"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right" />
                <span>Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
