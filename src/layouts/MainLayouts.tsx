import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/menu/Sidebar";
import TopBar from "../components/menu/Topbar";
import { categoryService } from "../services/categoryService";
import type { Category, Lang } from "../types";
import "../css/MainLayout.css";

export interface StorefrontContext {
  language: Lang;
  categories: Category[];
  categoryError: string;
}

export default function MainLayout() {
  const [language, setLanguage] = useState<Lang>("vi");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let isActive = true;

    categoryService
      .getAll()
      .then((data) => {
        if (isActive) setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isActive) setCategoryError("Không tải được danh mục.");
      });

    return () => {
      isActive = false;
    };
  }, []);

  const storefront: StorefrontContext = { language, categories, categoryError };

  return (
    <>
      <Sidebar />
      <TopBar language={language} setLanguage={setLanguage} />
      <main className="main-content with-topbar">
        <Outlet context={storefront} />
      </main>
    </>
  );
}
