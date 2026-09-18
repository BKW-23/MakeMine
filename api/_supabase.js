const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = async (path, options = {}) => {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || "Database request failed");
    error.status = response.status;
    throw error;
  }
  return data;
};

export const getBearer = (req) => {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
};

export const requireUser = async (req, admin = false) => {
  const token = getBearer(req);
  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  const authResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!authResponse.ok) {
    const error = new Error("Invalid session");
    error.status = 401;
    throw error;
  }
  const user = await authResponse.json();
  const profiles = await supabase(`profiles?id=eq.${encodeURIComponent(user.id)}&select=role`);
  const role = profiles[0]?.role || "user";
  if (admin && role !== "admin") {
    const error = new Error("Admin access required");
    error.status = 403;
    throw error;
  }
  return { ...user, role };
};

export const json = (res, status, body) => {
  res.status(status).setHeader("Content-Type", "application/json").send(body);
};
