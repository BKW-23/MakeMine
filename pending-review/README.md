# Pending review

Thư mục này chứa các file payload thử nghiệm chưa thuộc runtime chính của
MakeMine:

- `gift.json`: dữ liệu mẫu cho API gợi ý quà tặng.
- `order.json`: dữ liệu mẫu cho luồng tạo đơn.
- `start-local.sh`: bật Vite local tại `http://127.0.0.1:5173`.

## Chạy local

Từ Git Bash, WSL hoặc macOS/Linux:

```bash
chmod +x pending-review/start-local.sh
./pending-review/start-local.sh
```

Hoặc chạy trực tiếp từ thư mục gốc:

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Script không tự tạo hoặc đọc secret. Nếu cần Supabase local, tạo `.env.local`
ở thư mục gốc theo hướng dẫn trong [README.md](../README.md), và không commit
file đó.

Các JSON trong thư mục này chỉ là payload test; không được dùng làm dữ liệu
production nếu chưa kiểm tra và chuẩn hóa.

## Demo mockup miễn phí

Trang chi tiết sản phẩm có nút `Xem bản demo`. Demo được ghép trực tiếp trên
trình duyệt từ ảnh sản phẩm, tên, sticker và kiểu khắc đã chọn. Chức năng này
không gọi API tạo ảnh và không cần billing.
