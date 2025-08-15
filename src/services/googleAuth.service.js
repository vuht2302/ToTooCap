// Google Auth Service cho việc xử lý đăng nhập Google OAuth
import API_CONFIG from '../utils/apiConfig';

export const GoogleAuthService = {
  // Lấy URL để redirect đến Google OAuth
  async getGoogleAuthUrl() {
    try {
      const result = await API_CONFIG.safeFetch(`${API_CONFIG.BASE_URL}/auth/google`, {
        method: 'GET'
      });

      // Response format: { "success": true, "url": "https://accounts.google.com/..." }
      if (result.ok && result.data.success && result.data.url) {
        return { success: true, url: result.data.url };
      } else {
        return { success: false, error: result.data.message || "Không thể lấy URL xác thực Google" };
      }
    } catch (error) {
      console.error("Error getting Google auth URL:", error);
      return { success: false, error: "Lỗi kết nối khi lấy URL xác thực" };
    }
  },

  // Xử lý callback từ Google OAuth - Gọi trực tiếp với GET method
  async handleGoogleCallback(code) {
    try {
      console.log("Calling callback API with code:", code.substring(0, 20) + '...');

      // Gọi GET API với code làm query parameter - sử dụng HTTPS
      const callbackUrl = `${API_CONFIG.BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`;

      const result = await API_CONFIG.safeFetch(callbackUrl, {
        method: 'GET'
      });

      console.log("Response status:", result.status);
      console.log("Response data:", result.data);

      // Response format: { "success": true, "message": "Logged in successful", "accessToken": "string" }
      if (result.ok && result.data.success) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.data.message || "Đăng nhập Google thất bại",
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
