import { Outlet } from "react-router-dom";
import Sidebar from "../components/menu/Sidebar";
import TopBar from "../components/menu/Topbar";
import "../css/MainLayout.css";

export default function MainLayout() {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="main-content with-topbar">
        <Outlet />
      </main>
    </>
  );
}
