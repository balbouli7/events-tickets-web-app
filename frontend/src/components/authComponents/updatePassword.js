import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context.js/authContext';
import { updatePassword } from '../../api/userServices';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword) || !/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain both uppercase and lowercase letters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await updatePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      navigate('/settings'); 
    } catch (error) {
      if (error.error === 'Current password is incorrect') {
        setErrors({ currentPassword: error.error });
      } else {
        setErrors({ general: error.error || 'Failed to update password' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    margin: "8px 0 4px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "0.3s ease"
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  };

  return (
    <div style={{
      maxWidth: "420px",
      margin: "80px auto",
      padding: "40px 30px",
      background: "#fff",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
      borderRadius: "12px",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Update Password</h2>

      {success && (
        <div style={{ marginBottom: "12px", color: "green", textAlign: "center" }}>
          Password updated successfully!
        </div>
      )}
      {errors.general && (
        <div style={{ marginBottom: "12px", color: "#ff4d4f", textAlign: "center" }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => {
          const fieldNames = {
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password'
          };
          return (
            <div key={field} style={{ position: "relative", marginBottom: "20px" }}>
              <input
                type={showPassword[field.replace('Password', '')] ? "text" : "password"}
                name={field}
                placeholder={fieldNames[field]}
                value={formData[field]}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors[field] ? "#ff4d4f" : "#ccc"
                }}
              />
              <div
                style={eyeIconStyle}
                onClick={() => togglePasswordVisibility(field.replace('Password', ''))}
              >
                {showPassword[field.replace('Password', '')] ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors[field] && (
                <p style={{ marginTop: "4px", color: "#ff4d4f", fontSize: "14px" }}>
                  {errors[field]}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4c9aff",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.2s ease",
            marginBottom: "10px"
          }}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            width: "100%",
            padding: "10px",
            background: "#f0f0f0",
            color: "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
