import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsByCategory } from "../../api/userServices";

const EventsByCategory = () => {
  const { categoryId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState(null);

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

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={styles.container}>
      {events.length === 0 ? (
        <p>No events found in this category.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => {
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
                onClick={() => navigate(`/admin/events/${event._id}`)}
              >
                <img src={event.image} alt={event.title} style={styles.image} />
                <h3 style={styles.title}>{event.title}</h3>
                <p style={styles.date}>
                  {new Date(event.date).toLocaleDateString({
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/admin/allCategories")}
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
  );
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
