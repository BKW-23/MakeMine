import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleHelp } from "lucide-react";

export default function Guide() {
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
          <CircleHelp className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">Hướng dẫn mua hàng</h1>
          <p className="text-sm text-muted-foreground">Từ chọn sản phẩm đến nhận hàng</p>
        </div>
      </div>
      <div className="space-y-6">
        {[
          ["1", "Chọn sản phẩm", "Vào Sản phẩm, chọn món quà phù hợp và xem thông tin chi tiết."],
          ["2", "Cá nhân hóa", "Nhập tên, chọn màu, font chữ và lời chúc. Xem trước mẫu khắc trước khi thêm vào giỏ."],
          ["3", "Kiểm tra giỏ hàng", "Kiểm tra số lượng, nội dung khắc và tổng tiền trong giỏ hàng."],
          ["4", "Đặt COD", "Điền họ tên, số điện thoại, email (nếu muốn) và địa chỉ giao hàng. Tích xác nhận rồi bấm Đặt hàng (COD)."],
          ["5", "Theo dõi đơn", "Dùng mã đơn hàng sau khi đặt để tra cứu. Nếu đã đăng nhập, lịch sử đơn nằm trong menu avatar."],
        ].map(([number, title, text]) => (
          <section key={number} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{number}</span>
            <div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div>
          </section>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6">
        <strong>Lưu ý:</strong> MakeMine hiện thanh toán khi nhận hàng (COD). Nhân viên sẽ liên hệ xác nhận trước khi giao.
      </div>
      <Link to="/dieu-khoan" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Đọc điều khoản sử dụng →</Link>
    </div>
  );
}
