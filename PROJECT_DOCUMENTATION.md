# MakeMine Project Documentation

## 1. Tổng quan dự án

MakeMine là một ứng dụng thương mại điện tử theo hướng quà tặng cá nhân hóa, tập trung vào các sản phẩm như móc khóa, gương, lược và kẹp tóc có thể khắc tên, màu sắc, font chữ và lời chúc tùy chỉnh. Sản phẩm hướng tới người dùng trẻ, với trải nghiệm mua sắm nhẹ, hiện đại và có tính tương tác cao nhờ các tính năng AI gợi ý quà tặng.

Tên thương hiệu được thể hiện trong giao diện: "Make It Yours" / "Co-Creation Lab". Dự án dựa trên Base44 platform, tích hợp frontend React + backend entities/functions và SDK của Base44 để quản lý dữ liệu, xác thực người dùng và gọi AI.

### Mục tiêu chính

- Hiển thị danh mục sản phẩm quà tặng cá nhân hóa.
- Cho phép người dùng xem chi tiết sản phẩm, tùy chỉnh khắc tên và lời chúc.
- Tạo giỏ hàng và đặt hàng theo kiểu COD.
- Theo dõi đơn hàng và cập nhật trạng thái trong admin.
- Cung cấp trợ lý AI để gợi ý quà tặng dựa trên dịp, người nhận và ngân sách.
- Quản lý sản phẩm và đơn hàng trong dashboard admin.

---

## 2. Công nghệ sử dụng

Dự án này là một ứng dụng frontend React chạy trên Vite, tích hợp với Base44 SDK và Base44 backend.

### Stack chính

- React 18
- Vite
- JavaScript (JSX)
- Tailwind CSS
- React Router DOM
- TanStack React Query
- Radix UI
- Framer Motion
- Lucide React
- Base44 SDK
- Base44 functions / entities / auth

### Công cụ hỗ trợ

- ESLint
- TypeScript cho config và typing hỗ trợ
- PostCSS + Autoprefixer
- Shadcn/ui-style component system trong thư mục ui

### Tham chiếu kỹ thuật chính

- [package.json](package.json)
- [vite.config.js](vite.config.js)
- [tailwind.config.js](tailwind.config.js)
- [src/App.jsx](src/App.jsx)
- [src/api/base44Client.js](src/api/base44Client.js)

---

## 3. Kiến trúc tổng thể

Dự án có 2 tầng chính:

1. Frontend React
   - Render UI, routing, state, tương tác người dùng
   - Gọi Base44 SDK để lấy dữ liệu, tạo đơn hàng, xác thực, gọi function AI

2. Backend Base44
   - Entities: Product, Order, ChatSuggestion, User
   - Functions: generateGreeting, giftSuggestion
   - Auth và app public settings
   - AI integration via Core.InvokeLLM

### Cấu trúc tổng thể

- Root config / Base44 data model: [$root/config.json]($root/config.json), [$root/entities]($root/entities), [$root/functions]($root/functions)
- Frontend source: [src](src)
- UI component library: [src/components/ui](src/components/ui)
- Pages: [src/pages](src/pages)
- Shared logic: [src/lib](src/lib)

---

## 4. Cấu trúc thư mục chính

### 4.1 Root

- [README.md](README.md): hướng dẫn setup/local dev
- [package.json](package.json): scripts và dependencies
- [index.html](index.html): entry HTML
- [components.json](components.json): cấu hình component system
- [eslint.config.js](eslint.config.js): lint rules
- [jsconfig.json](jsconfig.json): alias config
- [$root/config.json]($root/config.json): Base44 project config

### 4.2 src/

- [src/App.jsx](src/App.jsx): định nghĩa router và provider
- [src/main.jsx](src/main.jsx): bootstrap app
- [src/index.css](src/index.css): global styles, theme, utility classes

#### API và auth

- [src/api/base44Client.js](src/api/base44Client.js): client Base44 SDK
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx): quản lý auth và public settings
- [src/lib/cart.jsx](src/lib/cart.jsx): cart store lưu localStorage
- [src/lib/app-params.js](src/lib/app-params.js): appId/token configuration

#### Pages

