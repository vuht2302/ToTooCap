import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { apiUrl } from "../config/api";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Lấy code từ URL params
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          console.error("Google OAuth error:", error);
          alert("Đăng nhập Google bị hủy hoặc có lỗi");
          navigate("/login");
          return;
        }

        if (!code) {
          console.error("No authorization code received");
          alert("Không nhận được mã xác thực từ Google");
          navigate("/login");
          return;
        }

        console.log("Received code from Google:", code);

        const response = await fetch(apiUrl("/auth/google/callback"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend response:", data);

        if (data.success && data.accessToken) {
          // Lưu token từ Google callback
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // Gọi API để lấy thông tin user giống như loginPage
          const infoRes = await fetch(apiUrl("/auth/user/get/loginUser"), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const infoData = await infoRes.json();

          if (infoRes.ok && infoData.success && infoData.data) {
            const role = infoData.data.role;
            localStorage.setItem("user", JSON.stringify(infoData.data));
            setUser(infoData.data);

            // Chuyển hướng theo role
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
            alert(infoData.message || "Không lấy được thông tin người dùng!");
            navigate("/login");
          }
        } else {
          alert(data.message || "Đăng nhập Google thất bại");
          navigate("/login");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập: " + error.message);
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate, setUser, searchParams]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Đang xử lý đăng nhập Google...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Vui lòng đợi trong giây lát
      </Typography>
    </Box>
  );
};

export default GoogleCallback;
