import React, { useState, useContext } from "react";
import image_login from "../assets/image_login.png";
import image_google from "../assets/image_google.png";
import logo from "../assets/logo.png";
import "../assets/loginPage.css";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const userRes = await fetch("http://54.169.159.141:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username, // Đổi từ username thành email
          password: formData.password,
        }),
      });

      const userData = await userRes.json(); // Đổi từ infoData thành userData

      if (userRes.ok && userData.success) {
        // Sử dụng userRes thay vì infoRes
        // Lưu token vào localStorage
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);

        // Gọi API để lấy thông tin user
        const infoRes = await fetch(
          "http://54.169.159.141:3000/auth/user/get/loginUser",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const infoData = await infoRes.json();

        if (infoRes.ok && infoData.success && infoData.data) {
          const role = infoData.data.role;
          localStorage.setItem("user", JSON.stringify(infoData.data));
          setUser(infoData.data);

          if (role === "customer") {
            navigate("/");
          } else if (role === "manager") {
            navigate("/manager");
          } else if (role === "admin") {
            navigate("/admin");
          }
        } else {
          alert(infoData.message || "Không lấy được thông tin người dùng!");
        }
      } else {
        alert(userData.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Đăng nhập thất bại!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <img className="login-logo" src={logo} alt="logo" />
        <img className="login-image" src={image_login} alt="login visual" />
      </div>

      <div className="login-form">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Log in to Totoocap
        </h1>
        <p className="login-subtitle">Enter your account with us</p>

        <div className="form-container">
          <input
            className="login-input"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <div style={{ position: "relative", width: "50%" }}>
            <input
              className="login-input"
              style={{ width: "100%", paddingRight: "40px" }}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
            <span onClick={togglePassword} className="login-eye-icon">
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </span>
          </div>

          <div className="login-button-container">
            <div>
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
            </div>
            <div className="login-forgot-password">Forget Password?</div>
          </div>

          <button className="login-google-button">
            <img
              className="login-google-image"
              src={image_google}
              alt="Google"
            />
            Sign up with Google
          </button>

          <p style={{ fontSize: "14px" }}>
            Don’t have an account?{" "}
            <span onClick={handleRegister} className="login-signin">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
