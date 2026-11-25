import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useClickOutside from "./useClickOutside";
import SearchBox from "./SearchBox";
import NotifyMenu from "../Notify/NotifyMenu-topbar";
import TopBarButton from "./TopBarButton";
import "../../css/Topbar.css";
import ChatMenu from "../Chat/ChatMenu";
import AccountMenu from "./AccountMenu";

export default function TopBar() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"vi" | "en" | "ja">("vi");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageLabels = {
    vi: "Tiếng Việt",
    en: "English",
    ja: "日本語",
  };

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
          <span>{languageLabels[language]}</span>
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
            <button
              type="button"
              className={language === "ja" ? "selected" : ""}
              onClick={() => {
                setLanguage("ja");
                setIsLanguageMenuOpen(false);
              }}
            >
              日本語
            </button>
          </div>
        )}
      </div>
      <TopBarButton
        icon="bi-gear"
        label="Cài đặt"
        onClick={() => navigate("/settings")}
      />
      <AccountMenu />
    </header>
  );
}
