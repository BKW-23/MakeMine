// Generated product imagery (permanent CDN URLs).
export const heroImage = "https://media.base44.com/images/public/6aa840995e828a5595335fd5/bc50975ba_generated_79f14ae8.jpg";

export const productImages = {
  "moc-khoa-acrylic": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/ad42c9270_generated_9503f2b7.jpg",
  "moc-khoa-go": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/1e5f91e49_generated_1c62f738.jpg",
  "guong-bo-tui": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/8d4ba25dd_generated_0d2faee2.jpg",
  "guong-dung": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/6e024d436_generated_591cd385.jpg",
  "luoc-go": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/56940f7af_generated_929917d9.jpg",
  "kep-toc-acrylic": "https://media.base44.com/images/public/6aa840995e828a5595335fd5/352c45280_generated_ad85bfce.jpg",
};

export function imageFor(product) {
  if (!product) return null;
  if (product.slug && productImages[product.slug]) return productImages[product.slug];
  return product.image_url || null;
}

export const CATEGORIES = ["móc khoá", "gương", "lược", "kẹp tóc", "khác"];

export const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n || 0);