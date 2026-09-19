export const STICKERS = [
  { id: "none", label: "Không sticker", emoji: "—", image: null },
  { id: "bow", label: "Nơ", emoji: "🎀", image: "/stickers/bow.jpg" },
  { id: "heart", label: "Tim", emoji: "♡", image: "/stickers/heart.jpg" },
  { id: "cute", label: "Cute tổng hợp", emoji: "☁", image: "/stickers/cute.jpg" },
  { id: "star", label: "Sao", emoji: "★", image: "/stickers/star.jpg" },
  { id: "bear", label: "Gấu tổng hợp", emoji: "🐻", image: "/stickers/bear.jpg" },
  { id: "sparkle", label: "Lấp lánh", emoji: "✦", image: "/stickers/sparkle.jpg" },
];

export const stickerLabel = (id) =>
  STICKERS.find((sticker) => sticker.id === id)?.label || id;
