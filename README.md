# Japan Shop — cấu trúc dự án

## Chạy dự án

```bash
npm install
npm run dev
```

Tạo bản build bằng `npm run build`; xem bản build bằng `npm run preview`.

## Cấu trúc thư mục

```text
src/
├── App.tsx                   # Khai báo route và nối page với layout
├── main.tsx                  # Điểm khởi chạy React, Router và các Provider
├── assets/                   # Ảnh và tài nguyên được import trực tiếp
├── components/
│   ├── account/               # Form, layout đăng nhập/đăng ký
│   ├── Chat/                  # Menu chat, danh sách hội thoại, khung chat
│   ├── menu/                  # Sidebar, Topbar, tìm kiếm, tài khoản
│   └── Notify/                # Menu thông báo trên Topbar
├── context/                   # Auth, Toast và ProductSound Provider
├── css/                       # CSS riêng cho layout, page, component và hiệu ứng card
├── diagram/                   # Sơ đồ route
├── layouts/                   # MainLayout và AdminLayout
├── pages/
│   ├── admin/                 # Các trang quản trị
│   ├── main-menu/             # Trang thuộc menu chính
│   ├── topbar/                # Trang tài khoản và cài đặt
│   └── NotFoundPage.tsx       # Trang 404
├── services/                  # Axios và các hàm gọi API/lưu dữ liệu
├── types/                     # Kiểu dữ liệu và custom hooks
└── utils/                     # Hàm dùng chung, ví dụ bản địa hóa

public/
├── images/                    # Ảnh tĩnh dùng theo đường dẫn public
└── sounds/                    # Sáu file âm thanh của ba bộ lựa chọn
```

## Route và file của từng trang

### Trang chủ — `/`

- **Page:** `src/pages/main-menu/HomePage.tsx`
- **Danh mục và sản phẩm:** `src/pages/main-menu/ProductListPage.tsx` được render bên trong trang chủ.
- **File hỗ trợ:**
  - `src/layouts/MainLayouts.tsx` tải danh mục và truyền `language`, `categories`, `categoryError` qua Outlet context.
  - `src/services/categoryService.ts` tải danh mục.
  - `src/services/productService.ts` tải sản phẩm.
  - `src/services/api.ts` cấu hình Axios và MockAPI base URL.
  - `src/types/index.ts` định nghĩa `Category`, `Product` và ngôn ngữ.
  - `src/utils/localize.ts` chọn tên, mô tả, giá theo ngôn ngữ.
  - `src/css/ProductList.css` định dạng lưới và thẻ sản phẩm, hiệu ứng hover.
  - `src/components/menu/Sidebar.tsx` và `src/components/menu/Topbar.tsx` là menu dùng chung.
- Âm thanh sản phẩm được chọn trong Cài đặt. Các file đặt trong `public/sounds/`:
  - Forza Horizon: `forza-horizon-hover.mp3`, `forza-horizon-click.mp3`.
  - Grand Theft Auto V: `gta-v-hover.mp3`, `gta-v-click.mp3`.
  - Red Dead Redemption 2: `red-dead-redemption-2-hover.mp3`, `red-dead-redemption-2-click.mp3`.

### Trang Mua — `/products`

- **Page:** `src/pages/main-menu/BuyPage.tsx`
- **CSS:** `src/css/BuyPage.css`
- Trang hiện có giao diện tab và bộ lọc đơn mua; dữ liệu đơn hàng chưa được nối API.

### Chi tiết sản phẩm — `/products/:id`

- **Page:** `src/pages/main-menu/ProductDetailPage.tsx`
- **File hỗ trợ:** `src/services/productService.ts`, `src/services/api.ts`, `src/types/index.ts`, `src/utils/localize.ts`.
- Lấy `id` từ URL và tải chi tiết sản phẩm từ API.

### Giỏ hàng — `/cart`

- **Page:** `src/pages/main-menu/CartPage.tsx`
- **CSS:** `src/css/Cart.css`
- Trang hiện có khung bảng và ô tìm kiếm; chưa có `CartContext` hoặc xử lý thêm/xóa/cập nhật số lượng.

### Giới thiệu — `/about`

- **Page:** `src/pages/main-menu/AboutPage.tsx`
- Hiện là trang nội dung cơ bản.

### Tin tức — `/news`

- **Page:** `src/pages/main-menu/NewsPage.tsx`
- Hiện là trang nội dung cơ bản.

### Phản hồi — `/feedback`

- **Page:** `src/pages/main-menu/FeedbackPage.tsx`
- Hiện là trang nội dung cơ bản, chưa có form gửi phản hồi.

### Đăng nhập — `/login`

- **Page:** `src/pages/topbar/LoginPage.tsx`
- **Component:** `src/components/account/AuthLayout.tsx`, `LoginForm.tsx`, `PasswordInput.tsx`.
- **File hỗ trợ:** `src/services/authService.ts`, `src/types/accounts.ts`, `src/context/AuthProvider.tsx`, `src/context/authContext.ts`, `src/types/useAuth.ts`.
- **Thông báo:** `src/context/ToastProvider.tsx`, `src/context/toastContext.ts`, `src/types/useToast.ts`, `src/css/Toast.css`.
- **CSS:** `src/css/login.css`.
- Google Login đọc `VITE_GOOGLE_CLIENT_ID`; form hiện gửi credential tới `http://localhost:3001/api/auth/google`.

### Đăng ký — `/register`

- **Page:** `src/pages/topbar/RegisterPage.tsx`
- **Component:** `AuthLayout.tsx`, `RegisterForm.tsx`, `PasswordInput.tsx` trong `src/components/account/`.
- **File hỗ trợ:** `src/services/authService.ts`, Auth/Toast Provider và các custom hook như phần đăng nhập.
- **CSS:** `src/css/login.css`.

