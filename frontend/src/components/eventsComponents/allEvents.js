import React, { useContext, useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../../api/userServices";
import { useNavigate } from "react-router-dom";
import useCategories from "../useCategory";
import { AuthContext } from "../../context.js/authContext";

const GetAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

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
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          {searchBy === "date" ? (
            <input
              type="date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyles, width: "100%", paddingRight: "30px" }}
            />
          ) : (
            <input
              type="text"
              placeholder={`Search by ${searchBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyles, width: "100%", paddingRight: "30px" }}
            />
          )}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                fontSize: "30px",
                color: "black",
                cursor: "pointer",
                padding: "0",
              }}
            >
              ×
            </button>
          )}
        </div>

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

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyles}
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/createEvent")}
          style={{
            backgroundColor: "black",
            color: "#ffffff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4b4b4d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
        >
          ➕ Add an Event
        </button>
      </div>

      {/* Removed Delete Selected Button */}

      {/* Cards Grid */}
      <div style={styles.container}>
        {filteredEvents.length > 0 ? (
          <div style={styles.grid}>
            {filteredEvents.map((event) => {
              const isHovered = hoveredCardId === event._id;
              return (
                <div
                  key={event._id}
                  style={{
                    ...styles.card,
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    boxShadow: isHovered
                      ? "0 8px 24px rgba(0, 0, 0, 0.15)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={() => setHoveredCardId(event._id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        transition: "transform 0.3s ease",
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      gap: "8px",
                    }}
                  >
                    <h3
                      title={event.title}
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: "#222",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </h3>
                    <div style={{ color: "#555", fontSize: "0.9rem" }}>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Location:</strong> {event.location}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Category:</strong>{" "}
                        <span
                          style={{
                            backgroundColor: "#f0f0f0",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          {event.category?.name}
                        </span>
                      </p>
                    </div>
                    <p
                      style={{
                        flexGrow: 1,
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: "1.3",
                        marginTop: "8px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {event.description}
                    </p>

                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        style={{
                          ...viewBtnStyle,
                          flex: "1 1 auto",
                          backgroundColor: "#111",
                          padding: "10px",
                          borderRadius: "8px",
                          fontWeight: "700",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#333")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#111")
                        }
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        View
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            style={{
                              ...editBtnStyle,
                              flex: "1 1 auto",
                              backgroundColor: "#f59e0b",
                              padding: "10px",
                              borderRadius: "8px",
                              fontWeight: "700",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#d47c00")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#f59e0b")
                            }
                            onClick={() =>
                              navigate(`/update-event/${event._id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              ...deleteSingleBtnStyle,
                              flex: "1 1 auto",
                              backgroundColor: "#dc2626",
                              padding: "10px",
                              borderRadius: "8px",
                              fontWeight: "700",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#a22020")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#dc2626")
                            }
                            onClick={() => handleDelete(event._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>No events found</p>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyles = {
  backgroundColor: "#f9f9f9" ,
   minHeight: "100vh",
  padding: "30px",
  fontFamily: "'Inter', sans-serif",
  color: "#333",
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



const deleteButtonStyles = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
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



const viewBtnStyle = {
  backgroundColor: "black",
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
};

const editBtnStyle = {
  backgroundColor: "#f59e0b",
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
};

const deleteSingleBtnStyle = {
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
};


const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  title: {
    fontSize: "1.2rem",
    margin: "10px 0 5px",
  },
  date: {
    color: "#555",
  },
};

export default GetAllEvents;