- [src/pages/Home.jsx](src/pages/Home.jsx): trang chủ, featured products, hero
- [src/pages/Catalog.jsx](src/pages/Catalog.jsx): danh sách sản phẩm, lọc theo category
- [src/pages/ProductDetail.jsx](src/pages/ProductDetail.jsx): chi tiết, tùy chỉnh khắc tên
- [src/pages/Cart.jsx](src/pages/Cart.jsx): giỏ hàng và đặt hàng
- [src/pages/OrderTracking.jsx](src/pages/OrderTracking.jsx): theo dõi đơn hàng
- [src/pages/Admin.jsx](src/pages/Admin.jsx): quản trị sản phẩm và đơn hàng

#### Components

- [src/components/Layout.jsx](src/components/Layout.jsx): header/footer/navigation + floating gift assistant
- [src/components/GiftAssistant.jsx](src/components/GiftAssistant.jsx): AI assistant panel
- [src/components/GreetingGenerator.jsx](src/components/GreetingGenerator.jsx): tạo lời chúc
- [src/components/ProductCard.jsx](src/components/ProductCard.jsx): card sản phẩm
- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx): route guard (nếu có dùng)

#### UI library

- [src/components/ui](src/components/ui): các component tái sử dụng như button, dialog, card, input, select, tabs...

---

## 5. Luồng vận hành chính

### 5.1 Luồng xem sản phẩm

- Người dùng truy cập trang chủ.
- [src/pages/Home.jsx](src/pages/Home.jsx) gọi `base44.entities.Product.list(...)` để lấy danh sách sản phẩm.
- Trang chủ hiển thị banner và sản phẩm nổi bật.
- Người dùng click vào danh mục hoặc vào sản phẩm để đi đến trang chi tiết.

### 5.2 Luồng đặt hàng

- Người dùng chọn sản phẩm ở [src/pages/ProductDetail.jsx](src/pages/ProductDetail.jsx).
- Nếu `customizable` là true, người dùng có thể nhập tên, chọn màu, font và lời chúc.
- Khi bấm "Thêm vào giỏ", dữ liệu được lưu trong [src/lib/cart.jsx](src/lib/cart.jsx).
- Trên giỏ hàng [src/pages/Cart.jsx](src/pages/Cart.jsx), hệ thống hiển thị chi tiết sản phẩm và form thông tin người nhận.
- Khi submit, hệ thống tạo một `Order` trong Base44 entity:
  - `customer_name`
  - `customer_phone`
  - `customer_email`
  - `address`
  - `items`
  - `total`
  - `status`
  - `preview_confirmed`

### 5.3 Luồng admin

- Truy cập route `/admin` trong [src/pages/Admin.jsx](src/pages/Admin.jsx).
- Admin có 2 tab:
  - Sản phẩm: thêm, xoá sản phẩm
  - Đơn hàng: xem danh sách, cập nhật trạng thái (`pending`, `paid`, `shipped`, `delivered`, `cancelled`)
- Dữ liệu được lấy từ `Product` và `Order` entities.

### 5.4 Luồng AI gợi ý quà tặng

- Người dùng mở floating assistant trong [src/components/GiftAssistant.jsx](src/components/GiftAssistant.jsx).
- Form nhận 3 input: dịp tặng, người nhận, ngân sách.
- Gọi Base44 function `giftSuggestion` ở [$root/functions/giftSuggestion/entry.ts]($root/functions/giftSuggestion/entry.ts).
- Function:
  - lấy danh sách sản phẩm từ entity `Product`
  - tạo prompt cho LLM
  - yêu cầu trả JSON gồm `suggestions` và `ly_do`
  - lọc theo product_id hợp lệ
  - lưu `ChatSuggestion` để log câu hỏi và gợi ý

### 5.5 Luồng tạo lời chúc

- Trên chi tiết sản phẩm, `GreetingGenerator` cho phép tạo lời chúc theo người nhận, mối quan hệ, dịp, sở thích và keywords.
- Gọi Base44 function `generateGreeting` ở [$root/functions/generateGreeting/entry.ts]($root/functions/generateGreeting/entry.ts).
- Function kiểm tra auth user bằng `base44.auth.me()`, yêu cầu thông tin tối thiểu, gọi LLM và trả về 3 lời chúc phù hợp để in lên sản phẩm.

---

## 6. Entity và dữ liệu Base44

### 6.1 Entity Product

File: [$root/entities/Product.json]($root/entities/Product.json)

Các trường chính:

- `name`: tên sản phẩm
- `slug`: slug URL
- `category`: enum gồm `móc khoá`, `gương`, `lược`, `kẹp tóc`, `khác`
- `base_price`: giá gốc
- `short_description`: mô tả ngắn
- `image_url`: hình ảnh sản phẩm
- `customizable`: cho phép khắc tên hay không
- `colors`: mảng màu
- `fonts`: mảng font
- `featured`: sản phẩm nổi bật
- `stock`: số lượng tồn kho