### Hồ sơ — `/profile`

- **Page:** `src/pages/topbar/ProfilePage.tsx`
- **CSS:** `src/css/Profile.css`
- **File hỗ trợ:** `src/services/authService.ts`, `src/types/useAuth.ts`, `src/context/AuthProvider.tsx`, `src/context/authContext.ts`.

### Cài đặt — `/settings`

- **Page:** `src/pages/topbar/SettingsPage.tsx`
- **CSS:** `src/css/Settings.css`
- **File hỗ trợ:** `src/services/settingsService.ts`, `src/services/authService.ts`, Auth Provider và `useAuth`.
- Cài đặt ngân hàng, địa chỉ, thông báo và quyền riêng tư được lưu bằng `localStorage`.

### Trang quản lý đơn hàng — `/admin`

- **Page:** `src/pages/admin/AdminOrdersPage.tsx`
- **Layout và CSS:** `src/layouts/AdminLayout.tsx`, `src/css/Admin.css`.
- `AdminLayout` kiểm tra quyền admin và truyền `searchTerm` cho page. Danh sách đơn hiện được khởi tạo rỗng.

### Quản lý sản phẩm — `/admin/products`

- **Page:** `src/pages/admin/AdminProductsPage.tsx`
- **File hỗ trợ:** `src/services/productService.ts`, `src/services/api.ts`, `src/types/index.ts`.
- **Layout và CSS:** `src/layouts/AdminLayout.tsx`, `src/css/Admin.css`.

### Thêm sản phẩm — `/admin/products/new`

- **Page hiện được route tới:** `src/pages/admin/AdminSectionPage.tsx`.
- File này hiện trả về `null`; cần thay bằng page/form thêm sản phẩm khi triển khai chức năng.

### Phản hồi khách hàng admin — `/admin/feedback`

- **Page hiện được route tới:** `src/pages/admin/AdminSectionPage.tsx`.
- Route hiện dùng chung page trống với `/admin/products/new`.

### Trang 404 — `*`

- **Page:** `src/pages/NotFoundPage.tsx`
- **Route:** khai báo trong `src/App.tsx`.

### Trang đơn mua — chưa có route

- **File:** `src/pages/topbar/OrdersPage.tsx`
- Page này hiện chưa được khai báo trong `src/App.tsx`. `AccountMenu` có liên kết `/orders`, nhưng đường dẫn này hiện rơi vào trang 404.

## Thành phần dùng chung

- `src/components/menu/Topbar.tsx`: ô tìm kiếm, thông báo, chat, ngôn ngữ, cài đặt và tài khoản.
- `src/components/menu/Sidebar.tsx`: menu điều hướng bên trái.
- `src/components/menu/SearchBox.tsx`: tìm kiếm sản phẩm.
- `src/components/menu/AccountMenu.tsx`: tài khoản, đăng nhập, hồ sơ, cài đặt và đăng xuất.
- `src/components/Chat/ChatMenu.tsx`, `ChatList.tsx`, `ChatWindow.tsx`: giao diện chat và hội thoại mẫu.
- `src/components/Notify/NotifyMenu-topbar.tsx`: menu thông báo; dữ liệu khai báo tại `src/types/notifications.ts`.
- `src/layouts/MainLayouts.tsx`: layout storefront, Sidebar, Topbar và dữ liệu danh mục/ngôn ngữ dùng chung.
- `src/layouts/AdminLayout.tsx`: layout quản trị, kiểm tra vai trò admin và menu admin.

## API, dữ liệu và cấu hình

- **API base URL:** `src/services/api.ts`.
- **Sản phẩm:** `src/services/productService.ts` (`getAll`, `getById`, `create`).
- **Danh mục:** `src/services/categoryService.ts` (`getAll`).
- **Kiểu dữ liệu:** `src/types/index.ts`, `src/types/accounts.ts`, `src/types/chats.ts`, `src/types/notifications.ts`.
- **Tài khoản:** `src/services/authService.ts`; dữ liệu demo và tài khoản đăng ký dùng `localStorage`.
- **Cài đặt người dùng:** `src/services/settingsService.ts`; dữ liệu được lưu trong `localStorage` theo email.
- **Cài đặt âm thanh:** bật/tắt, bộ game và âm lượng 0–100% được lưu cùng cài đặt tài khoản; mặc định là 20%. Giao diện ở `SettingsPage.tsx`, danh sách file ở `src/utils/productSounds.ts`, phát âm thanh toàn ứng dụng ở `src/context/ProductSoundProvider.tsx`.
- **Hiệu ứng âm thanh:** `src/context/ProductSoundProvider.tsx` phát âm thanh theo thuộc tính `data-sound-hover` và `data-sound-click` trên card, Sidebar, Topbar và các popup tương tác.
- **Hiệu ứng nhô card:** `src/css/CardEffects.css`; card dùng class `sound-hover-card`.
- **Bản địa hóa:** `src/utils/localize.ts`; kiểu ngôn ngữ `Lang` khai báo tại `src/types/index.ts`.
- **Google Login:** đặt `VITE_GOOGLE_CLIENT_ID` trong file `.env.local`. Không đưa secret vào Git. Backend callback hiện được gọi tại `src/components/account/LoginForm.tsx`.

## File khởi chạy và giao diện chung

- `src/main.tsx`: khởi tạo React, BrowserRouter, AuthProvider, ToastProvider, Bootstrap và Bootstrap Icons.
- `src/App.tsx`: khai báo route.
- `src/index.css` và `src/App.css`: CSS còn trong dự án nhưng hiện chưa được import từ entry point.
- `package.json`: thư viện và lệnh `dev`, `build`, `lint`, `preview`.
- `src/diagram/route.drawio`: sơ đồ route hiện có.
