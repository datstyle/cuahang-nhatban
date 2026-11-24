import { NavLink, Outlet } from "react-router-dom";
import "../css/MainLayout.css";
import TopBar from "../components/Topbar";
type MenuItem = {
  label: string;
  icon: string;
  to: string;
};

const menu: MenuItem[] = [
  { label: "Trang chủ", icon: "bi-house", to: "/" },
  { label: "Mua", icon: "bi-bag", to: "/products" },
  { label: "Giỏ hàng", icon: "bi-box-seam", to: "/cart" },
  { label: "Giới thiệu", icon: "bi-person-vcard", to: "/about" },
  { label: "Tin tức", icon: "bi-globe-asia-australia", to: "/news" },
  { label: "Phản hồi", icon: "bi-exclamation-circle", to: "/feedback" },
];

export default function MainLayout() {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          Japan
          <br />
          Shop
        </div>

        {menu.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `side-item${isActive ? " active" : ""}`
            }
          >
            <i className={`bi ${icon}`} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </aside>

      <TopBar />

      <main className="main-content with-topbar">
        <Outlet />
      </main>
    </>
  );
}
