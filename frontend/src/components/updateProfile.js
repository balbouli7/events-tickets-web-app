import React, { useState, useEffect } from "react";
import { getUserById, updateUserProfile } from "../api/userServices";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUser() {
  const { id: userId } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchLoading(true);
        const response = await getUserById(userId);
        const fetchedUser = response.user;

        if (fetchedUser) {
          setFirstName(fetchedUser.firstName || "");
          setLastName(fetchedUser.lastName || "");
          setEmail(fetchedUser.email || "");
          setMobile(fetchedUser.mobile || "");
          setAddress(fetchedUser.address || "");
          setRole(fetchedUser.role || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("Failed to load user data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const updateSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !mobile || !address || !role) {
      setMessage("All fields are required");
      return;
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
      mobile,
      address,
      role,
    };

    try {
      setLoading(true);
      const response = await updateUserProfile(userId, updatedUser);
      if (response) {
        setMessage("User updated successfully!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1000);
      } else {
        setMessage("Server Error. Try again.");
      }
    } catch (error) {
      setMessage(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ color: "#333", textAlign: "center", padding: "20px" }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <form
        onSubmit={updateSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          color: "#333",
        }}
      >
        <h2 style={{ fontSize: "26px", fontWeight: "600", marginBottom: "10px" }}>
          Update User Info
        </h2>

        {message && (
          <div
            style={{
              color:
                message.includes("Error") || message.includes("Failed")
                  ? "#721c24"
                  : "#155724",
              backgroundColor:
                message.includes("Error") || message.includes("Failed")
                  ? "#f8d7da"
                  : "#d4edda",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              border:
                message.includes("Error") || message.includes("Failed")
                  ? "1px solid #f5c6cb"
                  : "1px solid #c3e6cb",
            }}
          >
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          style={backButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e04835")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4500")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
  backgroundColor: "#fff",
  color: "#333",
  width: "100%",
  textAlign: "left",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "12px",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const backButtonStyle = {
  backgroundColor: "#ff4500",
  color: "white",
  padding: "12px",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
