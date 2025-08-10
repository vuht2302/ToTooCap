// Category API Service
const API_BASE_URL = "http://54.169.159.141:3000"; // API URL từ yêu cầu

class CategoryService {
  // Lấy danh sách tất cả danh mục
  static async getAllCategories(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/get?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Lấy chi tiết danh mục theo ID
  static async getCategoryById(categoryId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/get/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category details:", error);
      throw error;
    }
  }

  // Thêm danh mục mới
  static async addCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/category/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }

  // Cập nhật danh mục
  static async updateCategory(categoryId, categoryData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/update/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  // Xóa danh mục
  static async deleteCategory(categoryId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/delete/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Lấy thống kê danh mục
  static async getCategoryStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/category/stats`, {
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
      console.error("Error fetching category stats:", error);
      throw error;
    }
  }
}

export default CategoryService;
