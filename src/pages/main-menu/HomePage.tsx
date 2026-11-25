import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import type { StorefrontContext } from "../../layouts/MainLayouts";
import { getCategoryName } from "../../utils/localize";
import ProductListPage from "./ProductListPage";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, categories, categoryError } = useOutletContext<StorefrontContext>();

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
                {getCategoryName(category, language)}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <ProductListPage />
    </>
  );
}
