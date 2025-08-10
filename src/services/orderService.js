// Order API Service
const API_BASE_URL = "http://54.169.159.141:3000";

class OrderService {
  // Lấy danh sách tất cả đơn hàng
  static async getAllOrders(params = {}) {
    try {
      const token = localStorage.getItem("accessToken");

      // Tạo query string từ params
      const queryParams = new URLSearchParams({
        currentPage: params.currentPage || 1,
        limit: params.limit || 100,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        ...(params.userId && { userId: params.userId }),
      });

      const response = await fetch(
        `${API_BASE_URL}/order/get?${queryParams.toString()}`,
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
      console.log("Orders fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      console.log("Payments fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  // Lấy URL thanh toán VNPay
  static async getVNPayPaymentUrl(paymentId) {
    try {
      if (!paymentId) {
        throw new Error("Payment ID không hợp lệ");
      }

      console.log("Getting payment URL for paymentId:", paymentId);

      const token = localStorage.getItem("accessToken");
      const url = `${API_BASE_URL}/payment/vnpay/url?paymentId=${paymentId}`;
      console.log("Payment URL API:", url);

      const response = await fetch(url, {
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
      console.log("Payment URL response:", data);

      if (data.success) {
        let paymentUrl = data.data;

        // Thay thế localhost bằng origin hiện tại
        if (paymentUrl.includes("localhost:3000/payment/vnpay/return")) {
          paymentUrl = paymentUrl.replace(
            "localhost:3000/payment/vnpay/return",
            `${window.location.origin}/payment/vnpay/return`
          );
        }

        return paymentUrl;
      }
      throw new Error(data.message || "Không thể tạo URL thanh toán");
    } catch (error) {
      console.error("Get payment URL error:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId, status) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/order/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  static async getOrderById(orderId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/order/get/${orderId}`, {
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
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  // Xóa đơn hàng
  static async deleteOrder(orderId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/order/delete/${orderId}`, {
        method: "DELETE",
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
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  // Lấy thống kê đơn hàng
  // static async getOrderStats() {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const response = await fetch(`${API_BASE_URL}/order/stats`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching order stats:", error);
  //     throw error;
  //   }
  // }

  // Helper functions cho payment status
  static getPaymentStatusForOrder(payments, orderId) {
    const orderPayments = payments.filter((p) => p.order_id === orderId);
    if (orderPayments.length === 0) return "Processing";

    const latestPayment = orderPayments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    return latestPayment.payment_status;
  }

  static getPaymentDetailForOrder(payments, orderId) {
    const orderPayments = payments.filter((p) => p.order_id === orderId);
    if (orderPayments.length === 0) return null;

    const latestPayment = orderPayments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    return latestPayment;
  }

  static getDisplayStatus(payments, orderId) {
    const paymentStatus = this.getPaymentStatusForOrder(payments, orderId);

    switch (paymentStatus) {
      case "Done":
        return "Done";
      case "Failed":
        return "Cancelled";
      default:
        return "Processing";
    }
  }
}

export default OrderService;
