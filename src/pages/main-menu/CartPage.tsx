import { useState } from "react";
import type { FormEvent } from "react";
import "../../css/Cart.css";

export default function CartPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm.trim());
  };

  return (
    <main className="cart-page">
      <div className="cart-toolbar">
        <h1>Trang Giỏ hàng</h1>
        <form className="cart-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm"
            aria-label="Tìm sản phẩm trong giỏ hàng"
          />
          <button type="submit" aria-label="Tìm kiếm">
            <i className="bi bi-search" aria-hidden="true" />
          </button>
        </form>
      </div>

      <section className="cart-table-card" aria-label="Sản phẩm trong giỏ hàng">
        <div className="cart-table-scroll">
          <table className="cart-table">
            <thead>
              <tr>
                <th className="cart-select-column">
                  <input type="checkbox" aria-label="Chọn tất cả sản phẩm" />
                </th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Số tiền</th>
                <th>Tên shop</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cart-empty" colSpan={7}>
                  {submittedSearch
                    ? "Không tìm thấy sản phẩm trong giỏ hàng."
                    : "Giỏ hàng của bạn đang trống."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
