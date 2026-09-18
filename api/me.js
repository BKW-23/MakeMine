import { json, requireUser } from "./_supabase.js";

export default async function handler(req, res) {
  try {
    json(res, 200, await requireUser(req));
  } catch (error) {
    json(res, error.status || 500, { error: error.message });
  }
}
