import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../../api/userServices';

const VerifyUser = ({ email }) => {
  const [verifyCode, setVerifyCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    if (!verifyCode) {
      setMessage("Please enter the verification code.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyUser(verifyCode, email);
      setMessage(response.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "40px 30px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
        Verify Your Account
      </h2>

      {message && (
        <div
          style={{
            color: message.toLowerCase().includes("error") ? "#ff4d4f" : "#28a745",
            backgroundColor: message.toLowerCase().includes("error") ? "#fff1f0" : "#e6ffed",
            border: message.toLowerCase().includes("error") ? "1px solid #ffa39e" : "1px solid #b7eb8f",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center"
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          type="text"
          placeholder="Enter verification code"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value)}
          style={inputStyle}
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
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

export default VerifyUser;