### 6.2 Entity Order

File: [$root/entities/Order.json]($root/entities/Order.json)

Các trường chính:

- `customer_name`
- `customer_phone`
- `customer_email`
- `address`
- `items`: array của object chứa `product_id`, `name`, `quantity`, `unit_price`, `customization`
- `total`
- `status`: `pending`, `paid`, `shipped`, `delivered`, `cancelled`
- `preview_confirmed`

### 6.3 Entity ChatSuggestion

File: [$root/entities/ChatSuggestion.json]($root/entities/ChatSuggestion.json)

Dùng để lưu trữ lịch sử người dùng tương tác AI:

- `user_query`
- `occasion`
- `recipient`
- `budget`
- `suggested_product_ids`
- `suggestions`

### 6.4 Entity User

File: [$root/entities/User.json]($root/entities/User.json)

- `role`: `admin` | `user`

---

## 7. Base44 Functions

### 7.1 giftSuggestion

File: [$root/functions/giftSuggestion/entry.ts]($root/functions/giftSuggestion/entry.ts)

Nhiệm vụ:

- nhận `occasion`, `recipient`, `budget`
- đọc danh sách `Product`
- tạo prompt để LLM chọn ra 3–5 sản phẩm phù hợp
- trả về JSON chứa `suggestions` với `product_id` và `ly_do`
- lưu log `ChatSuggestion`

### 7.2 generateGreeting

File: [$root/functions/generateGreeting/entry.ts]($root/functions/generateGreeting/entry.ts)

Nhiệm vụ:

- xác thực người dùng qua `base44.auth.me()`
- nhận dữ liệu lời chúc: recipient, relationship, occasion, hobbies, keywords, productName
- tạo 3 lời chúc ngắn, tự nhiên, phù hợp để in lên đồ quà
- trả về JSON `greetings`

---

## 8. Authentication và session flow

Auth được quản lý trong [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx).

Cách hoạt động:

- Gọi `base44.app.getPublicSettings()` để kiểm tra cấu hình app công khai.
- Nếu có token, gọi `base44.auth.me()` để xác định trạng thái đăng nhập.
- Nếu chưa đăng nhập hoặc lỗi auth, redirect tới login bằng `base44.auth.redirectToLogin(...)`.
- Nếu user không đăng ký, hiển thị [src/components/UserNotRegisteredError.jsx](src/components/UserNotRegisteredError.jsx).

Điểm quan trọng: trong Base44 app, `appParams` chứa `appId`, `token`, `functionsVersion`, `appBaseUrl` được đọc trong [src/lib/app-params.js](src/lib/app-params.js).

---

## 9. UI/UX và giao diện chính

### 9.1 Layout

[src/components/Layout.jsx](src/components/Layout.jsx) chứa:

- sticky header
- navigation
- giỏ hàng với badge số lượng
- floating button "Gợi ý quà tặng"
- footer
- render `GiftAssistant`

### 9.2 Style system

- Tailwind CSS với theme màu pastel và phong cách brand youthful.
- Các component được thiết kế theo style hiện đại, nhiều corner radius, tông màu hồng/lilac/green pastel.
- Dùng utility class `glass`, `engraved`, `pulse-ring`, `shimmer` trong [src/index.css](src/index.css).

### 9.3 Trải nghiệm mua sắm

- Trang chủ có hero, CTA, AI prompt, sản phẩm nổi bật.
- Trang catalog có filter danh mục và sắp xếp giá.
- Trang product detail có live preview khắc tên.
- Trang cart hỗ trợ xác nhận mẫu khắc trước khi đặt hàng.
- Admin có khả năng quản lý nhanh các sản phẩm và đơn hàng.

---

## 10. Cách chạy dự án ở local

Theo [README.md](README.md), quy trình local dev là:

```bash
base44 login
base44 link
base44 dev
```

### Lưu ý quan trọng

- Mỗi clone mới cần `base44 link`.
- Không nên chạy `npm run dev` một mình khi làm việc với Base44 backend vì sẽ thiếu proxy / API và dẫn đến gọi sai backend.
- `base44 dev` tự chạy Vite thông qua `site.serveCommand` trong [$root/config.json]($root/config.json).
- Nếu chưa publish app, UI có thể không load đúng cách khi dev local.

