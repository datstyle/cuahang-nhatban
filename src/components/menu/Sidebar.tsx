import { NavLink } from "react-router-dom";

interface SidebarItem {
  label: string;
  icon: string;
  to: string;
}

const menuItems: SidebarItem[] = [
  { label: "Trang chủ", icon: "bi-house", to: "/" },
  { label: "Mua", icon: "bi-bag", to: "/products" },
  { label: "Giỏ hàng", icon: "bi-box-seam", to: "/cart" },
  { label: "Giới thiệu", icon: "bi-person-vcard", to: "/about" },
  { label: "Tin tức", icon: "bi-globe-asia-australia", to: "/news" },
  { label: "Phản hồi", icon: "bi-exclamation-circle", to: "/feedback" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Japan
        <br />
        Shop
      </div>

      {menuItems.map(({ label, icon, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === "/"}
          className={({ isActive }) => `side-item${isActive ? " active" : ""}`}
        >
          <i className={`bi ${icon}`} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
