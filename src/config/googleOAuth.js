// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  // Backend API endpoints
  BASE_URL: "http://54.169.159.141:3000/auth/google",
  CALLBACK_ENDPOINT: "http://54.169.159.141:3000/auth/google/callback",

  // Frontend callback URL (nơi Google sẽ redirect về)
  FRONTEND_CALLBACK_URL: window.location.origin + "/auth/google/callback",

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
