import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../api/userServices";
import { useNavigate } from "react-router-dom";
import useCategories from "../useCategory";

const CategoryEventShowcase = () => {
  const [events, setEvents] = useState([]);
  const { categories } = useCategories();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const getLastThreeEventsByCategory = (categoryName) => {
    return events
      .filter((event) => event.category?.name === categoryName)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  return (
    <div
      style={{
        padding: "50px",
        margin: "50px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {categories.slice(0, 3).map((cat) => {
        const catEvents = getLastThreeEventsByCategory(cat.name);

        return (
          <div key={cat._id} style={{ marginBottom: "40px" }}>
<h3
  style={{
    margin: "50px auto",
    maxWidth: "600px",
    color: "#2c3e50",
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    textShadow: "2px 2px 8px rgba(44, 62, 80, 0.2)",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    userSelect: "none",
    cursor: "default",
  }}
>
              {cat.name.toUpperCase()}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent:
                  catEvents.length === 1
                    ? "center"
                    : catEvents.length === 2
                    ? "center"
                    : "space-between",
                gap: "20px",
                maxWidth: "5000px",
                margin: "0 auto",
              }}
            >
              {catEvents.map((event, index) => (
                <div
                  key={event._id}
                  style={{
                    flex: "0 1 calc(33.333% - 14px)",
                    maxWidth: "calc(33.333% - 14px)",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onClick={() => navigate(`/events/${event._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div style={{ padding: "15px" }}>
                    <h4 style={{ marginBottom: "10px" }}>{event.title}</h4>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                      {new Date(event.date).toLocaleDateString()} -{" "}
                      {event.location}
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "0.85rem",
                        color: "#555",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryEventShowcase;
