# MakeMine Project Documentation

## 1. Tổng quan

MakeMine là cửa hàng quà tặng cá nhân hóa, tập trung vào móc khóa, gương, lược
và kẹp tóc có thể khắc tên, màu sắc, font chữ và lời chúc. Ứng dụng cung cấp
catalog sản phẩm, giỏ hàng, đặt hàng COD, theo dõi đơn, trang quản trị và trợ lý
AI gợi ý quà tặng.

Stack triển khai hiện tại:

- Frontend: React 18, Vite, React Router, Tailwind CSS.
- Database và authentication: Supabase.
- Server API: Vercel Functions trong thư mục [api](api).
- AI: Google Gemini `gemini-2.5-flash`, chỉ được gọi từ server.
- Hosting/deploy: Vercel kết nối với branch `main` trên GitHub.

## 2. Cấu trúc repository

### Root

- [README.md](README.md): setup, biến môi trường và lệnh kiểm tra.
- [package.json](package.json): scripts và dependencies.
- [index.html](index.html): HTML entry, title và favicon tab.
- [public](public): các asset tĩnh, gồm ảnh mẫu và icon thương hiệu.
- [vite.config.js](vite.config.js): cấu hình Vite.
- [eslint.config.js](eslint.config.js): cấu hình ESLint.

### Frontend

- [src/App.jsx](src/App.jsx): router và provider.
- [src/main.jsx](src/main.jsx): bootstrap ứng dụng.
- [src/index.css](src/index.css): theme, animation và utility styles.
- [src/api/base44Client.js](src/api/base44Client.js): lớp tương thích tên cũ,
  nhưng runtime bên trong gọi Supabase REST và các API nội bộ.
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx): trạng thái đăng nhập.
- [src/lib/cart.jsx](src/lib/cart.jsx): giỏ hàng lưu trong localStorage.
- [src/lib/productImages.js](src/lib/productImages.js): dữ liệu ảnh, category
  và hàm định dạng giá.
- [src/pages](src/pages): Home, Catalog, ProductDetail, Cart, OrderTracking,
  Admin và các màn hình authentication.
- [src/components](src/components): layout, card sản phẩm, AI assistant và
  các component dùng chung.

### Backend API

- [api/_supabase.js](api/_supabase.js): helper gọi Supabase service role và
  kiểm tra bearer token.
- [api/me.js](api/me.js): trả về user hiện tại.
- [api/orders.js](api/orders.js): tạo đơn hàng.
- [api/orders-lookup.js](api/orders-lookup.js): tra cứu đơn hàng.
- [api/admin/products.js](api/admin/products.js): tạo và liệt kê sản phẩm admin.
- [api/admin/products/[id].js](api/admin/products/[id].js): xóa sản phẩm.
- [api/admin/orders.js](api/admin/orders.js): liệt kê đơn hàng admin.
- [api/admin/orders/[id].js](api/admin/orders/[id].js): cập nhật trạng thái đơn.
- [api/gift-suggestion.js](api/gift-suggestion.js): AI gợi ý sản phẩm.
- [api/generate-greeting.js](api/generate-greeting.js): AI tạo lời chúc.

### Database

- [supabase/migrations/001_init.sql](supabase/migrations/001_init.sql): schema,
  trigger profile, RLS và grants ban đầu.
- [supabase/migrations/002_security_hardening.sql](supabase/migrations/002_security_hardening.sql):
  giới hạn quyền đọc dữ liệu khách hàng và validation đơn hàng.
- [supabase/seed.sql](supabase/seed.sql): bảy sản phẩm mẫu với ảnh local trong
  `public/`.

Các migration và seed này được viết để có thể chạy lại an toàn trong Supabase
Preview. `001_init.sql` dùng `if not exists`, tạo lại trigger/policy cần thiết
mà không xóa bảng hoặc dữ liệu. `seed.sql` dùng `slug` làm conflict key nên sẽ
cập nhật sản phẩm mẫu thay vì tạo bản ghi trùng.

## 3. Mô hình dữ liệu Supabase

### `public.profiles`

- `id`: liên kết tới `auth.users.id`.
- `role`: `user` hoặc `admin`.
- `created_at`: thời điểm tạo profile.

