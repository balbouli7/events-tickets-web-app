import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsByCategory } from "../../api/userServices";
import useCategories from "../useCategory";

const EventsByCategory = () => {
  const { categoryId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const { categories } = useCategories();

  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await eventsByCategory(categoryId);
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [categoryId]);
  const filteredEvents = events.filter((event) => {
    const value = event[searchBy]?.toString().toLowerCase();
    const matchesSearch = value?.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.category?.name === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p>Loading events...</p>;

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
      </div>

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
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    boxShadow: isHovered
                      ? "0 6px 16px rgba(0,0,0,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={() => setHoveredCardId(event._id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  {/* Checkbox removed */}

                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={styles.image}
                    />
                  )}
                  <div style={cardContentStyles}>
                    <h3
                      title={event.title}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {event.title}
                    </h3>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Category:</strong> {event.category?.name}
                    </p>
                    <p style={{ fontSize: "14px" }}>{event.description}</p>
                    <div style={cardBtnGroup}>
                      <button
                        style={viewBtnStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event._id}`);
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#4b4b4d")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "black")
                        }
                      >
                        View
                      </button>
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
  background: "#ffffff",
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

const deleteButtonContainerStyles = {
  marginBottom: "10px",
  display: "flex",
  justifyContent: "flex-end",
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

const tableHeaderStyles = {
  backgroundColor: "#f1f1f1",
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

const cellStyle = {
  textAlign: "center",
  verticalAlign: "middle",
  padding: "10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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
const gridContainerStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  justifyContent: "center",
  alignItems: "start",
  padding: "20px 0",
  maxWidth: "1200px",
  margin: "0 auto",
};

const cardStyles = {
  position: "relative",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const imageStyles = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
};

const cardContentStyles = {
  padding: "16px",
  flex: 1,
};

const cardBtnGroup = {
  marginTop: "12px",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
};
const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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

export default EventsByCategory;
