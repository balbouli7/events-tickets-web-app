import React, { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../../api/userServices";
import { useNavigate } from "react-router-dom";
import useCategories from "../useCategory";

const GetAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const navigate = useNavigate();

  const { categories } = useCategories();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError(
        "Failed to load events. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [searchBy]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        alert("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        alert("Failed to delete event: " + (error.message || "Unknown error"));
      }
    }
  };

  const toggleEventSelection = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return alert("No events selected.");
    if (!window.confirm("Are you sure you want to delete selected events?"))
      return;

    try {
      await Promise.all(selectedEvents.map((id) => deleteEvent(id)));
      alert("Selected events deleted successfully");
      fetchEvents();
      setSelectedEvents([]);
    } catch (error) {
      alert(
        "Failed to delete some events: " + (error.message || "Unknown error")
      );
    }
  };

  const filteredEvents = events.filter((event) => {
    const value = event[searchBy]?.toString().toLowerCase();
    const matchesSearch = value?.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.category?.name === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div style={loadingStyles}>Loading events...</div>;
  }

  if (error) {
    return <div style={errorStyles}>{error}</div>;
  }

  return (
    <div style={containerStyles}>
      <h2 style={headerStyles}>Events List</h2>

      {/* Search and Filter */}
      <div style={searchContainerStyles}>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyles}
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          style={selectStyles}
        >
          <option value="title">Title</option>
          <option value="description">Description</option>
          <option value="location">Location</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* Delete Selected Button */}
      <div style={deleteButtonContainerStyles}>
        <button
          onClick={handleBulkDelete}
          style={deleteButtonStyles}
          disabled={selectedEvents.length === 0}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#991b1b")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#dc2626")
          }
        >
          🗑 Delete Selected ({selectedEvents.length})
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={tableHeaderStyles}>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selectedEvents.length === filteredEvents.length &&
                    filteredEvents.length > 0
                  }
                />
              </th>
              <th>#</th>
              <th>Title</th>
              <th>Date</th>
              <th>Description</th>
              <th>Location</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <tr key={event._id}>
                  <td style={cellStyle}>
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event._id)}
                      onChange={() => toggleEventSelection(event._id)}
                    />
                  </td>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{event.title}</td>
                  <td style={cellStyle}>
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td style={{ ...cellStyle, maxWidth: "150px" }}>
                    {event.description}
                  </td>
                  <td style={cellStyle}>{event.location}</td>
                  <td style={cellStyle}>{event.category?.name}</td>
                  <td style={cellStyle}>
                    <button
                      style={{
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginRight: "8px",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#1e40af")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#2563eb")
                      }
                      onClick={() => navigate(`/admin/events/${event._id}`)}
                    >
                      View
                    </button>
                    <button
                      style={{
                        backgroundColor: "#f59e0b", // Tailwind green-500
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 18px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginRight: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={
                        (e) => (e.target.style.backgroundColor = "#b45309") // Tailwind green-600
                      }
                      onMouseOut={
                        (e) => (e.target.style.backgroundColor = "#f59e0b") // Tailwind green-500
                      }
                      onClick={() =>
                        navigate(`/admin/update-event/${event._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        backgroundColor: "#dc2626",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#991b1b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#dc2626")
                      }
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyles = {
  background: "#ffffff", // White background for the container
  minHeight: "100vh", // Full page height
  padding: "30px",
  fontFamily: "'Inter', sans-serif",
  color: "#333", // Dark text on white
};

const headerStyles = {
  textAlign: "center",
  marginBottom: "30px",
  fontWeight: "600",
  fontSize: "28px",
  color: "#111",
};

const searchContainerStyles = {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const inputStyles = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: 1,
  minWidth: "220px",
};

const selectStyles = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "150px",
};

const deleteButtonContainerStyles = {
  marginBottom: "10px",
  display: "flex",
  justifyContent: "flex-end",
};

const deleteButtonStyles = {
  backgroundColor: "#ff4d4d",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const tableHeaderStyles = {
  backgroundColor: "#f1f1f1", // Lighter background for header
};

const loadingStyles = {
  color: "black",
  textAlign: "center",
  padding: "20px",
};

const errorStyles = {
  color: "red",
  textAlign: "center",
  padding: "20px",
};

const actionBtnStyle = (color) => ({
  backgroundColor: "transparent",
  color: "#333",
  border: `2px solid ${color}`,
  borderRadius: "4px",
  padding: "6px 12px",
  marginRight: "6px",
  fontSize: "14px",
  cursor: "pointer",
});
const cellStyle = {
  textAlign: "center",
  verticalAlign: "middle",
  padding: "10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default GetAllEvents;
