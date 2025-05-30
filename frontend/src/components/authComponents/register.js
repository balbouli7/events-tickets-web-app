import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/userServices";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import Font Awesome icons
import { AuthContext } from "../../context.js/authContext";

export default function Register({ setUserEmail }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState(""); 
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(AuthContext); 
      useEffect(() => {
        if (isLoggedIn && user) {
          if (user.role === "admin") {
            navigate("/admin/home");
          } else {
            navigate("/home");
          }
        }
      }, [isLoggedIn, user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !mobile || !address) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userData = { firstName, lastName, email, password, confirmPassword, mobile, address };
            

            const response = await register(userData);

            if (response.error) {
                setError(response.error);
            } else if (response.message) {
                setUserEmail(email); 
                window.confirm(response.message);
                navigate("/verify");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.error || "Something went wrong. Please try again.");
        }
    };

    return (
      <div style={{
        maxWidth: "420px",
        margin: "auto",
        padding: "40px 30px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        fontFamily: "Segoe UI, sans-serif"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {error && <div style={{ color: "#ff4d4f", marginBottom: "12px", textAlign: "center" }}>{error}</div>}
  
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <div
              style={eyeIconStyle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
            <div
              style={eyeIconStyle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
  
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
      </div>
    );
  }

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

const eyeIconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
};
