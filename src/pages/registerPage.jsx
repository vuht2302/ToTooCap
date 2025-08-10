import React, { useState } from "react";
import image_login from "../assets/image_login.png";
import image_google from "../assets/image_google.png";
import logo from "../assets/logo.png";
import "../assets/registerPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://54.169.159.141:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Register successful!");
        navigate("/"); // Redirect to login
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong.");
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-page">
      <div className="image-container">
        <img className="register-logo" src={logo} alt="logo" />
        <img className="register-image" src={image_login} alt="register visual" />
      </div>

      <div className="register-form">
        <h1 style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "20px" }}>
          Let's get started!
        </h1>
        <p className="register-subtitle">Create your account</p>

        <div className="form-container">
          <input
            className="register-input"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          {/* Role is optional: default is "customer", you can make it selectable if needed */}

          <button className="register-button" onClick={handleSubmit}>
            Create Account
          </button>

          <button className="register-google-button">
            <img className="register-google-image" src={image_google} alt="Google" />
            Sign up with Google
          </button>

          <p style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <span onClick={handleLogin} className="register-signin">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
