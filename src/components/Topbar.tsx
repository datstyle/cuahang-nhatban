import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useClickOutside from "./useClickOutside-topbar";
import SearchBox from "./SearchBox-topbar";
import NotifyMenu from "./Notify/NotifyMenu-topbar";
import TopBarButton from "./TopBarButton";
import "../css/Topbar.css";
import ChatMenu from "./Chat/ChatMenu";

export default function TopBar() {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(languageMenuRef, () => setIsLanguageMenuOpen(false));

  return (
    <header className="topbar">
      <SearchBox />
      <NavLink to="/cart" className="top-item">
        <i className="bi bi-cart" />
        <span>Giỏ hàng</span>
      </NavLink>
      <NotifyMenu />
      <ChatMenu />
      <div className="language-menu" ref={languageMenuRef}>
        <button
          type="button"
          className={`top-item${isLanguageMenuOpen ? " active" : ""}`}
          aria-expanded={isLanguageMenuOpen}
          onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
        >
          <i className="bi bi-translate" />
          <span>{language === "vi" ? "Tiếng Việt" : "English"}</span>
          <i className="bi bi-chevron-down language-chevron" />
        </button>

        {isLanguageMenuOpen && (
          <div className="language-dropdown">
            <button
              type="button"
              className={language === "vi" ? "selected" : ""}
              onClick={() => {
                setLanguage("vi");
                setIsLanguageMenuOpen(false);
              }}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              className={language === "en" ? "selected" : ""}
              onClick={() => {
                setLanguage("en");
                setIsLanguageMenuOpen(false);
              }}
            >
              English
            </button>
          </div>
        )}
      </div>
      <TopBarButton icon="bi-heart" label="Yêu thích" />
      <TopBarButton icon="bi-fingerprint" label="Đăng nhập" className="login" />
    </header>
  );
}
