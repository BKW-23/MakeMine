import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <FileText className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">Điều khoản sử dụng</h1>
          <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 19/09/2026</p>
        </div>
      </div>
      <div className="space-y-8 rounded-3xl border border-border bg-card p-6 leading-7 shadow-sm md:p-8">
        <section><h2 className="mb-2 text-xl font-semibold">1. Đặt hàng và cá nhân hóa</h2><p>Vui lòng kiểm tra tên khắc, màu sắc, font chữ và lời chúc trước khi đặt. Sản phẩm cá nhân hóa được làm theo thông tin khách hàng đã xác nhận.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold">2. Giá và thanh toán</h2><p>Giá hiển thị chưa bao gồm phí giao hàng nếu chưa được ghi rõ. MakeMine hiện hỗ trợ thanh toán khi nhận hàng (COD). Nhân viên sẽ liên hệ xác nhận đơn trước khi giao.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold">3. Giao hàng và kiểm tra</h2><p>Thời gian giao phụ thuộc địa chỉ và đơn vị vận chuyển. Khách nên kiểm tra sản phẩm khi nhận và liên hệ MakeMine sớm nếu đơn có dấu hiệu hư hỏng hoặc sai thông tin.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold">4. Đổi, hủy và hỗ trợ</h2><p>Đơn có thể được yêu cầu hủy trước khi bắt đầu gia công. Với sản phẩm cá nhân hóa bị lỗi do MakeMine, vui lòng gửi mã đơn và hình ảnh để được hỗ trợ.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold">5. Thông tin cá nhân</h2><p>MakeMine chỉ sử dụng thông tin nhận hàng và liên hệ để xử lý đơn, giao hàng và hỗ trợ khách hàng; không bán thông tin cá nhân cho bên thứ ba.</p></section>
        <p className="border-t border-border pt-5 text-sm text-muted-foreground">Cần hỗ trợ? Liên hệ <a className="text-primary hover:underline" href="mailto:hotro@makemine.vn">hotro@makemine.vn</a>.</p>
      </div>
      <Link to="/huong-dan" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Xem hướng dẫn mua hàng →</Link>
    </div>
  );
}
