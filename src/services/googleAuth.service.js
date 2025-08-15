// Google Auth Service cho việc xử lý đăng nhập Google OAuth

const GoogleAuthService = {
  // Lấy URL để redirect đến Google OAuth
  async getGoogleAuthUrl() {
    try {
      const response = await fetch("http://54.169.159.141:3000/auth/google", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Response format: { "success": true, "url": "https://accounts.google.com/..." }
      if (response.ok && data.success && data.url) {
        return { success: true, url: data.url };
      } else {
        return {
          success: false,
          error: data.message || "Không thể lấy URL xác thực Google",
        };
      }
    } catch (error) {
      console.error("Error getting Google auth URL:", error);
      return { success: false, error: "Lỗi kết nối khi lấy URL xác thực" };
    }
  },

  // Xử lý callback từ Google OAuth - Gọi trực tiếp với GET method
  async handleGoogleCallback(code) {
    try {
      console.log(
        "Calling callback API with code:",
        code.substring(0, 20) + "..."
      );

      // Gọi GET API với code làm query parameter
      const callbackUrl = `http://54.169.159.141:3000/auth/google/callback?code=${encodeURIComponent(
        code
      )}`;

      const response = await fetch(callbackUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      // Response format: { "success": true, "message": "Logged in successful", "accessToken": "string" }
      if (response.ok && data.success) {
        return { success: true, data: data };
      } else {
        return {
          success: false,
          error: data.message || "Đăng nhập Google thất bại",
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
