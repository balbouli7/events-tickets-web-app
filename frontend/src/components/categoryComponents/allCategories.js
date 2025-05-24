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
    navigate(`/admin/eventsByCategory/${categoryId}`);
  };

  const handleAddCategory = () => {
    navigate("/admin/addCategory");
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


// Styles remain the same as before

// New Styles

const cardStyle = {
  maxWidth: "520px",
  margin: "60px auto",
  padding: "30px 35px",
  background: "#f9fafb",
  boxShadow: "0 6px 18px rgba(100, 100, 111, 0.2)",
  borderRadius: "16px",
  fontFamily: "'Inter', sans-serif",
  color: "#222",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "28px",
  fontWeight: "700",
  color: "#1a202c",
};

const errorStyle = {
  color: "#e53e3e",
  marginBottom: "16px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "15px",
};

const visibleListStyle = {
  listStyleType: "none",
  padding: "15px",
  margin: 0,
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "inset 0 0 10px #d1d5db",
};

const itemStyle = {
  padding: "14px 18px",
  marginBottom: "12px",
  borderRadius: "10px",
  backgroundColor: "#edf2f7",
  fontSize: "17px",
  color: "#2d3748",
  fontWeight: "500",
  boxShadow: "0 2px 6px rgba(45, 55, 72, 0.1)",
  cursor: "pointer",
  transition: "all 0.25s ease-in-out",
};

const itemHoverStyle = {
  backgroundColor: "#c3dafe",
  transform: "scale(1.02)",
  boxShadow: "0 6px 14px rgba(66, 153, 225, 0.3)",
};

const buttonStyle = {
  display: "block",
  margin: "0 auto 25px auto",
  padding: "12px 28px",
  backgroundColor: "#4c51bf",
  color: "#f7fafc",
  fontSize: "18px",
  fontWeight: "600",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(76, 81, 191, 0.4)",
  transition: "all 0.3s ease",
};
