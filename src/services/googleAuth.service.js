import GOOGLE_OAUTH_CONFIG from "../config/googleOAuth";

export const GoogleAuthService = {
  // Lấy URL để redirect đến Google OAuth
  async getGoogleAuthUrl() {
    try {
      const response = await fetch(GOOGLE_OAUTH_CONFIG.BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.url) {
        return { success: true, url: data.url };
      } else {
        return { success: false, error: "Không thể lấy URL xác thực Google" };
      }
    } catch (error) {
      console.error("Error getting Google auth URL:", error);
      return { success: false, error: "Lỗi kết nối khi lấy URL xác thực" };
    }
  },

  // Xử lý callback từ Google OAuth
  async handleGoogleCallback(code) {
    try {
      if (GOOGLE_OAUTH_CONFIG.DEBUG) {
        console.log("Calling callback API with code:", code);
      }

      const response = await fetch(GOOGLE_OAUTH_CONFIG.CALLBACK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (GOOGLE_OAUTH_CONFIG.DEBUG) {
        console.log("Response status:", response.status);
      }

      const data = await response.json();

      if (GOOGLE_OAUTH_CONFIG.DEBUG) {
        console.log("Response data:", data);
      }

      if (response.ok) {
        // Kiểm tra nhiều format response khác nhau
        if (data.success !== false) {
          return { success: true, data };
        } else {
          return {
            success: false,
            error: data.message || "Đăng nhập Google thất bại",
          };
        }
      } else {
        return {
          success: false,
          error: data.message || `HTTP Error: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("Error handling Google callback:", error);
      return {
        success: false,
        error: `Lỗi kết nối: ${error.message}`,
      };
    }
  },

  // Redirect tới Google OAuth
  async redirectToGoogle() {
    const result = await this.getGoogleAuthUrl();

    if (result.success) {
      window.location.href = result.url;
    } else {
      throw new Error(result.error);
    }
  },
};

export default GoogleAuthService;
