export const STICKERS = [
  { id: "none", label: "Không sticker", emoji: "—", image: null },
  { id: "bow", label: "Nơ xinh xinh", emoji: "🎀", image: "/stickers/bow.jpg" },
  { id: "heart", label: "Tim tí hon", emoji: "♡", image: "/stickers/heart.jpg" },
  { id: "hello-kitty", label: "Kitty miu miu", emoji: "♡", image: "/stickers/hello-kitty.jpg" },
  { id: "star", label: "Sao lấp lánh", emoji: "★", image: "/stickers/star.jpg" },
  { id: "bear", label: "Gấu mũm mĩm", emoji: "🐻", image: "/stickers/bear.jpg" },
  { id: "sparkle", label: "Lấp la lấp lánh", emoji: "✦", image: "/stickers/sparkle.jpg" },
];

export const stickerLabel = (id) =>
  STICKERS.find((sticker) => sticker.id === id)?.label || id;
