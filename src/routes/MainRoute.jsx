import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/registerPage";
import AdminPage from "../pages/admin/AdminPage";
import UserManagement from "../pages/admin/UserManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import ProductManagement from "../pages/admin/ProductManagement";
import ManagerPage from "../pages/manager/ManagerPage";
import UserPage from "../pages/user/UserPage";
import HomePage from "../pages/user/HomePage";
import DashboardPage from "../pages/user/DashboardPage";
import LoginPage from "../pages/loginPage";
import MyProducts from "../pages/user/MyProducts";
import BrandingGift from "../pages/user/BrandingGift";
import Orders from "../pages/user/Orders";
import PaymentReturn from "../pages/user/PaymentReturn";
import Premium from "../pages/user/Premium";
import ProductDetail from "../pages/user/ProductDetail";
import PaymentPage from "../pages/user/PaymentPage";
import ChooseProductPage from "../pages/user/Design/ChooseProductPage";
import ProductDesignDetail from "../pages/user/Design/ProductDesignDetail";
import HatDesignPage from "../pages/user/Design/HatDesignPage";
import CategoryManagement from "../pages/admin/CategoryManagement";
import RevenueReport from "../pages/admin/RevenueReport";
// Import admin layout
import AdminLayout from "../components/admin/AdminLayout";
import ImagesManagement from "../pages/admin/ImagesManagement";
import CheckoutPage from "../pages/user/CheckoutPage";

const MainRoute = () => {
  return (
    <Router>
      <Routes>
        {/* Routes accessible by all users */}
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-account" element={<UserPage />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/branding-gift" element={<BrandingGift />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/vnpay/return" element={<PaymentReturn />} />

        <Route path="/choose-product" element={<ChooseProductPage />} />
        <Route path="/product-design/:id" element={<ProductDesignDetail />} />
        <Route path="/hat-design/:productId" element={<HatDesignPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin Routes with AdminLayout */}

        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <OrderManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <ProductManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <CategoryManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminLayout>
              <RevenueReport />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/images"
          element={
            <AdminLayout>
              <ImagesManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminLayout>
              <div>Thống kê - Coming soon</div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings/*"
          element={
            <AdminLayout>
              <div>Cài đặt hệ thống - Coming soon</div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminLayout>
              <div>Thông báo - Coming soon</div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/security"
          element={
            <AdminLayout>
              <div>Bảo mật - Coming soon</div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/support/*"
          element={
            <AdminLayout>
              <div>Hỗ trợ - Coming soon</div>
            </AdminLayout>
          }
        />

        {/* Routes accessible by manager */}
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
};

export default MainRoute;
