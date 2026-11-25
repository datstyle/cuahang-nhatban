import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayouts";
import HomePage from "./pages/main-menu/HomePage";
import ProductDetailPage from "./pages/main-menu/ProductDetailPage";
import CartPage from "./pages/main-menu/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/main-menu/AboutPage";
import NewsPage from "./pages/main-menu/NewsPage";
import FeedbackPage from "./pages/main-menu/FeedbackPage";
import LoginPage from "./pages/topbar/LoginPage";
import RegisterPage from "./pages/topbar/RegisterPage";
import ProfilePage from "./pages/topbar/ProfilePage";
import SettingsPage from "./pages/topbar/SettingsPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminSectionPage from "./pages/admin/AdminSectionPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import BuyPage from "./pages/main-menu/BuyPage";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminSectionPage />} />
        <Route path="feedback" element={<AdminSectionPage />} />
      </Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<BuyPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Route>
    </Routes>
  );
}

export default App;
