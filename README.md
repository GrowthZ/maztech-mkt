# Maztech MKT Hub

Web app nội bộ cho phòng Marketing của Maztech, phục vụ nhập liệu hằng ngày và tổng hợp báo cáo tự động cho Winhome và Siêu Thị Kệ Giá.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Prisma ORM
- PostgreSQL
- JWT auth với HttpOnly cookie
- Recharts

## Tính năng chính

- Đăng nhập thật bằng JWT + cookie HttpOnly
- RBAC theo 4 role: ADMIN, CONTENT, ADS, DATA_INPUT
- CRUD cho content, SEO, Ads, data đầu vào
- Dashboard kiểu điều hành: hero KPI, biểu đồ, bảng theo thương hiệu, nhật ký hoạt động
- Form nhập liệu ưu tiên select cho fanpage, website, thương hiệu, nhân sự, nguồn data
- Báo cáo tổng hợp content, fanpage, SEO, Ads, data, nguồn data với màu sắc phân tầng rõ ràng
- Export Excel và PDF theo bộ lọc hiện tại
- Audit log cho create, update, delete
- Seed dữ liệu local dev

## Cây thư mục chính

```text
app/
  (auth)/login
  (protected)/dashboard
  (protected)/input/content
  (protected)/input/seo
  (protected)/input/ads
  (protected)/input/data
  (protected)/reports
  (protected)/settings/users
  (protected)/audit-logs
  api/
components/
lib/
server/
prisma/
types/
```

## Cách chạy local

### 1) Tạo file môi trường

Copy `.env.example` thành `.env`.

```bash
cp .env.example .env
```

### 2) Chạy PostgreSQL

Nếu dùng Docker:

```bash
docker compose up -d
```

### 3) Cài dependency

```bash
npm install
```

### 4) Generate Prisma client + migrate

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

### 5) Seed dữ liệu

```bash
npm run db:seed
```

### 6) Chạy test helper

```bash
npm run test
```

### 7) Chạy dev

```bash
npm run dev
```

Mặc định truy cập tại:

```text
http://localhost:3000
```

## Tài khoản test seed

- admin / 12345678
- nam / 12345678
- duc / 12345678
- thien / 12345678
- phuong / 12345678

## Ghi chú phân quyền

- Admin: toàn quyền, export, audit log, quản lý user
- Nam/Đức: chỉ social + SEO của chính mình
- Thiên: chỉ Ads của mình
- Phượng: chỉ data đầu vào của mình

## API chính

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### CRUD
- `GET/POST/PUT/DELETE /api/content-entries`
- `GET/POST/PUT/DELETE /api/seo-entries`
- `GET/POST/PUT/DELETE /api/ads-entries`
- `GET/POST/PUT/DELETE /api/data-entries`

### Reports
- `GET /api/reports/dashboard-summary`
- `GET /api/reports/content-summary`
- `GET /api/reports/fanpage-summary`
- `GET /api/reports/seo-summary`
- `GET /api/reports/ads-summary`
- `GET /api/reports/data-summary`
- `GET /api/reports/source-summary`
- `GET /api/reports/daily-data-trend`
- `GET /api/reports/export?format=xlsx`
- `GET /api/reports/export?format=pdf`

## Lưu ý triển khai

- Ở route collection, `PUT` và `DELETE` nhận `id` qua query string, ví dụ: `/api/content-entries?id=...`
- Production nên thay `JWT_SECRET` mạnh hơn và cấu hình cookie secure + domain rõ ràng.
- Có thể mở rộng thêm pagination, advanced audit diff, dashboard mobile tối ưu sâu hơn, và upload file export theo lịch sử.


## Nhận diện thương hiệu Maztech

- Đã tích hợp logo `public/maztech-logo.png`
- Màu nhấn chính: `#0B1F66`, `#152C85`, `#D81920`
- Sidebar, header, login và khối báo cáo đã đổi theo bộ nhận diện này.
