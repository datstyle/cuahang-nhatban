import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Category } from "../../types";
import { categoryService } from "../../services/categoryService";
import ProductListPage from "./ProductListPage";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (location.hash === "#products") {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      <section className="container pb-2" id="categories">
        <h2 className="h5 mb-3">Danh mục sản phẩm</h2>
        {categoryError ? (
          <p className="small text-secondary">{categoryError}</p>
        ) : categories.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigate({ pathname: "/", hash: "#products" })}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  navigate({
                    pathname: "/",
                    search: `?category=${encodeURIComponent(category.id)}&categoryName=${encodeURIComponent(category.name)}`,
                    hash: "#products",
                  })
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <ProductListPage />
    </>
  );
}
