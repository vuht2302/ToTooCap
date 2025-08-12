// Central API base configuration
// In production (Vercel) we default to '/api' and rely on vercel.json rewrites
// so that HTTPS frontend calls same-origin '/api/*' (avoiding mixed content)
// which Vercel proxies to the remote HTTP backend.
// In local dev, Vite devServer proxy (vite.config.js) maps '/api' to the backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Helper to build API URLs safely without double slashes
export const apiUrl = (path = "") => {
  const base = API_BASE_URL.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
};
