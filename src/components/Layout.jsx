import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import GiftAssistant from "@/components/GiftAssistant";

const NAV = [
  { to: "/", label: "Trang chủ" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/don-hang", label: "Đơn hàng" },
  { to: "/admin", label: "Quản trị" },
];

export default function Layout() {
  const { count } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground engraved">
                <img src="/favicon.png" alt="" className="h-full w-full object-cover" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Make<span className="text-primary">Mine</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((n) => {
                const active = location.pathname === n.to || (n.to !== "/" && location.pathname.startsWith(n.to));
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/gio-hang"
                className="relative grid h-10 w-10 place-items-center rounded-lg bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden grid h-10 w-10 place-items-center rounded-lg bg-secondary"
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        {open && (
          <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-lg font-bold">
              Make<span className="text-primary">Mine</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Quà tặng cá nhân hoá — móc khoá, gương, lược, kẹp tóc khắc tên. Co-creation lab cho người trẻ.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Khám phá</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/san-pham" className="hover:text-primary">Tất cả sản phẩm</Link></li>
              <li><Link to="/san-pham?category=gương" className="hover:text-primary">Gương khắc tên</Link></li>
              <li><Link to="/san-pham?category=kẹp tóc" className="hover:text-primary">Kẹp tóc</Link></li>
              <li><Link to="/don-hang" className="hover:text-primary">Theo dõi đơn hàng</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Liên hệ</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>ĐH FPT, TP. Hồ Chí Minh</li>
              <li>hotro@makemine.vn</li>
              <li>TikTok: @makemine</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MakeMine. Co-create your gift.
        </div>
      </footer>

      <GiftAssistant />
    </div>
  );
}