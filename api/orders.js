import { json, supabase } from "./_supabase.js";

const cleanText = (value, max) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  try {
    const body = req.body || {};
    const name = cleanText(body.customer_name, 120);
    const phone = cleanText(body.customer_phone, 30);
    const address = cleanText(body.address, 300);
    const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
    if (!name || !phone || !address || !items.length) {
      return json(res, 400, { error: "Missing order details" });
    }
    const products = await supabase(`products?id=in.(${items.map((item) => encodeURIComponent(item.product_id)).join(",")})&select=id,name,base_price`);
    const byId = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = items.map((item) => {
      const product = byId.get(item.product_id);
      const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      if (!product) throw Object.assign(new Error("Invalid product"), { status: 400 });
      return {
        product_id: product.id,
        name: product.name,
        quantity,
        unit_price: product.base_price,
        customization: item.customization && typeof item.customization === "object" ? item.customization : {},
      };
    });
    const total = normalizedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const orderCode = `MM${Date.now().toString(36).toUpperCase()}`;
    const created = await supabase("orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        order_code: orderCode,
        customer_name: name,
        customer_phone: phone,
        customer_email: cleanText(body.customer_email, 160) || null,
        address,
        items: normalizedItems,
        total,
        preview_confirmed: Boolean(body.preview_confirmed),
      }),
    });
    json(res, 201, created[0]);
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
