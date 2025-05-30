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
        setError("Failed to load events. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [categoryId]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchBy]);

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
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? "0 8px 20px rgba(0,0,0,0.15)"
                      : "0 4px 12px rgba(0,0,0,0.08)",
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
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }}
                    />
                  )}
                  <div style={cardContentStyles}>
                    {event.category?.name && (
                      <span style={categoryTagStyle}>{event.category.name}</span>
                    )}
                    
                    <h3 style={titleStyle}>{event.title}</h3>
                    
                    <p style={detailStyle}>
                      <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    
                    <p style={detailStyle}>
                      <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                    
                    {event.description && (
                      <p style={descriptionStyle}>{event.description}</p>
                    )}
                    
                    <div style={cardBtnGroup} onClick={(e) => e.stopPropagation()}>
                      <button
                        style={viewBtnStyle}
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        View Details
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

// Styles (same as GetAllEvents)
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
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  flex: 1,
  minWidth: "120px",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#333",
  }
};

const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    border: "1px solid #f0f0f0",
  },
};

const cardContentStyles = {
  padding: "20px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const cardBtnGroup = {
  marginTop: "auto",
  paddingTop: "15px",
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
};

const categoryTagStyle = {
  backgroundColor: "#f0f0f0",
  color: "#555",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "10px",
  alignSelf: "flex-start",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  color: "#222",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const detailStyle = {
  fontSize: "14px",
  color: "#666",
  margin: "4px 0",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const iconStyle = {
  width: "16px",
  height: "16px",
  color: "#888",
};

const descriptionStyle = {
  fontSize: "14px",
  color: "#555",
  margin: "10px 0",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default EventsByCategory;