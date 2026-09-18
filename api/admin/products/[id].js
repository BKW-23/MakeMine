import { json, requireUser, supabase } from "../../_supabase.js";

export default async function handler(req, res) {
  try {
    await requireUser(req, true);
    if (req.method !== "DELETE") return json(res, 405, { error: "Method not allowed" });
    await supabase(`products?id=eq.${encodeURIComponent(req.query.id)}`, { method: "DELETE" });
    res.status(204).end();
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