### Frontend-only mode

```bash
base44 dev --remote
```

Mode này kết nối với backend hosted production, dùng cho frontend mà không cần local backend toàn bộ.

---

## 11. Cấu hình Base44 và publish

File cấu hình chính:

- [$root/config.json]($root/config.json)

Cấu hình gốc cho app Base44 bao gồm:

- `installCommand`: `npm install`
- `buildCommand`: `npm run build`
- `serveCommand`: `npm run dev`
- `outputDirectory`: `./dist`

Sau khi push code lên repo, app cần được publish qua dashboard Base44 thay vì deploy CLI trực tiếp, như hướng dẫn trong [README.md](README.md).

---

## 12. Quy trình nghiệp vụ đầy đủ

### 12.1 Từ khi mở app

1. App khởi tạo `AuthProvider` và `QueryClientProvider` trong [src/App.jsx](src/App.jsx).
2. Kiểm tra app public settings và auth status.
3. Nếu chưa đăng nhập, chuyển hướng Login.
4. Hiển thị layout và router.

### 12.2 Người dùng chọn quà

1. Vào Home hoặc Catalog.
2. Lọc theo category hoặc xem featured products.
3. Bấm vào sản phẩm.
4. Chọn tùy chỉnh như tên, màu, font, lời chúc.
5. Thêm vào giỏ hàng.

### 12.3 Xác nhận mua hàng

1. Chuyển tới `/gio-hang`.
2. Xem lại item và customization.
3. Nhập thông tin nhận hàng.
4. Xác nhận preview khắc.
5. Tạo `Order` trong Base44.
6. Chuyển sang trạng thái thành công, hiển thị mã đơn hàng.

### 12.4 Theo dõi và quản lý đơn

- Route `/don-hang` dùng để xem trạng thái đơn.
- Admin ở `/admin` cập nhật tiến độ.

---

## 13. Điểm mạnh của project

- Tích hợp Base44 mạnh, giảm thời gian setup backend và auth.
- Thương mại điện tử rõ ràng, phù hợp với mô hình quà tặng cá nhân hóa.
- AI assistant mang tính cạnh tranh và tạo trải nghiệm khác biệt.
- Có admin quản trị trực tiếp trên frontend.
- Cấu trúc component và page rõ ràng, dễ mở rộng thêm tính năng mới.

---

## 14. Các điểm cần lưu ý khi phát triển tiếp

- Nên tách dữ liệu cart và order logic thành các custom hooks rõ ràng hơn nếu dự án mở rộng.
- Có thể thêm validation mạnh hơn cho form đặt hàng và form admin.
- Có thể thêm hệ thống thanh toán online thay cho COD trong tương lai.
- Có thể mở rộng `Product` với `inventory`, `description`, `attributes`, `tags` để quản lý tốt hơn.
- Có thể thêm tính năng lưu lịch sử đặt hàng và phân quyền admin theo role.
- Cần kiểm tra localStorage cart khi app load trên môi trường SSR hoặc browser mới.

---

## 15. Tóm tắt ngắn

MakeMine là một app thương mại điện tử quà tặng cá nhân hóa, chạy trên React + Vite + Base44, với các tính năng chính: danh mục sản phẩm, tùy biến khắc tên, AI gợi ý quà, giỏ hàng, đặt hàng, quản trị sản phẩm và đơn hàng. Dự án kết hợp frontend hiện đại với backend entity/function native của Base44 và AI integration, tạo nên trải nghiệm bán hàng và tư vấn quà tặng theo hướng người dùng trẻ, cá nhân hóa cao.

---

## 16. Tài liệu tham khảo trong repo

- [README.md](README.md)
- [package.json](package.json)
- [src/App.jsx](src/App.jsx)
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx)
- [src/components/GiftAssistant.jsx](src/components/GiftAssistant.jsx)
- [src/pages/Admin.jsx](src/pages/Admin.jsx)
- [src/pages/Cart.jsx](src/pages/Cart.jsx)
- [src/pages/ProductDetail.jsx](src/pages/ProductDetail.jsx)
- [$root/entities/Product.json]($root/entities/Product.json)
- [$root/entities/Order.json]($root/entities/Order.json)
- [$root/functions/giftSuggestion/entry.ts]($root/functions/giftSuggestion/entry.ts)
- [$root/functions/generateGreeting/entry.ts]($root/functions/generateGreeting/entry.ts)
