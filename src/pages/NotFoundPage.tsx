import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-1">404</h1>
      <p>Trang tìm không tồn tại.</p>
      <button className="btn btn-danger" onClick={() => navigate("/")}>
        Về trang chủ
      </button>
    </div>
  );
}