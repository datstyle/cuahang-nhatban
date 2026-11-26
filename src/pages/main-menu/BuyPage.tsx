import { useState } from "react";
import type { FormEvent } from "react";
import "../../css/BuyPage.css";

type OrderTab =
  | "all"
  | "awaiting-payment"
  | "awaiting-shipment"
  | "shipping"
  | "refund"
  | "unreviewed"
  | "reviewed";

interface OrderFilters {
  keyword: string;
  date: string;
  payment: string;
  seller: string;
  status: string;
  minPrice: string;
  maxPrice: string;
}

const orderTabs: { id: OrderTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "awaiting-payment", label: "Chờ thanh toán" },
  { id: "awaiting-shipment", label: "Chờ vận chuyển" },
  { id: "shipping", label: "Chờ giao hàng" },
  { id: "refund", label: "Yêu cầu hoàn tiền" },
  { id: "unreviewed", label: "Chưa đánh giá" },
  { id: "reviewed", label: "Đã đánh giá" },
];

const initialFilters: OrderFilters = {
  keyword: "",
  date: "",
  payment: "all",
  seller: "",
  status: "all",
  minPrice: "",
  maxPrice: "",
};

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [hasSearched, setHasSearched] = useState(false);

  const updateFilter = (key: keyof OrderFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setHasSearched(false);
  };

  return (
    <main className="buy-page">
      <nav className="buy-tabs" aria-label="Trạng thái đơn hàng">
        {orderTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            aria-pressed={activeTab === tab.id}
            data-sound-hover="true"
            data-sound-click="true"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <form className="buy-filters" onSubmit={handleSearch}>
        <label className="buy-filter-field">
          <span>Nhập đơn hàng</span>
          <input
            value={filters.keyword}
            onChange={(event) => updateFilter("keyword", event.target.value)}
            placeholder="Tên sản phẩm / Số đơn hàng"
          />
        </label>

        <label className="buy-filter-field">
          <span>Thời gian đặt hàng</span>
          <input
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter("date", event.target.value)}
          />
        </label>

        <label className="buy-filter-field">
          <span>P.thức thanh toán</span>
          <select
            value={filters.payment}
            onChange={(event) => updateFilter("payment", event.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option value="bank">Chuyển khoản</option>
            <option value="wallet">Ví điện tử</option>
          </select>
        </label>

        <label className="buy-filter-field">
          <span>Người bán</span>
          <input
            value={filters.seller}
            onChange={(event) => updateFilter("seller", event.target.value)}
            placeholder="Tên người bán/ tên shop"
          />
        </label>

        <label className="buy-filter-field">
          <span>Trạng thái đơn hàng</span>
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="all">Tất cả</option>
            {orderTabs.slice(1).map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </label>

        <div className="buy-filter-field buy-price-filter">
          <span>Số tiền</span>
          <div>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder="₫ Số tiền tối thiểu"
            />
            <span>–</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder="₫ Số tiền tối đa"
            />
          </div>
        </div>

        <div className="buy-filter-actions">
          <button type="button" className="buy-clear-button" data-sound-click="true" onClick={clearFilters}>
            Xóa các tùy chọn
          </button>
          <button type="submit" className="buy-search-button" data-sound-click="true">
            Tìm kiếm
          </button>
        </div>
      </form>

      <section className="buy-orders" aria-label="Danh sách đơn hàng">
        <div className="buy-orders-scroll">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng số tiền</th>
                <th>Người bán</th>
                <th>Trạng thái đơn hàng</th>
                <th>Thao tác giao dịch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="buy-empty-state">
                  {hasSearched
                    ? "Không tìm thấy đơn hàng phù hợp."
                    : "Bạn chưa có đơn hàng."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
