import { API_BASE_URL } from "../config/api";

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/get`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    // Nếu API trả về { success, data: [...] }, trả về data.data
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    // Nếu API trả về mảng trực tiếp
    if (Array.isArray(data)) {
      return data;
    }
    // Trường hợp khác, trả về rỗng
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