Profile được tạo tự động bởi trigger `handle_new_user`.

### `public.products`

- `name`, `slug`, `category`.
- `base_price`, `short_description`, `image_url`.
- `customizable`, `colors`, `fonts`.
- `featured`, `stock`, `created_at`.

Sản phẩm được đọc công khai. Chỉ admin được tạo, sửa hoặc xóa.

### `public.orders`

- Thông tin khách: `customer_name`, `customer_phone`, `customer_email`,
  `address`.
- Giỏ hàng: `items` dạng JSON array.
- `total`, `status`, `preview_confirmed`, `user_id`, `created_at`.
- `status`: `pending`, `paid`, `shipped`, `delivered` hoặc `cancelled`.

Khách có thể tạo đơn. Dữ liệu đơn chỉ được đọc hoặc cập nhật qua server/admin
được xác thực.

### `public.chat_suggestions`

Lưu input và kết quả trợ lý AI để phục vụ lịch sử/analytics server-side:

- `user_query`, `occasion`, `recipient`, `budget`.
- `suggested_product_ids`, `suggestions`, `created_at`.

Client không được đọc trực tiếp bảng này.

## 4. Luồng runtime

### 4.1 Đọc sản phẩm

Frontend gọi `Product.list()` trong [src/api/base44Client.js](src/api/base44Client.js).
Khi đủ biến môi trường, request đi tới Supabase REST:

```text
/rest/v1/products?select=*&order=created_at.desc&limit=60
```

Khi chạy local chưa có biến Supabase, client dùng một sản phẩm mẫu local để
giao diện vẫn có thể xem và phát triển:

```text
/sample-product.png
```

Fallback này chỉ dành cho local thiếu cấu hình; môi trường production phải
được cấu hình Supabase đầy đủ.

### 4.2 Authentication

Authentication dùng Supabase Auth REST API:

- Login bằng email/password.
- Đăng ký tài khoản.
- Xác minh OTP.
- Gửi email reset password.
- Cập nhật password.
- OAuth provider qua Supabase authorize endpoint.

Session được lưu trong localStorage với key `makemine_supabase_session`.
Các API server nhận bearer token và xác thực lại token với Supabase trước khi
cho phép thao tác cần đăng nhập.

### 4.3 Đặt hàng

1. Người dùng chọn sản phẩm và tùy chỉnh tên/màu/font/lời chúc.
2. Item được lưu trong cart localStorage.
3. Người dùng nhập thông tin giao hàng và xác nhận preview.
4. Frontend gọi `POST /api/orders`.
5. Server validate dữ liệu và ghi vào `public.orders`.
6. UI hiển thị mã đơn hàng sau khi tạo thành công.

### 4.4 Theo dõi đơn

Trang `/don-hang` gọi endpoint tra cứu với mã đơn và số điện thoại.
Server chỉ trả dữ liệu phù hợp với thông tin tra cứu, không mở quyền đọc toàn
bộ bảng orders cho client.

### 4.5 Quản trị

Trang `/admin` yêu cầu user có `profiles.role = 'admin'`.

Admin có thể:

- Xem và cập nhật trạng thái đơn hàng.
- Tạo sản phẩm.
- Xóa sản phẩm.
- Xem số liệu sản phẩm/đơn hàng trong giao diện quản trị.

Việc kiểm tra role được thực hiện lại ở server, không chỉ dựa vào route guard
frontend.

### 4.6 AI gợi ý quà tặng

`POST /api/gift-suggestion`:

1. Nhận dịp tặng, người nhận và ngân sách.
2. Đọc danh sách sản phẩm từ Supabase bằng service role.
3. Gọi Gemini `gemini-2.5-flash`.
4. Lọc các `product_id` không tồn tại.
5. Trả về tối đa 5 gợi ý và lý do.
6. Lưu log vào `chat_suggestions`.

Gemini API key chỉ nằm ở server environment, không được đưa vào bundle browser.

### 4.7 AI tạo lời chúc

`POST /api/generate-greeting` nhận recipient, relationship, occasion, hobbies,
keywords và productName. Server gọi Gemini, parse JSON, làm sạch kết quả và
trả về tối đa 3 lời chúc tiếng Việt ngắn, không emoji.

