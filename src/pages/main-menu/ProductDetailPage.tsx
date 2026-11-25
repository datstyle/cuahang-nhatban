import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import type { Product } from "../../types";
import { ProductService } from "../../services/productService";

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("vi-VN").format(price)}₫`;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      if (!id) {
        setError("Không tìm thấy mã sản phẩm.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      setProduct(null);

      try {
        const data = await ProductService.getById(id);
        if (isActive) setProduct(data);
      } catch (requestError) {
        if (!isActive) return;

        if (isAxiosError(requestError) && requestError.response?.status === 404) {
          setError("Không tìm thấy sản phẩm này.");
        } else {
          setError("Không tải được thông tin sản phẩm. Vui lòng thử lại.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [id, reloadKey]);

  return (
    <section className="container py-4">
      <Link to="/products" className="btn btn-link px-0 mb-3">
        ← Quay lại danh sách
      </Link>

      {isLoading && (
        <div className="py-5 text-center" role="status">
          <div className="spinner-border text-danger" aria-hidden="true" />
          <p className="mt-3 mb-0">Đang tải thông tin sản phẩm...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{error}</p>
          {id && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && product && (
        <article className="row g-4 align-items-start">
          <div className="col-12 col-md-6">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded border w-100"
                style={{ maxHeight: 480, objectFit: "contain" }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center rounded bg-light text-secondary" style={{ minHeight: 320 }}>
                <i className="bi bi-image fs-1" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <span className="text-secondary">{product.category}</span>
            <h1 className="h3 mt-2">{product.name}</h1>
            <p className="fs-4 fw-bold text-danger">{formatPrice(product.price)}</p>
            <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
            <p className="text-secondary">
              Tình trạng: {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
            </p>
          </div>
        </article>
      )}
    </section>
  );
}
