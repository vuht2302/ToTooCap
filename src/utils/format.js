export const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount || 0
  );

export const formatDate = (dateString) =>
  !dateString ? "N/A" : new Date(dateString).toLocaleDateString("vi-VN");
