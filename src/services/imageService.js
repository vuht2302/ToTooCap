// Image API Service
const API_BASE_URL = "http://54.169.159.141:3000";

class ImageService {
  // Get all product images
  static async getAllImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/image/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // { success, data: [...] }
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  }

  // Add product image
  static async addProductImage(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/image/add/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding product image:", error);
      throw error;
    }
  }
}

export default ImageService;
