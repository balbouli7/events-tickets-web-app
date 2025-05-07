import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/userServices"; // Import the getEventById function from userServices
import { FaMapMarkerAlt, FaTicketAlt, FaCalendarAlt, FaListAlt } from "react-icons/fa"; // Replace FaCategory with FaListAlt

const EventDetail = () => {
  const { id } = useParams(); // Get the event ID from the URL params
  const navigate = useNavigate();

  const [event, setEvent] = useState(null); // State to store the event details
  const [loading, setLoading] = useState(true); // State to manage the loading state
  const [error, setError] = useState(null); // State to manage any errors

  useEffect(() => {
    // Fetch the event details when the component mounts
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        setError(null);
      } catch (error) {
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Run the effect when the event ID changes

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div style={styles.errorContainer}>
        Event not found
      </div>
    );
  }

  return (
    <div style={styles.eventDetailPage}>
      {/* Event Image */}
      <div style={styles.eventImage}>
        <img src={event.image} alt={event.title} style={styles.eventImageImg} />
      </div>

      {/* Event Details */}
      <div style={styles.eventInfo}>
        <h1 style={styles.eventTitle}>{event.title}</h1>
        <p style={styles.eventDescription}>{event.description}</p>

        <div style={styles.eventMeta}>
          <div style={styles.metaItem}>
            <FaMapMarkerAlt style={styles.icon} />
            <span>{event.location}</span>
          </div>

          <div style={styles.metaItem}>
            <FaListAlt style={styles.icon} />
            <span>{event.category.name}</span>
          </div>

          <div style={styles.metaItem}>
            <FaCalendarAlt style={styles.icon} />
            <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Ticket Types and Available Tickets */}
        <h3 style={styles.ticketTypesTitle}>
          <FaTicketAlt style={styles.icon} /> Ticket Types
        </h3>
        <ul style={styles.ticketList}>
          {event.ticketTypes.map((ticket, index) => (
            <li key={index} style={styles.ticketItem}>
              <strong>{ticket.type}:</strong> ${ticket.price} - {ticket.quantity} tickets available
            </li>
          ))}
        </ul>

        <p style={styles.availableTickets}>
          <strong>Available Tickets:</strong> {event.availableTickets}
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          style={styles.backButton}
        >
          Back
        </button>
      </div>
    </div>
  );
};

const styles = {
    eventDetailPage: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: "#333",
    },
    eventImage: {
      width: "100%",
      height: "50vh",
      overflow: "hidden",
      backgroundColor: "#e9ecef",
    },
    eventImageImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    eventInfo: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        padding: "40px",
        maxWidth: "1000px",
        margin: "40px auto", // fixed: no negative margin
        position: "relative",
        zIndex: 2,
      },
      
    eventTitle: {
      fontSize: "2.8rem",
      fontWeight: "700",
      color: "#1d3557",
      marginBottom: "15px",
    },
    eventDescription: {
      fontSize: "1.125rem",
      color: "#495057",
      lineHeight: "1.7",
      marginBottom: "30px",
    },
    eventMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: "30px",
      marginBottom: "30px",
      borderTop: "1px solid #dee2e6",
      borderBottom: "1px solid #dee2e6",
      padding: "20px 0",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      fontSize: "1rem",
      color: "#495057",
    },
    icon: {
      marginRight: "10px",
      fontSize: "1.25rem",
      color: "#457b9d",
    },
    ticketTypesTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#1d3557",
      marginBottom: "16px",
    //   display: "flex",
      alignItems: "center",
      textAlign:"center",
    },
    ticketList: {
      listStyle: "none",
      paddingLeft: "0",
      marginBottom: "20px",
    },
    ticketItem: {
      fontSize: "1rem",
      color: "#343a40",
      marginBottom: "10px",
    },
    availableTickets: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#212529",
      marginBottom: "20px",
    },
    backButton: {
      backgroundColor: "#457b9d",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    backButtonHover: {
      backgroundColor: "#1d3557",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "50px",
      fontSize: "1.25rem",
      color: "#6c757d",
    },
    errorContainer: {
      textAlign: "center",
      padding: "50px",
      color: "#e63946",
      fontSize: "1.25rem",
    },
  };
  

export default EventDetail;
