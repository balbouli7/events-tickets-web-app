// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile } from "../api/userServices";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(id);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, [id]);

  if (!user) {
    return <p style={{ color: "#333", textAlign: "center", marginTop: "3rem" }}>Loading profile...</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgb(0, 0, 0)",
          // boxShadow: "0 6px 20px rgb(0, 0, 0)",
          width: "100%",
          maxWidth: "500px",
          padding: "32px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "24px",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}
        >
          User Profile
        </h2>

        {[
          { label: "First Name", value: user.firstName },
          { label: "Last Name", value: user.lastName },
          { label: "Email", value: user.email },
          { label: "Mobile", value: user.mobile },
          { label: "Address", value: user.address },
          { label: "Role", value: user.role },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "18px",
              fontSize: "16px",
              color: "black",
              borderBottom: "1px solid #eee",
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "500", color: "black" }}>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => navigate("/admin/users")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0069d9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
