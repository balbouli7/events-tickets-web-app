import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../useCategory";
import { AuthContext } from "../../context.js/authContext";

const AllCategories = () => {
  const { categories, error } = useCategories();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleCategoryClick = (categoryId) => {
    navigate(`/eventsByCategory/${categoryId}`);
  };

  const handleAddCategory = () => {
    navigate("/addCategory");
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>All Categories</h2>

      {isAdmin && (
        <button style={buttonStyle} onClick={handleAddCategory}>
          Add a category
        </button>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <ul style={visibleListStyle}>
        <li
          style={{
            ...itemStyle,
            ...(hoveredItem === "all" ? itemHoverStyle : {}),
          }}
          onClick={() => navigate("/events")}
          onMouseEnter={() => setHoveredItem("all")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          All Categories
        </li>

        {categories.map((cat) => (
          <li
            key={cat._id}
            style={{
              ...itemStyle,
              ...(hoveredItem === cat._id ? itemHoverStyle : {}),
            }}
            onClick={() => handleCategoryClick(cat._id)}
            onMouseEnter={() => setHoveredItem(cat._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCategories;


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

const errorStyle = {
  color: "#e74c3c",
  marginBottom: "16px",
  textAlign: "center",
  fontWeight: "700",
  fontSize: "16px",
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

const buttonStyle = {
  display: "block",
  margin: "0 auto 30px auto",
  padding: "12px 28px",
  backgroundColor: "#1e90ff",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(30, 144, 255, 0.3)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
};
