import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { ProductService } from "../../services/productService";

type ProductFilter =
  | "all"
  | "pending"
  | "visible"
  | "low-stock"
  | "hidden"
  | "out-of-stock";

const productTabs: { id: ProductFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Duyệt sản phẩm" },
  { id: "visible", label: "Hiển thị" },
  { id: "low-stock", label: "Sản phẩm sắp hết" },
  { id: "hidden", label: "Đã ẩn" },
  { id: "out-of-stock", label: "Hết hàng" },
];

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("vi-VN").format(price)}đ`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    ProductService.getAll()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch(() => {
        if (isMounted) setError("Không tải được danh sách sản phẩm.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = products.filter((product) => {
    switch (activeFilter) {
      case "pending":
        return product.status === "pending";
      case "visible":
        return (product.status ?? "visible") === "visible";
      case "low-stock":
        return product.stock > 0 && product.stock <= 5;
      case "hidden":
        return product.status === "hidden";
      case "out-of-stock":
        return product.stock <= 0;
      default:
        return true;
    }
  });

  return (
    <section className="admin-products">
      <div className="admin-product-tabs" role="tablist" aria-label="Lọc sản phẩm">
        {productTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === tab.id}
            data-sound-hover="true"
            data-sound-click="true"
            className={activeFilter === tab.id ? "active" : ""}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap admin-product-table-wrap">
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Giá ban đầu</th>
              <th>Giá được giảm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => {
              const status = product.status ?? (product.stock > 0 ? "visible" : "hidden");
              const statusLabel = status === "pending"
                ? "Chờ duyệt"
                : status === "hidden"
                  ? "Đã ẩn"
                  : product.stock <= 0
                    ? "Hết hàng"
                    : product.stock <= 5
                      ? "Sắp hết"
                      : "Đang hiển thị";

              return (
                <tr key={product.id}>
                  <td className="admin-product-cell">
                    {product.image && <img src={product.image} alt="" />}
                    <span>{product.name}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td><span className={`admin-product-status status-${status}`}>{statusLabel}</span></td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.discountedPrice ? formatPrice(product.discountedPrice) : "—"}</td>
                  <td>—</td>
                </tr>
              );
            })}

            {!loading && visibleProducts.length === 0 && (
              <tr>
                <td className="admin-empty" colSpan={7}>
                  {error || "Chưa có sản phẩm trong mục này."}
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td className="admin-empty" colSpan={7}>Đang tải sản phẩm...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