## 5. UI/UX

- Header sticky có navigation, logo MakeMine và giỏ hàng.
- Logo badge dùng asset local [public/favicon.png](public/favicon.png).
- Favicon tab dùng asset tròn [public/tab-icon.png](public/tab-icon.png).
- Home có hero, category links, sản phẩm nổi bật và CTA mở AI assistant.
- Catalog hỗ trợ lọc category và sắp xếp theo giá.
- Product detail hỗ trợ preview tùy chỉnh và tạo lời chúc.
- Cart hiển thị item, số lượng, giá và form đặt hàng.
- Admin có giao diện quản lý sản phẩm/đơn.
- Ảnh dùng component độc lập trong [src/components/ui/image.jsx](src/components/ui/image.jsx);
  ảnh rỗng hoặc lỗi hiển thị fallback nội bộ, không gọi dịch vụ resize bên ngoài.

## 6. Setup local

### Cài dependencies

```bash
npm install
```

### Biến môi trường

Tạo `.env.local` ở root:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Không commit `.env.local`.

### Chuẩn bị database

Trong Supabase SQL Editor, với database mới chạy theo thứ tự:

1. [001_init.sql](supabase/migrations/001_init.sql)
2. [002_security_hardening.sql](supabase/migrations/002_security_hardening.sql)
3. [seed.sql](supabase/seed.sql)

Các file có thể được chạy lại khi cần; không xóa bảng để xử lý lỗi
`relation "profiles" already exists`. Nếu Preview vẫn hiển thị kết quả cũ,
hãy chạy lại check sau khi commit các thay đổi migration idempotent này.

### Chạy frontend

```bash
npm run dev
```

Hoặc để truy cập từ máy khác trong mạng local:

```bash
npm run dev -- --host 0.0.0.0
```

### Kiểm tra

```bash
npm run build
npm run lint
```

## 7. Cấu hình Vercel

Trong Vercel Project Settings, khai báo các biến sau cho Production:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

Sau khi thay đổi environment variables, cần redeploy để build frontend và
server functions nhận giá trị mới.

Không dùng tiền tố `VITE_` cho service role key hoặc Gemini key. Các key đó
chỉ được dùng trong [api](api).

## 8. Cấu hình Supabase Auth

Trong Supabase Authentication, cấu hình Site URL và Redirect URLs cho:

```text
http://localhost:5173
http://127.0.0.1:5173
https://makemine-bkw-23.vercel.app
```

Nếu bật Google OAuth, cấu hình provider trong Supabase và thêm callback URL
theo URL Supabase yêu cầu.

## 9. Tạo admin

1. Đăng ký tài khoản từ giao diện.
2. Chạy SQL sau trong Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'EMAIL_CUA_BAN'
);
```

3. Đăng xuất và đăng nhập lại để client nhận session mới.

## 10. Deploy và kiểm thử sau deploy

Push code lên branch `main`. Nếu Vercel đã kết nối GitHub repository, deploy sẽ
được kích hoạt tự động. Nếu không, chọn **Redeploy** trong Vercel.

Checklist:

- Trang chủ và catalog hiển thị sản phẩm.
- Ảnh sản phẩm tải được.
- Đăng ký, OTP, login và logout.
- Reset password.
- Thêm vào giỏ và tạo đơn.
- Tra cứu đơn.
- Tài khoản admin truy cập `/admin`.
- Admin tạo/xóa sản phẩm và cập nhật trạng thái đơn.
- AI gift suggestion.
- AI greeting generation.

## 11. Dữ liệu test local

- [gift.json](gift.json): payload test cho `/api/gift-suggestion`.
- [order.json](order.json): payload test cho `/api/orders`.

Đây là file test thủ công, không cần cho runtime production và không bắt buộc
push lên repository.

## 12. Hướng phát triển

- Thêm thanh toán online thay cho COD.
- Thêm upload ảnh qua Supabase Storage.
- Thêm image transformation nếu cần tối ưu ảnh dung lượng lớn.
- Tách API client khỏi tên tương thích cũ để code dễ hiểu hơn.
- Bổ sung test tự động cho API validation và các flow authentication.
- Thêm audit log cho thao tác admin.
