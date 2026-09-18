import { json, requireUser, supabase } from "../../_supabase.js";

export default async function handler(req, res) {
  try {
    await requireUser(req, true);
    const id = encodeURIComponent(req.query.id);
    if (req.method !== "PATCH") return json(res, 405, { error: "Method not allowed" });
    const status = String(req.body?.status || "");
    if (!["pending", "paid", "shipped", "delivered", "cancelled"].includes(status)) {
      return json(res, 400, { error: "Invalid status" });
    }
    const rows = await supabase(`orders?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status }),
    });
    json(res, 200, rows[0]);
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
