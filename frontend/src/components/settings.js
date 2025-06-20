import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context.js/authContext";
import { CartContext } from "../context.js/cartContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const handleLogout = () => {
    sessionStorage.removeItem("cartItems");
    clearCart();
    logout();
    navigate("/login");
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Use user.id instead of user._id
    if (user && user.id) {
      navigate(`/profile/${user.id}`);
    } else {
      console.error('User ID not found:', user);
      navigate('/login');
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Settings</h2>

      <ul style={visibleListStyle}>
        {/* Profile Settings */}
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "profile" ? itemHoverStyle : {}),
          }}
          onClick={handleProfileClick}
          onMouseEnter={() => setHoveredItem("profile")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={iconStyle}>👤</span>
            <span>Profile Settings</span>
          </div>
        </li>

        {/* Change Password */}
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "password" ? itemHoverStyle : {}),
          }}
          onClick={() => navigate("/updatePassword")}
          onMouseEnter={() => setHoveredItem("password")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={iconStyle}>🔒</span>
            <span>Change Password</span>
          </div>
        </li>

        {/* Terms and Conditions */}
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "terms" ? itemHoverStyle : {}),
          }}
          onClick={() => navigate("/terms")}
          onMouseEnter={() => setHoveredItem("terms")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={iconStyle}>📄</span>
            <span>Terms and Conditions</span>
          </div>
        </li>

        {/* Contact Us */}
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "contact" ? itemHoverStyle : {}),
          }}
          onClick={() => navigate("/contact")}
          onMouseEnter={() => setHoveredItem("contact")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={iconStyle}>📞</span>
            <span>Contact Us</span>
          </div>
        </li>
        {/* About Us */}
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "about us" ? itemHoverStyle : {}),
          }}
          onClick={() => navigate("/aboutUs")}
          onMouseEnter={() => setHoveredItem("about us")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={iconStyle}>ℹ️</span>
            <span>About Us</span>
          </div>
        </li>

        {/* Logout */}
        <li
          style={{
            ...itemStyle,
            backgroundColor: hoveredItem === "logout" ? "#ffebee" : "#ffffff",
            borderColor: hoveredItem === "logout" ? "#e53935" : "#e0e0e0",
            ...(hoveredItem === "logout" ? itemHoverStyle : {}),
          }}
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={itemContentStyle}>
            <span style={{ ...iconStyle, color: "#e53935" }}>🚪</span>
            <span style={{ color: "#e53935" }}>Logout</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

// Reused styles from AllCategories with some additions
const cardStyle = {
  maxWidth: "500px",
  margin: "60px auto",
  padding: "30px 35px",
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
  borderRadius: "18px",
  fontFamily: "'Poppins', sans-serif",
  color: "#2c3e50",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "30px",
  fontWeight: "700",
  color: "#2c3e50",
  letterSpacing: "1.2px",
};

const visibleListStyle = {
  listStyleType: "none",
  padding: "20px",
  margin: 0,
  borderRadius: "14px",
  backgroundColor: "#f8f9fa",
  boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.05)",
};

const itemStyle = {
  padding: "14px 20px",
  marginBottom: "12px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  fontSize: "16px",
  color: "#2c3e50",
  fontWeight: "500",
  border: "1px solid #e0e0e0",
  cursor: "pointer",
  transition: "all 0.3s ease",
  userSelect: "none",
  borderColor: "black",
};

const itemHoverStyle = {
  backgroundColor: "#e6f0ff",
  transform: "scale(1.02)",
  color: "#1a3d7c",
};

const itemContentStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const iconStyle = {
  fontSize: "20px",
};

const descriptionStyle = {
  fontSize: "14px",
  color: "#666",
  margin: "8px 0 0 32px",
  fontStyle: "italic",
};

export default Settings;
