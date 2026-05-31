# Music Market - Frontend

Giao diện người dùng cho hệ thống **Music Demo Marketplace**, được xây dựng trên nền tảng **React + Vite** kết hợp với **React Router** và **Axios** để giao tiếp với hệ thống Backend API.

---

## 🛠️ Công nghệ sử dụng
- **React 19**
- **Vite** (Bundler siêu nhanh)
- **React Router DOM** (Định tuyến Single Page Application)
- **Axios** (API Client)
- **Lucide React** (Bộ icon hiện đại)
- **Vanilla CSS** (Hệ thống giao diện Glassmorphism cao cấp)

---

## 📂 Cấu trúc thư mục dự án
```
E:\music-demo-FE\
├── public/
├── src/
│   ├── assets/          # CSS toàn cục (global.css) và các tệp hình ảnh
│   ├── components/      # Các component tái sử dụng (Navbar, Layout, v.v.)
│   ├── pages/           # Các trang giao diện chính:
│   │   ├── Home.jsx           # Trang chủ (Danh mục & Tìm kiếm bài nhạc)
│   │   ├── TrackDetails.jsx   # Chi tiết bài nhạc & nhạc liên quan
│   │   ├── Inquiry.jsx        # Gửi yêu cầu mua nhạc (License)
│   │   ├── InquiryStatus.jsx  # Tra cứu trạng thái đơn hàng/yêu cầu
│   │   ├── Login.jsx          # Đăng nhập quản trị viên
│   │   └── AdminDashboard.jsx # Bảng điều khiển quản trị (Doanh thu & Top nhạc)
│   ├── router/          # Cấu hình định tuyến React Router
│   ├── services/        # API Client tích hợp Axios kết nối Backend
│   ├── App.jsx          # Component gốc của dự án
│   └── main.jsx         # Điểm khởi đầu của ứng dụng
├── .env.example         # File mẫu cấu hình biến môi trường
├── .env                 # File cấu hình cục bộ thực tế
└── package.json         # Danh sách thư viện và scripts
```

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Chuẩn bị biến môi trường
Sao chép tệp cấu hình `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Đảm bảo biến `VITE_API_BASE_URL` trỏ đúng về địa chỉ Backend của bạn (mặc định: `http://localhost:5000/api/v1`).

### 2. Cài đặt các thư viện
Di chuyển vào thư mục dự án và chạy:
```bash
npm install
```

### 3. Khởi chạy ở chế độ Development
Chạy lệnh sau để bật dev server:
```bash
npm run dev
```
Truy cập ứng dụng tại đường dẫn mặc định: `http://localhost:5173`.

### 4. Đóng gói Production (Build)
Đóng gói mã nguồn tối ưu chuẩn bị cho việc deploy:
```bash
npm run build
```
Dự án sẽ được đóng gói vào thư mục `dist`.
