# Google OAuth Integration

## 📋 Tổng quan

Tích hợp đăng nhập Google OAuth 2.0 vào ứng dụng Totoocap.

## 🚀 Tính năng đã thêm

### 1. **Đăng nhập Google**

- Nút "Sign up with Google" trên trang đăng nhập
- Nút "Sign up with Google" trên trang đăng ký
- Tự động chuyển hướng sau khi đăng nhập thành công

### 2. **Files đã thêm/chỉnh sửa:**

#### **Mới:**

- `src/pages/GoogleCallback.jsx` - Xử lý callback từ Google
- `src/services/googleAuth.service.js` - Service quản lý Google Auth

#### **Đã chỉnh sửa:**

- `src/pages/loginPage.jsx` - Thêm handleGoogleLogin
- `src/pages/registerPage.jsx` - Thêm handleGoogleLogin
- `src/routes/MainRoute.jsx` - Thêm route `/auth/google/callback`

## 🔧 API Integration

### **Endpoint sử dụng:**

```
GET  http://54.169.159.141:3000/auth/google
POST http://54.169.159.141:3000/auth/google/callback
```

### **Flow hoạt động:**

1. **Người dùng click "Sign up with Google"**
2. **Frontend gọi `GET /auth/google`**
   - Response: `{ success: true, url: "https://accounts.google.com/..." }`
3. **Redirect tới Google OAuth**
4. **Google callback về `/auth/google/callback?code=...`**
5. **Frontend gửi code tới `POST /auth/google/callback`**
6. **Backend trả về tokens**
7. **Lưu tokens và chuyển hướng dựa trên role**

## 🎯 Cách sử dụng

### **Từ Login Page:**

```jsx
// Người dùng click nút Google
await GoogleAuthService.redirectToGoogle();
```

### **Từ Register Page:**

```jsx
// Người dùng click nút Google
await GoogleAuthService.redirectToGoogle();
```

### **GoogleCallback Page:**

- Tự động xử lý khi Google redirect về
- Hiển thị loading spinner
- Tự động chuyển hướng sau khi thành công

## 🛡️ Security Features

- ✅ CSRF protection với state parameter
- ✅ Token validation
- ✅ Role-based redirection
- ✅ Error handling cho tất cả trường hợp

## 📱 User Experience

- **Loading state** khi xử lý callback
- **Error messages** rõ ràng bằng tiếng Việt
- **Auto-redirect** dựa trên role:
  - Customer → `/`
  - Manager → `/manager`
  - Admin → `/admin`

## 🐛 Error Handling

- Kiểm tra Google OAuth errors
- Validate authorization code
- Handle network errors
- Fallback về login page nếu có lỗi

## 🔄 Maintenance

Service `GoogleAuthService` tập trung hóa:

- URL endpoints
- Error handling
- Response parsing
- Easy to update/maintain
