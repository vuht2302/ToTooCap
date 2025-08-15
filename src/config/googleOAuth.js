// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  // Backend API endpoints - Sử dụng HTTPS để tránh Mixed Content errors trên Vercel
  BASE_URL: "https://54.169.159.141:3000/auth/google",
  CALLBACK_ENDPOINT: "https://54.169.159.141:3000/auth/google/callback",

  // Frontend callback URL (nơi Google sẽ redirect về)
  FRONTEND_CALLBACK_URL: window.location.origin + "/google",

  // Các role và redirect paths
  ROLE_REDIRECTS: {
    customer: "/",
    manager: "/manager",
    admin: "/admin",
  },

  // Timeout cho API calls (ms)
  API_TIMEOUT: 10000,

  // Debug mode
  DEBUG: process.env.NODE_ENV === "development",
};

export default GOOGLE_OAUTH_CONFIG;
