import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../context.js/authContext";
import { login } from "../../api/userServices";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user ,setUser , isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("user/home");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const data = await login(identifier, password);
      setUser(data.user);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
  
      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("user/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
        {error && (
          <div style={{ color: "#ff4d4f", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Email or Mobile"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={inputStyle}
          required
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <div
            style={eyeIconStyle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <a href="/forgetpassword" style={{ color: "#4c9aff", marginTop: "12px", textAlign: "center" }}>
          Forgot Password?
        </a>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don't have an account? <a href="/register" style={{ color: "#4c9aff" }}>Sign up</a>
        </p>
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
