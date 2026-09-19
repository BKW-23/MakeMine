export const STICKERS = [
  { id: "none", label: "Không sticker", emoji: "—" },
  { id: "bow", label: "Nơ", emoji: "🎀" },
  { id: "heart", label: "Tim", emoji: "♡" },
  { id: "cute", label: "Cute tổng hợp", emoji: "☁" },
  { id: "star", label: "Sao", emoji: "★" },
  { id: "bear", label: "Gấu tổng hợp", emoji: "🐻" },
  { id: "sparkle", label: "Lấp lánh", emoji: "✦" },
];

export const stickerLabel = (id) =>
  STICKERS.find((sticker) => sticker.id === id)?.label || id;
