const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const sessionKey = "makemine_supabase_session";
const sampleProducts = [{
  id: "sample-luoc-bo-tui-mini",
  name: "Lược bỏ túi mini",
  slug: "luoc-bo-tui-mini",
  category: "lược",
  base_price: 69000,
  short_description: "Lược nhỏ tiện mang theo, khắc tên",
  image_url: "/sample-product.png",
  customizable: true,
  colors: ["hồng"],
  fonts: ["Quicksand"],
  featured: true,
  stock: 45,
}, {
  id: "sample-kep-toc-ca-nhan-hoa",
  name: "Kẹp tóc cá nhân hóa",
  slug: "kep-toc-ca-nhan-hoa",
  category: "kẹp tóc",
  base_price: 69000,
  short_description: "Kẹp tóc cá nhân hóa, khắc tên theo yêu cầu",
  image_url: "/sample-product.png",
  customizable: true,
  colors: ["hồng"],
  fonts: ["Quicksand"],
  featured: true,
  stock: 45,
}];

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
};

const saveSession = (session) => {
  if (session) localStorage.setItem(sessionKey, JSON.stringify(session));
  else localStorage.removeItem(sessionKey);
};

const consumeAuthCallback = () => {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (!accessToken) return null;

  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Number(hash.get("expires_in") || 3600),
    token_type: hash.get("token_type") || "bearer",
  };
  saveSession(session);
  window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
  return session;
};

const authHeaders = () => {
  const session = getSession();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${session?.access_token || anonKey}`,
    "Content-Type": "application/json",
  };
};

const assertSupabaseConfig = () => {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = Object.assign(
      new Error(data?.message || data?.error_description || data?.error || "Request failed"),
      { status: response.status },
    );
    throw error;
  }
  return data;
};

const supabaseRequest = (path, options = {}) => {
  assertSupabaseConfig();
  return request(`${supabaseUrl}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
};

const apiRequest = (path, options = {}) => {
  const session = getSession();
  return request(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

const products = {
  async list(..._args) {
    if (!supabaseUrl || !anonKey) return sampleProducts;
    const data = await supabaseRequest("/rest/v1/products?select=*&order=created_at.desc&limit=60");
    if (!Array.isArray(data)) throw new Error("Supabase returned an invalid product list.");
    return data;
  },
  create(payload) {
    return apiRequest("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
  },
  delete(id) {
    return apiRequest(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

const orders = {
  create(payload) {
    return apiRequest("/api/orders", { method: "POST", body: JSON.stringify(payload) });
  },
  list(..._args) {
    return apiRequest("/api/admin/orders");
  },
  update(id, payload) {
    return apiRequest(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

const functions = {
  invoke(name, payload) {
    const path = name === "giftSuggestion" ? "/api/gift-suggestion" : "/api/generate-greeting";
    return apiRequest(path, { method: "POST", body: JSON.stringify(payload) }).then((data) => ({ data }));
  },
};

const auth = {
  async me() {
    return apiRequest("/api/me");
  },
  async loginViaEmailPassword(email, password) {
    const session = await supabaseRequest("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(session);
    return session;
  },
  async register({ email, password }) {
    const result = await supabaseRequest("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (result?.access_token) saveSession(result);
    return result;
  },
  async verifyOtp({ email, otpCode }) {
    const session = await supabaseRequest("/auth/v1/verify", {
      method: "POST",
      body: JSON.stringify({ email, token: otpCode, type: "signup" }),
    });
    saveSession(session);
    return session;
  },
  async resendOtp(email) {
    return supabaseRequest("/auth/v1/resend", {
      method: "POST",
      body: JSON.stringify({ type: "signup", email }),
    });
  },
  async resetPasswordRequest(email) {
    return supabaseRequest("/auth/v1/recover", {
      method: "POST",
      body: JSON.stringify({
        email,
        redirect_to: `${window.location.origin}/reset-password`,
      }),
    });
  },
  async resetPassword({ newPassword }) {
    const session = getSession();
    if (!session?.access_token) throw new Error("Reset link expired or invalid");
    return supabaseRequest("/auth/v1/user", {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    });
  },
  loginWithProvider(provider, returnTo) {
    const redirectTo = `${window.location.origin}${returnTo || "/"}`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
  },
  logout() {
    saveSession(null);
    window.location.href = "/login";
  },
  redirectToLogin(returnTo) {
    window.location.href = `/login?returnTo=${encodeURIComponent(returnTo || "/")}`;
  },
  consumeAuthCallback,
};

export const base44 = { entities: { Product: products, Order: orders }, functions, auth };
