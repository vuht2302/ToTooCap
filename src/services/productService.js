// Product API Service
const API_BASE_URL = "http://54.169.159.141:3000"; // API URL từ yêu cầu

class ProductService {
  // Lấy danh sách tất cả sản phẩm
  static async getAllProducts(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu cần
      const response = await fetch(
        `${API_BASE_URL}/product/get?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Thêm sản phẩm mới
  static async addProduct(productData) {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu cần
      const response = await fetch(`${API_BASE_URL}/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  // Lấy chi tiết sản phẩm theo ID
  static async getProductById(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/product/get/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  }

  // Cập nhật sản phẩm (sẽ implement sau)
  static async updateProduct(productId, productData) {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu cần
      const response = await fetch(
        `${API_BASE_URL}/product/update/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Xóa sản phẩm (sẽ implement sau)
  static async deleteProduct(productId) {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu cần
      const response = await fetch(
        `${API_BASE_URL}/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Lấy thống kê sản phẩm
  static async getProductStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/product/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw error;
    }
  }
}

export default ProductService;
