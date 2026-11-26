import { useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import useAuth from "../types/useAuth";
import "../css/Admin.css";

export interface AdminOutletContext {
  searchTerm: string;
}

const adminLinks = [
  { label: "Q.lý đơn hàng", to: "/admin", icon: "bi-receipt" },
  { label: "Q.lý sản phẩm", to: "/admin/products", icon: "bi-box-seam" },
  { label: "Thêm sản phẩm", to: "/admin/products/new", icon: "bi-plus-square" },
  { label: "Phản hồi khách hàng", to: "/admin/feedback", icon: "bi-chat-left-text" },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <Link className="admin-brand" to="/">Japan Shop</Link>
        <form className="admin-search" onSubmit={handleSearch}>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo mã đơn, tên người nhận, số điện thoại"
            aria-label="Tìm đơn hàng"
          />
          <button type="submit">Tìm kiếm</button>
        </form>
        <Link className="admin-home" to="/">
          <i className="bi bi-house-fill" />
          <span>Trang chủ</span>
        </Link>
      </header>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <h2>Kênh người bán</h2>
          <nav>
            {adminLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                data-sound-hover="true"
                data-sound-click="true"
                className={({ isActive }) =>
                  `admin-nav-link${isActive ? " active" : ""}`
                }
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          <Outlet context={{ searchTerm } satisfies AdminOutletContext} />
        </main>
      </div>
    </div>
  );
}
