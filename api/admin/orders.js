import { json, requireUser, supabase } from "../_supabase.js";

export default async function handler(req, res) {
  try {
    await requireUser(req, true);
    const rows = await supabase("orders?select=*&order=created_at.desc&limit=60");
    json(res, 200, rows);
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
