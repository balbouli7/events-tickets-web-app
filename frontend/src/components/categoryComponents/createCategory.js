import React, { useState } from 'react';
import { createCategory } from '../../api/userServices';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({ 
    name: '', 
    description: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await createCategory(categoryData);
      setSuccess(response.message);
      setCategoryData({ name: '', description: '' });
      navigate("/admin/allCategory");
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Add New Category</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <input
          type="text"
          name="name"
          required
          value={categoryData.name}
          onChange={handleInputChange}
          placeholder="Category Name (e.g. VIP, General)"
          style={inputStyle}
        />

        <textarea
          name="description"
          rows={3}
          value={categoryData.description}
          onChange={handleInputChange}
          placeholder="Optional Description"
          style={{ ...inputStyle, resize: "none" }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={buttonStyle}
        >
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;

// Styles used
const cardStyle = {
  maxWidth: "480px",
  margin: "80px auto",
  padding: "40px 30px",
  background: "#fff",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
  borderRadius: "12px",
  fontFamily: "Segoe UI, sans-serif"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "#333"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "8px 0 16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  transition: "0.3s ease"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#4c9aff",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.2s ease"
};

const errorStyle = {
  color: "#ff4d4f",
  marginBottom: "12px",
  textAlign: "center"
};

const successStyle = {
  color: "#52c41a",
  marginBottom: "12px",
  textAlign: "center"
};
