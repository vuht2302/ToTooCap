class CloudinaryService {
  static CLOUD_NAME = "dlyjlfqkn"; // Thay bằng cloud_name của bạn
  static UPLOAD_PRESET = "totoo_cap_designs"; // Thay bằng upload_preset của bạn
  static FOLDER = "totoo_cap_designs";
  static API_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

  // Upload ảnh base64 lên Cloudinary
  static async uploadBase64Image(base64Data) {
    try {
      const formData = new FormData();
      formData.append("file", base64Data);
      formData.append("upload_preset", this.UPLOAD_PRESET);
      formData.append("folder", this.FOLDER);
      const response = await fetch(this.API_URL, {
        method: "POST",
        body: formData,
      });
      console.log("🔍 Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return {
        success: true,
        url: data.secure_url,
        public_id: data.public_id,
        data: data,
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload file ảnh lên Cloudinary
  static async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.UPLOAD_PRESET);

      const response = await fetch(this.API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        url: data.secure_url,
        public_id: data.public_id,
        data: data,
      };
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Xóa ảnh từ Cloudinary (cần API key và secret)
  static async deleteImage(publicId) {
    // Chức năng này cần được thực hiện từ backend vì cần API secret
    console.warn("Delete image should be handled by backend for security");
  }
}

export default CloudinaryService;
