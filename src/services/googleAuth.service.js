const GOOGLE_AUTH_BASE_URL = "http://54.169.159.141:3000/auth/google";

export const GoogleAuthService = {
  // Lấy URL để redirect đến Google OAuth
  async getGoogleAuthUrl() {
    try {
      const response = await fetch(GOOGLE_AUTH_BASE_URL, {
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
      const response = await fetch(`${GOOGLE_AUTH_BASE_URL}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || "Đăng nhập Google thất bại",
        };
      }
    } catch (error) {
      console.error("Error handling Google callback:", error);
      return { success: false, error: "Lỗi kết nối khi xử lý callback" };
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
