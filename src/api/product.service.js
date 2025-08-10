export const fetchAllProducts = async () => {
  try {
    const response = await fetch("http://54.169.159.141:3000/product/get");
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
