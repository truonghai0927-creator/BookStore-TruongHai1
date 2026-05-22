# 📚 Bookstore — Cửa Hàng Sách Trực Tuyến

Website bán sách trực tuyến với giao diện hiện đại, hỗ trợ đăng nhập/đăng ký, giỏ hàng, thanh toán và quản lý đánh giá sách.

---

## 👥 Danh sách thành viên nhóm

| STT | Họ và tên |
|-----|-----------|
| 1 | Hoàng Trường Hải |
| 2 | Đỗ Đình Duy |
| 3 | Nguyễn Văn Lễ |

---

## 🎯 Chức năng website

- **Trang chủ** — Hiển thị danh sách sách nổi bật, tìm kiếm, lọc theo thể loại, sắp xếp theo giá/ngày xuất bản.
- **Chi tiết sách** — Xem thông tin sách, tác giả, giá, tồn kho và đánh giá của khách hàng.
- **Giỏ hàng** — Thêm/xóa sách, tăng/giảm số lượng, tính tổng tiền tự động.
- **Đăng ký / Đăng nhập** — Xác thực người dùng bằng JWT.
- **Checkout** — Đặt hàng, nhập thông tin giao hàng, xác nhận đơn hàng.
- **Trang đặt hàng thành công** — Hiển thị thông tin đơn hàng sau khi thanh toán.
- **Dark / Light mode** — Đổi giao diện sáng/tối.
- **Admin API** — Quản lý sách, đơn hàng, thống kê.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mô tả |
|-----------|-------|
| **Next.js 13** | Framework React (SSR / SSG / API Routes) |
| **TypeScript** | Ngôn ngữ lập trình có kiểu tĩnh |
| **Tailwind CSS** | Framework CSS styling |
| **Prisma ORM** | ORM kết nối database |
| **TiDB Cloud** | Database MySQL trên cloud |
| **Recoil** | Quản lý state phía client |
| **JWT + bcrypt** | Xác thực và mã hóa mật khẩu |
| **notistack** | Hiển thị thông báo (toast) |
| **Axios** | Gọi API |

---

## 📦 Hướng dẫn cài đặt và chạy dự án trên localhost

### 1. Yêu cầu môi trường

- Node.js >= 18
- MySQL / TiDB Cloud

### 2. Clone dự án

```bash
git clone https://github.com/truonghai0927-creator/BookStore-TruongHai1.git
cd BookStore-TruongHai1
```

### 3. Cài đặt dependencies

```bash
npm install
```

### 4. Tạo file `.env`

Tạo file `.env` ở thư mục gốc với nội dung:

```env
DATABASE_URL="mysql://<USER>:<PASSWORD>@<HOST>:4000/bookshop?sslaccept=strict"
```

### 5. Tạo Prisma Client và đồng bộ schema lên database

```bash
npx prisma generate
npx prisma db push --force-reset
```

### 6. Seed dữ liệu mẫu vào database

```bash
node setup.mjs
```

### 7. Chạy development server

```bash
npm run dev
```

Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Cấu trúc thư mục

```
BookStore-TruongHai1/
├── components/
│   ├── BookCard.tsx
│   ├── BookList.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   └── v2/
├── pages/
│   ├── api/
│   │   ├── auth/          # login, register
│   │   ├── books/         # list, detail, ratings
│   │   ├── debug/
│   │   ├── orders/        # create, list
│   │   └── stats/
│   ├── book/[id].tsx      # Chi tiết sách
│   ├── cart.tsx           # Giỏ hàng
│   ├── checkout.tsx       # Thanh toán
│   ├── index.tsx          # Trang chủ
│   ├── login.tsx          # Đăng nhập
│   ├── register.tsx       # Đăng ký
│   └── success.tsx        # Đặt hàng thành công
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── lib/                   # prisma.ts, auth.ts, http.ts, utils.ts
├── atoms/                 # Recoil state
├── selectors/             # Recoil selectors
├── contexts/              # AuthContext, ThemeProvider
├── const/                 # Types & constants
├── scripts/               # setup.mjs (seed data)
├── styles/                # globals.css
└── README.md
```