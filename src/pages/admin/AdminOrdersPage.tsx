import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { AdminOutletContext } from "../../layouts/AdminLayout";

type OrderStatus =
  | "Chờ xử lý"
  | "Đang xử lý"
  | "Đang giao hàng"
  | "Giao hàng thành công"
  | "Đã hủy đơn hàng";
type OrderFilter = "Tất cả" | OrderStatus;

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  payment: string;
  total: number;
  status: OrderStatus;
  date: string;
  time: string;
}

const filters: OrderFilter[] = [
  "Tất cả",
  "Chờ xử lý",
  "Đang xử lý",
  "Đang giao hàng",
  "Giao hàng thành công",
  "Đã hủy đơn hàng",
];

const initialOrders: AdminOrder[] = [];

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("vi-VN").format(price)}đ`;

export default function AdminOrdersPage() {
  const { searchTerm } = useOutletContext<AdminOutletContext>();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleOrders = initialOrders.filter((order) => {
    const matchesFilter = activeFilter === "Tất cả" || order.status === activeFilter;
    const matchesSearch =
      !normalizedSearch ||
      `${order.id} ${order.customer} ${order.phone}`
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  return (
    <section className="admin-orders">
      <div className="admin-order-panel">
        <div className="admin-order-tabs" role="tablist" aria-label="Lọc đơn hàng">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-order-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Họ và tên</th>
                <th>Loại thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>
                    <strong>{order.customer}</strong>
                    <span className="admin-customer-phone">{order.phone}</span>
                  </td>
                  <td>{order.payment}<span className="admin-payment-note">● Chưa thanh toán</span></td>
                  <td><strong>{formatPrice(order.total)}</strong></td>
                  <td><span className={`admin-status status-${order.status.replaceAll(" ", "-")}`}>{order.status}</span></td>
                  <td>{order.date}<span className="admin-order-time">{order.time}</span></td>
                  <td>
                    <button className="admin-detail-button" type="button" onClick={() => setSelectedOrder(order)}>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr>
                  <td className="admin-empty" colSpan={7}>Không tìm thấy đơn hàng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelectedOrder(null)}>
          <section className="admin-order-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title" onClick={(event) => event.stopPropagation()}>
            <header>
              <h2 id="order-modal-title">Chi tiết đơn hàng</h2>
              <button type="button" aria-label="Đóng" onClick={() => setSelectedOrder(null)}>×</button>
            </header>
            <dl>
              <dt>Mã đơn</dt><dd>#{selectedOrder.id}</dd>
              <dt>Khách hàng</dt><dd>{selectedOrder.customer}</dd>
              <dt>Số điện thoại</dt><dd>{selectedOrder.phone}</dd>
              <dt>Thanh toán</dt><dd>{selectedOrder.payment}</dd>
              <dt>Tổng tiền</dt><dd>{formatPrice(selectedOrder.total)}</dd>
              <dt>Trạng thái</dt><dd>{selectedOrder.status}</dd>
              <dt>Ngày đặt</dt><dd>{selectedOrder.date} {selectedOrder.time}</dd>
            </dl>
          </section>
        </div>
      )}
    </section>
  );
}
