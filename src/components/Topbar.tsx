import { NavLink } from "react-router-dom";
import SearchBox from "./SearchBox-topbar";
import NotifyMenu from "./NotifyMenu-topbar";
import TopBarButton from "./TopBarButton";
import "../css/Topbar.css";

export default function TopBar() {
  return (
    <header className="topbar">
      <SearchBox />
      <NavLink to="/cart" className="top-item">
        <i className="bi bi-cart" />
        <span>Giỏ hàng</span>
      </NavLink>
      <NotifyMenu />
      <TopBarButton icon="bi-send" label="Trò chuyện" />
      <TopBarButton icon="bi-translate" label="VN/EN" />
      <TopBarButton icon="bi-heart" label="Yêu thích" />
      <TopBarButton icon="bi-fingerprint" label="Đăng nhập" className="login" />
    </header>
  );
}