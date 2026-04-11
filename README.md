# 📚 Bookstore - Dự Án Sách Trực Tuyến

Ứng dụng cửa hàng sách trực tuyến được xây dựng với Next.js, Prisma và TiDB Cloud.

## 🚀 Demo

**Truy cập demo:** https://tidb-prisma-vercel-demo.vercel.app/

---

## 🖼️ Wireframe & Giao Diện

### 1. Trang Chủ (Homepage)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Bookstore              🔍 Tìm kiếm  👤 Đăng nhập  🛒 Giỏ  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ╔═══════════════════════════════════════════════════════╗    │
│    ║    CHÀO MỪNG ĐẾN VỚI BOOKSTORE           ║    │
│    ║    Khám phá ngàn đầu sách hay nhất          ║    │
│    ║                                           ║    │
│    ║    [Browse Books]  [Đăng ký ngay]         ║    │
│    ╚═══════════════════════════════════════════════╝    │
│                                                             │
│  ┌─────────────────────────────────────────────────┐  │
│  │  📖 SÁCH NỔI BẬT                                  │  │
│  ├─────────────────────────────────────────────────┤  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │  │
│  │  │ 📕  │ │ 📘  │ │ 📗  │ │ 📙  │              │  │
│  │  │Gatsby│ │ 1984 │ │Alchem│ │Hobbit│              │  │
│  │  │$12.9│ │$14.9 │ │$10.9│ │$15.9│              │  │
│  │  │ ⭐4.5│ │ ⭐4.8│ │ ⭐4.5│ │ ⭐4.9│              │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────┐  │
│  │  VỀ CHÚNG TÔI                                        │  │
│  │  ...                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2024 Bookstore - Bản quyền                          │
└──────────────────────────────────────────────��──────────────┘
```

### 2. Chi Tiết Sách (Book Detail)

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Trang chủ / Sách / [Tên sách]                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┬────────────────────────────────┐│
│  │                     │  [Loại: Novel]                    ││
│  │   ┌─────────────┐    │                                ││
│  │   │           │    │  Tên sách: [Title]             ││
│  │   │   📕      │    │  Tác giả: [Author Name]         ││
│  │   │  COVER    │    │  ⭐⭐⭐⭐⭐ (4.5) - 12 đánh giá ││
│  │   │           │    │  Ngày: DD/MM/YYYY              ││
│  │   │           │    │  Giá: $XX.XX                   ││
│  │   └─────────────┘    │  Còn XX trong kho               ││
│  │                     │                                ││
│  │                     │  [🛒 Thêm vào giỏ]             ││
│  └─────────────────────┴────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ĐÁNH GIÁ KHÁCH HÀNG (XX đánh giá)                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ 👤 User1    ⭐⭐⭐⭐⭐ - 01/01/2024          │  │  │
│  │  │ Review text here...                        │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Giỏ Hàng (Cart)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Tiếp tục mua sắm           GIỎ HÀNG                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ┌────┐  Tên sách                    [- 1 +]  $XX.XX  │  │
│  │  │📕 │  Tác giả                       [🗑️]        │  │
│  │  └────┘                                              │  │
│  └──────────────��──────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ┌────┐  Tên sách                    [- 2 +]  $XX.XX  │  │
│  │  │📕 │  Tác giả                       [🗑️]        │  │
│  │  └────┘                                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Tổng cộng (X sản phẩm):          $XXX.XX           │  │
│  │                                               [Thanh toán]│
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Đăng Nhập / Đăng Ký

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ┌───────────────────────┐                      │
│              │      ĐĂNG NHẬP        │                      │
│              ├───────────────────────┤                      │
│              │  📧 Email            │                      │
│              │  ┌─────────────────┐  │                      │
│              │  │ email@test.com │  │                      │
│              │  └─────────────────┘  │                      │
│              │  🔑 Mật khẩu          │                      │
│              │  ┌─────────────────┐  │                      │
│              │  │ ********      │  │                      │
│              │  └─────────────────┘  │                      │
│              │                       │                      │
│              │   [ĐĂNG NHẬP]          │                      │
│              │                       │                      │
│              │  Chưa có tài khoản?   │                      │
│              │  [Đăng ký ngay]       │                      │
│              └───────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Công Nghệ

| Công nghệ | Mô tả |
|-----------|-------|
| **Next.js 13** | Framework React hiện đại |
| **Prisma** | ORM cho database |
| **TiDB Cloud** | Database MySQL cloud |
| **Tailwind CSS** | Styling hiện đại |
| **Recoil** | State management |
| **JWT** | Authentication |

---

## 📦 Cài Đặt

```bash
# Clone dự án
git clone https://github.com/truonghai0927-creator/BookStore-TruongHai1.git
cd BookStore-TruongHai1

# Cài đặt dependencies
yarn install

# Chạy migration
npx prisma migrate dev

# Chạy development server
yarn dev
```

---

## 🌳 Cấu Trúc Dự Án

```
BookStore/
├── components/
│   ├── BookCard.tsx       # Thẻ sách
│   ├── BookList.tsx      # Danh sách sách
│   ├── Footer.tsx       # Chân trang
│   ├── Hero.tsx         # Banner chính
│   ├── Navbar.tsx      # Thanh điều hướng
│   └── ThemeToggle.tsx # Chuyển đổi dark/light
├── contexts/            # React Context
├── lib/
│   ├── auth.ts         # Auth utilities
│   ├── http.ts        # API functions
│   └── prisma.ts     # Prisma client
├── pages/
│   ├── api/          # API routes
│   ├── book/[id].tsx # Chi tiết sách
│   ├── cart.tsx      # Giỏ hàng
│   ├── index.tsx     # Trang chủ
│   ├── login.tsx     # Đăng nhập
│   └── register.tsx  # Đăng ký
└── prisma/
    └── schema.prisma # Database schema
```

---

## 📝 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/books` | Lấy danh sách sách |
| GET | `/api/books/:id` | Lấy chi tiết sách |
| GET | `/api/books/:id/ratings` | Lấy đánh giá |
| POST | `/api/books/:id/ratings` | Thêm đánh giá |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/debug/books` | Debug - danh sách tất cả sách |

---

## 🎨 Tính Năng

- [x] Giao diện hiện đại (modern UI)
- [x] Dark/Light mode
- [x] Giỏ hàng (shopping cart)
- [x] Chi tiết sách
- [x] Đánh giá sách
- [x] Đăng ký/Đăng nhập
- [x] Responsive design

---

## 📄 License

MIT License.

---

## 🙏 Cảm Ơn

Dự án được xây dựng với sự hỗ trợ của [TiDB Cloud](https://tidbcloud.com/).