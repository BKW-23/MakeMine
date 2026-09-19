import React, { useMemo, useState } from "react";
import { Copy, RotateCcw, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { STICKERS } from "@/lib/stickers";

const TINTS = [
  { id: "original", label: "Gốc", hex: null },
  { id: "pearl", label: "Trắng ngọc trai", hex: "#ffffff" },
  { id: "silver", label: "Bạc ánh trăng", hex: "#cbd5e1" },
  { id: "gold", label: "Vàng nắng", hex: "#facc15" },
  { id: "pink", label: "Hồng kẹo", hex: "#f472b6" },
  { id: "blue", label: "Xanh mây", hex: "#7dd3fc" },
];

const CROP_POSITIONS = {
  bow: "48% 42%",
  heart: "55% 55%",
  "hello-kitty": "45% 48%",
  star: "52% 48%",
  bear: "48% 52%",
  sparkle: "50% 42%",
};

const stickerCropStyle = (sticker) => ({
  backgroundImage: `url(${sticker.image})`,
  backgroundPosition: CROP_POSITIONS[sticker.id] || "50% 50%",
  backgroundRepeat: "no-repeat",
  backgroundSize: "320%",
});

export default function DesignStudioModal({ product, name, message, colorHex, onClose }) {
  const availableStickers = useMemo(() => STICKERS.filter((item) => item.image), []);
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tint, setTint] = useState("original");
  const [opacity, setOpacity] = useState(100);
  const [scale, setScale] = useState(1);

  const selected = layers.find((layer) => layer.id === selectedId);

  const addSticker = (sticker) => {
    const layer = {
      id: `${sticker.id}-${Date.now()}`,
      sticker,
      x: 50,
      y: 50,
      scale: 1,
      opacity: 100,
    };
    setLayers((current) => [...current, layer]);
    setSelectedId(layer.id);
  };

  const updateSelected = (changes) => {
    setLayers((current) => current.map((layer) => (
      layer.id === selectedId ? { ...layer, ...changes } : layer
    )));
  };

  const reset = () => {
    setLayers([]);
    setSelectedId(null);
    setTint("original");
    setOpacity(100);
    setScale(1);
  };

  const handleDrag = (event, layer) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLayer = { ...layer };
    const workspaceRect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!workspaceRect) return;
    const move = (moveEvent) => {
      updateSelected({
        x: Math.min(92, Math.max(8, startLayer.x + ((moveEvent.clientX - startX) / workspaceRect.width) * 100)),
        y: Math.min(92, Math.max(8, startLayer.y + ((moveEvent.clientY - startY) / workspaceRect.height) * 100)),
      });
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  const handleResize = (event, layer) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startScale = layer.scale;
    const move = (moveEvent) => {
      const distance = Math.max(moveEvent.clientX - startX, moveEvent.clientY - startY);
      const nextScale = Math.min(2.5, Math.max(0.45, startScale + distance / 180));
      setScale(nextScale);
      updateSelected({ scale: nextScale });
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold">
              MakeMine Design Studio
              <span className="rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] text-pink-300">Xinh xắn 1.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Phối sticker và tạo mẫu quà riêng của bạn</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800">
            <RotateCcw className="h-3.5 w-3.5" /> Làm mới
          </button>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800" aria-label="Đóng studio">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 p-3 sm:flex">
          <div className="mb-3 flex items-center gap-2 border-b border-pink-500 pb-3 text-sm font-semibold text-pink-300">
            <Sparkles className="h-4 w-4" /> Kho sticker
          </div>
          <p className="mb-3 text-[11px] text-slate-400">Bấm vào mẫu để thêm vào thiết kế</p>
          <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1">
            {availableStickers.map((item) => (
              <button key={item.id} type="button" onClick={() => addSticker(item)} className="group rounded-xl border border-slate-800 bg-slate-900 p-2 text-left hover:border-pink-500">
                <span
                  role="img"
                  aria-label={item.label}
                  className="block aspect-square w-full rounded-lg bg-slate-800 transition group-hover:scale-105"
                  style={stickerCropStyle(item)}
                />
                <span className="mt-1 block truncate text-[11px] text-slate-300 group-hover:text-pink-300">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="checkerboard-bg relative flex min-w-0 flex-1 items-center justify-center overflow-hidden p-5">
          <div className="relative aspect-square w-full max-w-[min(72vh,680px)] overflow-hidden rounded-2xl border border-slate-700/70 bg-white shadow-2xl">
            <img src={product.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
              <div className="mx-auto w-fit rounded-xl bg-white/85 px-4 py-2 text-center backdrop-blur">
                {name && <div className="text-2xl font-bold" style={{ color: colorHex }}>{name}</div>}
                {message && <div className="mt-1 text-xs italic text-slate-700">“{message}”</div>}
              </div>
            </div>
            {layers.map((layer) => {
              const selectedLayer = layer.id === selectedId;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onPointerDown={(event) => { event.stopPropagation(); setSelectedId(layer.id); handleDrag(event, layer); }}
                  className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl p-1 ${selectedLayer ? "ring-2 ring-pink-400 ring-offset-2 ring-offset-transparent" : ""}`}
                  style={{ left: `${layer.x}%`, top: `${layer.y}%`, opacity: layer.opacity / 100, transform: `translate(-50%, -50%) scale(${layer.scale})` }}
                >
                  <span
                    role="img"
                    aria-label={layer.sticker.label}
                    className="block h-full w-full rounded-lg bg-slate-100"
                    style={{
                      ...stickerCropStyle(layer.sticker),
                      filter: tint !== "original" ? `sepia(1) saturate(3) hue-rotate(${tint === "blue" ? "145deg" : tint === "pink" ? "290deg" : "0deg"})` : "none",
                    }}
                  />
                  {selectedLayer && (
                    <>
                      <span className="pointer-events-none absolute -inset-1 rounded border-2 border-blue-500" />
                      <span className="pointer-events-none absolute -left-1 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full bg-blue-500" />
                      <span className="pointer-events-none absolute -right-1 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full bg-blue-500" />
                      <span
                        role="presentation"
                        onPointerDown={(event) => handleResize(event, layer)}
                        className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-blue-500 shadow"
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-xs text-slate-300 shadow-xl">
            Kéo thả sticker trực tiếp để sắp xếp mẫu
          </div>
        </main>

        <aside className="hidden w-72 shrink-0 flex-col border-l border-slate-800 bg-slate-950 sm:flex">
          <div className="flex items-center gap-2 border-b border-slate-800 p-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-pink-400" /> Tùy chỉnh sticker
          </div>
          <div className="space-y-5 border-b border-slate-800 p-4">
            <div>
              <p className="mb-2 text-[11px] text-slate-400">Màu hiệu ứng / ánh kim</p>
              <div className="grid grid-cols-3 gap-2">
                {TINTS.map((item) => <button key={item.id} type="button" title={item.label} onClick={() => setTint(item.id)} className={`h-8 rounded border text-[10px] ${tint === item.id ? "border-pink-400" : "border-slate-700"}`} style={{ background: item.hex || "#1e293b", color: item.hex ? "#334155" : "#cbd5e1" }}>{item.id === "original" ? "Gốc" : ""}</button>)}
              </div>
            </div>
            <label className="block text-[11px] text-slate-400">Độ trong suốt: {opacity}%
              <input type="range" min="10" max="100" value={opacity} onChange={(event) => { setOpacity(event.target.value); updateSelected({ opacity: event.target.value }); }} className="mt-2 w-full accent-pink-500" disabled={!selected} />
            </label>
            <label className="block text-[11px] text-slate-400">Kích thước: {scale.toFixed(1)}x
              <input type="range" min="0.5" max="2.5" step="0.1" value={scale} onChange={(event) => { setScale(Number(event.target.value)); updateSelected({ scale: Number(event.target.value) }); }} className="mt-2 w-full accent-pink-500" disabled={!selected} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => selected && addSticker(selected.sticker)} className="rounded-lg border border-slate-700 p-2 text-[11px] text-slate-300 hover:bg-slate-800"><Copy className="mx-auto mb-1 h-4 w-4" />Nhân bản</button>
              <button type="button" onClick={() => { setLayers((current) => current.filter((layer) => layer.id !== selectedId)); setSelectedId(null); }} className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[11px] text-rose-300 hover:bg-rose-500/20"><Trash2 className="mx-auto mb-1 h-4 w-4" />Xóa hình</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300"><span>Danh sách layer</span><span className="text-slate-500">{layers.length} hình</span></div>
            {layers.map((layer) => (
              <button key={layer.id} type="button" onClick={() => setSelectedId(layer.id)} className={`mb-1 flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs ${layer.id === selectedId ? "bg-pink-500/15 text-pink-200" : "text-slate-400 hover:bg-slate-900"}`}>
                <span className="h-8 w-8 shrink-0 rounded bg-slate-800" style={stickerCropStyle(layer.sticker)} />
                {layer.sticker.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
