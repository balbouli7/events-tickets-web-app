import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/userServices";
import { useNavigate } from "react-router-dom";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("firstName");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(
        "Failed to load users. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        alert("User deleted successfully");
        fetchUsers(); // Refresh the list
      } catch (error) {
        alert("Failed to delete user: " + (error.message || "Unknown error"));
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = user[searchBy]?.toString().toLowerCase();
    return value?.includes(searchTerm.toLowerCase());
  });

  if (loading)
    return (
      <div style={{ color: "black", textAlign: "center", padding: "20px" }}>
        Loading users...
      </div>
    );

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
        {error}
      </div>
    );

  return (
    <div
      style={{
        background: "#ffffff", // Full-page white background
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "'Inter', sans-serif",
        color: "#333", // Dark text on white
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600",
          fontSize: "28px",
          color: "#111",
        }}
      >
        Users List
      </h2>

      {/* Search and Filter */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
            minWidth: "220px",
          }}
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "150px",
          }}
        >
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="mobile">Mobile</option>
          <option value="role">Role</option>
          <option value="address">Address</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Role</th>
              <th>Creation Date</th>
              <th>Updating Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      style={actionBtnStyle("#2563eb")}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#1e40af")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#2563eb")
                      }
                      onClick={() =>
                        navigate(`/users/details/${user._id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      style={actionBtnStyle("#f59e0b")}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#b45309")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#f59e0b")
                      }
                      onClick={() =>
                        navigate(`/users/update/${user._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={actionBtnStyle("#dc2626")}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#991b1b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#dc2626")
                      }
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const actionBtnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  padding: "8px 14px",
  marginRight: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.1s ease",
});

export default GetAllUsers;
