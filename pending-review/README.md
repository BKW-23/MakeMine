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

## Demo mockup bằng AI

Trang chi tiết sản phẩm có nút `Tạo bản demo bằng AI`. Chức năng này gọi
Gemini từ Vercel Function và cần biến môi trường server:

```text
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

Không thêm khóa này vào frontend hoặc commit vào GitHub. Nếu chưa cấu hình,
nút demo sẽ báo rằng AI preview chưa được bật.
