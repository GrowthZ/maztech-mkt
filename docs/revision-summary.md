# Tổng hợp chỉnh sửa theo yêu cầu mới

## 1. Nhập liệu phải đồng bộ dữ liệu
- Fanpage ở form Social chuyển từ input tự do sang select.
- Website ở form SEO chuyển từ input tự do sang select.
- Các danh mục quan trọng tiếp tục giữ theo select: nhân sự, thương hiệu, loại bài, nguồn data.
- Seed dữ liệu cũng được chuẩn hóa lại theo danh mục mới.

## 2. Dashboard không còn sơ sài
- Thêm hero điều hành với KPI lớn cấp phòng Marketing.
- Thêm khối cảnh báo nhanh.
- Thêm bảng hiệu suất theo thương hiệu.
- Thêm bảng sản lượng theo nhân sự.
- Thêm nhật ký hoạt động lấy từ audit log thật.
- Giữ bộ lọc chung áp dụng cho dashboard.

## 3. Reports có màu sắc rõ ràng hơn
- Social / Content: xanh dương.
- SEO / Website: tím.
- Ads / Chi tiêu: xanh lá.
- Data đầu vào: cam.
- Cảnh báo / điểm chú ý: đỏ hồng.
- Các section report có gradient nhẹ, bảng có header màu và zebra row.

## 4. Vẫn là app fullstack có database thật
- Backend vẫn dùng Next.js Route Handlers + Prisma + PostgreSQL.
- Auth vẫn là JWT cookie HttpOnly.
- Audit log vẫn ghi create / update / delete.
- Reports vẫn tính từ database thật, không dùng mock trong flow production.

## 5. Bổ sung helper và test cơ bản
- Thêm helper format label và map website -> brand.
- Thêm test cơ bản cho helper trình bày và percent.

- Tích hợp logo Maztech vào sidebar, header và trang đăng nhập.
- Đồng bộ màu nhận diện Maztech cho dashboard, report và các nút hành động chính.
