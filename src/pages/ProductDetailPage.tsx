import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mt-4">
      <h2>Chi tiết sản phẩm</h2>
      <p>Mã sản phẩm: {id}</p>
    </div>
  );
}