const API_BASE_URL = "http://54.169.159.141:3000";

class PaymentService {
  // Tạo payment mới
  static async createPayment(orderId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/payment/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_id: orderId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  // Lấy URL thanh toán VNPAY
  static async getVNPayUrl(paymentId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/payment/vnpay/url?paymentId=${paymentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting VNPay URL:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái thanh toán
  static async updatePaymentStatus(paymentId, status, method) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/payment/update/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            payment_status: status,
            payment_method: method,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  // Lấy danh sách payments
  static async getAllPayments() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/payment/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }
}

export default PaymentService;
