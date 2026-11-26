import { useEffect, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import type { StorefrontContext } from "../../layouts/MainLayouts";
import type { Product } from "../../types";
import { ProductService } from "../../services/productService";
import { getCategoryLabel, getProductDisplay } from "../../utils/localize";
import "../../css/ProductList.css";

export default function ProductListPage() {
  const {
    language,
    categories,
  } = useOutletContext<StorefrontContext>();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const selectedCategoryId = searchParams.get("category")?.trim().toLowerCase() ?? "";
  const selectedCategoryName = searchParams.get("categoryName")?.trim().toLowerCase() ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const filteredProducts = products.filter((product) =>
    (!searchTerm || [product.name, product.nameEn, product.nameJa].some(
      (name) => name?.toLowerCase().includes(searchTerm),
    )) &&
    (!selectedCategoryId ||
      product.category.trim().toLowerCase() === selectedCategoryId ||
      product.category.trim().toLowerCase() === selectedCategoryName),
  );

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await ProductService.getAll();
        if (isActive) setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (isActive) setError("Không tải được danh sách sản phẩm. Vui lòng thử lại.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  return (
    <section className="container py-4" id="products">
      <h2 className="h3 mb-4">Sản phẩm</h2>

      {isLoading && (
        <div className="py-5 text-center" role="status">
          <div className="spinner-border text-danger" aria-hidden="true" />
          <p className="mt-3 mb-0">Đang tải sản phẩm...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{error}</p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="alert alert-light border text-center py-5">
          {searchTerm || selectedCategoryId
            ? "Không tìm thấy sản phẩm phù hợp."
            : "Chưa có sản phẩm nào."}
        </div>
      )}

      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="row g-3 product-grid">
          {filteredProducts.map((product) => {
            const display = getProductDisplay(product, language);
            return (
              <div className="col-6 col-sm-4 col-lg-3 col-xl-2" key={product.id}>
                <article
                  className="card h-100 shadow-sm product-card sound-hover-card"
                  data-sound-hover="true"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      className="card-img-top product-card-image"
                      alt={display.name}
                    />
                  ) : (
                    <div
                      className="product-card-image-placeholder d-flex align-items-center justify-content-center bg-light text-secondary"
                      aria-label="Chưa có ảnh sản phẩm"
                    >
                      <i className="bi bi-image fs-1" aria-hidden="true" />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <span className="small text-secondary product-card-category">
                      {getCategoryLabel(product.category, categories, language)}
                    </span>
                    <h2 className="h6 mt-2 product-card-title">{display.name}</h2>
                    <p className="fw-bold text-danger product-card-price">
                      {display.price}
                    </p>
                    <Link
                      className="btn btn-outline-danger mt-auto product-card-link"
                      to={`/products/${product.id}`}
                      data-sound-click="true"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
