import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { apiUrl } from "@/config/api";
import GoogleAuthService from "../services/googleAuth.service";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Lấy authorization code từ URL params
        const code = searchParams.get("code");
        
        if (!code) {
          alert("Không nhận được mã xác thực từ Google!");
          navigate("/login");
          return;
        }

        // Sử dụng GoogleAuthService để xử lý callback
        const result = await GoogleAuthService.handleGoogleCallback(code);

        if (result.success && result.data.accessToken) {
          // Lưu token vào localStorage
          localStorage.setItem("accessToken", result.data.accessToken);
          
          // Gọi API để lấy thông tin user
          const userResponse = await fetch(apiUrl("/auth/user/get/loginUser"), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${result.data.accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const userData = await userResponse.json();

          if (userResponse.ok && userData.success && userData.data) {
            const role = userData.data.role;
            localStorage.setItem("user", JSON.stringify(userData.data));
            setUser(userData.data);

            // Redirect dựa trên role
            if (role === "customer") {
              navigate("/");
            } else if (role === "manager") {
              navigate("/manager");
            } else if (role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          } else {
            alert("Không lấy được thông tin người dùng!");
            navigate("/login");
          }
        } else {
          alert(result.error || "Đăng nhập Google thất bại!");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during Google callback:", error);
        alert("Lỗi xử lý đăng nhập Google!");
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column"
    }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 2s linear infinite"
        }}></div>
      </div>
      <p>Đang xử lý đăng nhập Google...</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleCallback;