import { json, supabase } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
  const query = String(req.query.q || "").trim().slice(0, 80);
  if (!query) return json(res, 400, { error: "Search query required" });
  try {
    const escaped = query.replace(/[%_]/g, "");
    const rows = await supabase(`orders?or=(order_code.eq.${encodeURIComponent(escaped)},customer_phone.eq.${encodeURIComponent(escaped)})&select=id,order_code,customer_name,customer_phone,address,items,total,status,created_at&limit=20`);
    json(res, 200, rows);
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
