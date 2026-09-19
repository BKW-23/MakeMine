import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/cart";
import { imageFor, formatVND } from "@/lib/productImages";
import GreetingGenerator from "@/components/GreetingGenerator";

const DEFAULT_COLORS = ["Mint", "Lilac", "Trắng", "Đen", "Hồng"];
const DEFAULT_FONTS = ["Sans", "Script", "Mono"];
const STICKERS = [
  { id: "none", label: "Không sticker", emoji: "—" },
  { id: "hello-kitty", label: "Hello Kitty", emoji: "🎀" },
  { id: "bow", label: "Nơ", emoji: "🎀" },
  { id: "star", label: "Sao", emoji: "★" },
  { id: "heart", label: "Tim", emoji: "♥" },
  { id: "bear", label: "Gấu", emoji: "🐻" },
  { id: "flower", label: "Hoa", emoji: "✿" },
  { id: "sparkle", label: "Lấp lánh", emoji: "✦" },
];
const ENGRAVING_TYPES = [
  { id: "raised", label: "Khắc nổi" },
  { id: "engraved", label: "Khắc chìm" },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [font, setFont] = useState("");
  const [sticker, setSticker] = useState("none");
  const [engravingType, setEngravingType] = useState("raised");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [demoVisible, setDemoVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.list("-created_date", 60).then((all) => {
      const p = all.find((x) => x.slug === slug || x.id === slug);
      setProduct(p || null);
      if (p) {
        setColor((p.colors && p.colors[0]) || DEFAULT_COLORS[0]);
        setFont((p.fonts && p.fonts[0]) || DEFAULT_FONTS[0]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const colors = useMemo(() => (product?.colors?.length ? product.colors : DEFAULT_COLORS), [product]);
  const fonts = useMemo(() => (product?.fonts?.length ? product.fonts : DEFAULT_FONTS), [product]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20"><div className="h-96 rounded-2xl shimmer border border-border" /></div>;
  }
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <Link to="/san-pham" className="mt-4 inline-block text-primary hover:underline">← Về danh mục</Link>
      </div>
    );
  }

  const handleAdd = () => {
    const customization = product.customizable
      ? { name: name.trim(), color, font, sticker, engravingType, message: message || undefined }
      : {};
    addItem({
      key: product.id + JSON.stringify(customization),
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      unit_price: product.base_price,
      qty,
      customization,
      image: imageFor(product),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const colorHex = (c) => {
    const map = { Mint: "#00FFD1", Lilac: "#BB86FC", Trắng: "#F8F9FA", Đen: "#1A1A1C", Hồng: "#FF8FBC" };
    return map[c] || "#00FFD1";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/san-pham" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Tất cả sản phẩm
      </Link>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image — stationary, sticky */}
        <div className="md:sticky md:top-20 md:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-secondary">
            {imageFor(product) && (
              <img src={imageFor(product)} alt={product.name} className="h-full w-full object-cover" />
            )}
            {/* Live engraving preview overlay */}
            {product.customizable && demoVisible && (name.trim() || message || sticker !== "none") && (
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <div className="inline-block max-w-[90%] rounded-lg bg-background/80 backdrop-blur px-4 py-2" style={{ color: colorHex(color) }}>
                  {sticker !== "none" && (
                    <span className="mr-2 text-xl" aria-label="Sticker">
                      {STICKERS.find((item) => item.id === sticker)?.emoji}
                    </span>
                  )}
                  {name.trim() && (
                    <span
                      className="block text-2xl"
                      style={{
                        fontFamily: font === "Script" ? "'Brush Script MT', cursive" : font === "Mono" ? "ui-monospace, monospace" : "Inter, sans-serif",
                        fontWeight: font === "Script" ? 400 : 700,
                        textShadow: engravingType === "raised" ? "1px 1px 0 rgba(255,255,255,.55), 2px 2px 2px rgba(0,0,0,.18)" : "inset 0 1px 1px rgba(0,0,0,.35)",
                      }}
                    >
                      {name.trim()}
                    </span>
                  )}
                  {message && (
                    <span className="mt-1 block text-sm italic" style={{ fontFamily: "Quicksand, sans-serif" }}>
                      &ldquo;{message}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{product.category}</span>
            <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.short_description}</p>
          </div>

          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
            <button
              type="button"
              onClick={() => setDemoVisible(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-105 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {demoVisible ? "Cập nhật bản demo" : "Xem bản demo"}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Demo miễn phí chạy ngay trên trình duyệt, không cần AI hay billing.</p>
          </div>

          <div className="text-3xl font-bold text-primary">{formatVND(product.base_price)}</div>

          {product.customizable && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-semibold flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded bg-primary/15 text-primary text-xs font-mono">01</span>
                Tùy chỉnh khắc tên
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground font-mono">ENGRAVE NAME</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="Nhập tên cần khắc (tối đa 20 ký tự)"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 min-h-12"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground font-mono">COLOR</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${color === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                    >
                      <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ background: colorHex(c) }} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground font-mono">FONT</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFont(f)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${font === f ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                      style={{ fontFamily: f === "Script" ? "'Brush Script MT', cursive" : f === "Mono" ? "ui-monospace, monospace" : "Inter, sans-serif" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground font-mono">STICKER</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {STICKERS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSticker(item.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${sticker === item.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                      >
                        <span className="text-lg">{item.emoji}</span>{item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground font-mono">ENGRAVING STYLE</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ENGRAVING_TYPES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEngravingType(item.id)}
                        className={`rounded-lg border px-4 py-2 text-sm transition-colors ${engravingType === item.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <GreetingGenerator productName={product.name} onConfirm={setMessage} />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center hover:bg-secondary" aria-label="Giảm"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center hover:bg-secondary" aria-label="Tăng"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 min-h-12"
            >
              {added ? <><Check className="h-4 w-4" /> Đã thêm vào giỏ</> : <><ShoppingBag className="h-4 w-4" /> Thêm vào giỏ</>}
            </button>
          </div>

          <button
            onClick={() => { handleAdd(); navigate("/gio-hang"); }}
            className="text-sm font-medium text-primary hover:underline self-start"
          >
            Mua ngay →
          </button>
        </div>
      </div>
    </div>
  );
}