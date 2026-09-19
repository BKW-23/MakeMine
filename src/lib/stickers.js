export const STICKERS = [
  { id: "none", label: "Không sticker", emoji: "—", image: null },
  { id: "bow", label: "Nơ", emoji: "🎀", image: "/stickers/bow.jpg" },
  { id: "heart", label: "Tim", emoji: "♡", image: "/stickers/heart.jpg" },
  { id: "hello-kitty", label: "Hello Kitty", emoji: "♡", image: "/stickers/hello-kitty.jpg" },
  { id: "star", label: "Sao", emoji: "★", image: "/stickers/star.jpg" },
  { id: "bear", label: "Gấu tổng hợp", emoji: "🐻", image: "/stickers/bear.jpg" },
  { id: "sparkle", label: "Lấp lánh", emoji: "✦", image: "/stickers/sparkle.jpg" },
];

export const stickerLabel = (id) =>
  STICKERS.find((sticker) => sticker.id === id)?.label || id;
