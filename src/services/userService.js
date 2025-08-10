// User API Service
const API_BASE_URL = "http://54.169.159.141:3000";

class UserService {
  // Lấy danh sách tất cả người dùng
  static async getAllUsers() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/auth/user/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Cập nhật thông tin người dùng
  static async updateUser(userId, userData) {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Xóa người dùng
  static async deleteUser(userId) {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/user/delete/${userId}`,
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
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Tạo người dùng mới (nếu có API)
  static async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Thay đổi trạng thái người dùng
  static async changeUserStatus(userId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/status/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error changing user status:", error);
      throw error;
    }
  }
}

export default UserService;
