import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/userServices";
import {
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaChevronRight,
} from "react-icons/fa";
import { AuthContext } from "../../context.js/authContext";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketSelection, setTicketSelection] = useState({});

  useEffect(() => {
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
  }, [id]);

  const handleCheckout = () => {
    const selected = Object.entries(ticketSelection)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketType, quantity]) => {
        const ticket = event.ticketTypes.find((t) => t.type === ticketType);
        return {
          ticketType,
          quantity,
          price: ticket?.price || 0,
        };
      });

    if (selected.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const updatedEvent = {
      ...event,
      ticketTypes: event.ticketTypes.map((ticket) => {
        const selectedTicket = selected.find((t) => t.ticketType === ticket.type);
        if (selectedTicket) {
          return {
            ...ticket,
            quantity: ticket.quantity - selectedTicket.quantity,
          };
        }
        return ticket;
      }),
    };

    setEvent(updatedEvent);
    setTicketSelection({});

    sessionStorage.setItem("selectedTickets", JSON.stringify(selected));
    sessionStorage.setItem("selectedEvent", JSON.stringify(updatedEvent));
    navigate(`/checkout/${event._id}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h3>{error ? "Error Loading Event" : "Event Not Found"}</h3>
          <p>
            {error ||
              "The event you're looking for doesn't exist or may have been removed."}
          </p>
          <button
            onClick={() => (error ? window.location.reload() : navigate("/"))}
            style={styles.retryButton}
          >
            {error ? "Retry" : "Browse Events"}
          </button>
        </div>
      </div>
    );
  }

  const totalAvailableTickets = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );

  const soldTickets = event.ticketTypes.reduce(
    (sum, ticket) => sum + ((ticket.initialQuantity || 0) - ticket.quantity),
    0
  );

  const calculateTotalTickets = () => {
    return event.ticketTypes.reduce(
      (sum, ticket) => sum + (ticket.initialQuantity || 0),
      0
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.imageContainer}>
          <img
            src={event.image}
            alt={event.title}
            style={styles.eventImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/800x400?text=Event+Image";
            }}
          />
        </div>

        <div style={styles.detailsContainer}>
          <div style={styles.detailsHeader}>
            <div>
              <span style={styles.categoryBadge}>{event.category.name}</span>
              <h1 style={styles.eventTitle}>{event.title}</h1>
              <div style={styles.dateTimeContainer}>
                <FaCalendarAlt style={styles.dateTimeIcon} />
                <span style={styles.dateTimeText}>
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {" • "}
                  {new Date(event.date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div style={styles.locationContainer}>
                <FaMapMarkerAlt style={styles.locationIcon} />
                <span style={styles.locationText}>{event.location}</span>
              </div>
            </div>
          </div>

          <div style={styles.descriptionContainer}>
            <h3 style={styles.sectionTitle}>About the Event</h3>
            <p style={styles.eventDescription}>{event.description}</p>
          </div>

          <div style={styles.ticketsContainer}>
            <div style={{ marginBottom: "25px" }}>
              <h3 style={styles.sectionTitle}>
                <FaTicketAlt style={{ marginRight: 10 }} />
                Available Tickets
              </h3>
              {user?.role === "admin" && (
                <div style={styles.adminTicketInfo}>
                  <p style={styles.totalTicketInfo}>
                    Total Capacity: <span>{calculateTotalTickets()}</span>
                  </p>
                  <p style={styles.totalTicketInfo}>
                    Total Available: <span>{totalAvailableTickets}</span>
                  </p>
                  <p style={styles.totalTicketInfo}>
                    Total Sold: <span>{soldTickets}</span>
                  </p>
                </div>
              )}
            </div>

            {totalAvailableTickets === 0 ? (
              <div style={styles.soldOutBanner}>🎟️ Sold Out 🎟️</div>
            ) : (
              <div style={styles.ticketGrid}>
                {event.ticketTypes.map((ticket) => (
                  <div key={ticket._id} style={styles.ticketCard}>
                    <div style={styles.ticketHeader}>
                      <h4 style={styles.ticketType}>{ticket.type}</h4>
                      <p style={styles.ticketPrice}>{ticket.price}DT</p>
                    </div>
                    {user?.role === "admin" && (
                      <p style={styles.ticketAvailability}>
                        {ticket.quantity} tickets remaining
                      </p>
                    )}
                    <div style={styles.ticketControls}>
                      <button
                        style={styles.quantityButton}
                        onClick={() =>
                          setTicketSelection({
                            ...ticketSelection,
                            [ticket.type]: Math.max(
                              (ticketSelection[ticket.type] || 0) - 1,
                              0
                            ),
                          })
                        }
                        disabled={(ticketSelection[ticket.type] || 0) <= 0}
                      >
                        -
                      </button>
                      <span style={styles.quantityDisplay}>
                        {ticketSelection[ticket.type] || 0}
                      </span>
                      <button
                        style={styles.quantityButton}
                        onClick={() =>
                          setTicketSelection({
                            ...ticketSelection,
                            [ticket.type]: Math.min(
                              (ticketSelection[ticket.type] || 0) + 1,
                              ticket.quantity
                            ),
                          })
                        }
                        disabled={
                          (ticketSelection[ticket.type] || 0) >= ticket.quantity
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={styles.actionButtons}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <FaArrowLeft style={{ marginRight: 8 }} />
              Back
            </button>
            <button
              onClick={handleCheckout}
              style={styles.checkoutButton}
              disabled={
                Object.values(ticketSelection).every((qty) => qty <= 0) ||
                totalAvailableTickets === 0
              }
            >
              Proceed to Checkout
              <FaChevronRight style={{ marginLeft: 8 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#2d3748",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "400px",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "30px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  detailsHeader: {
    marginBottom: "30px",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "25px",
  },
  categoryBadge: {
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    display: "inline-block",
    marginBottom: "15px",
  },
  eventTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 15px 0",
    lineHeight: "1.2",
  },
  dateTimeContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    color: "#4b5563",
  },
  dateTimeIcon: {
    marginRight: "10px",
    color: "#4f46e5",
  },
  dateTimeText: {
    fontSize: "16px",
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    color: "#4b5563",
  },
  locationIcon: {
    marginRight: "10px",
    color: "#4f46e5",
  },
  locationText: {
    fontSize: "16px",
  },
  descriptionContainer: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },
  eventDescription: {
    fontSize: "20px",
    lineHeight: "1.7",
    color: "#222222",
    margin: "0",
  },
  ticketsContainer: {
    marginBottom: "40px",
  },
  adminTicketInfo: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  totalTicketInfo: {
    fontSize: "15px",
    color: "#4b5563",
    margin: "5px 0",
  },
  totalTicketInfo: {
    fontSize: "15px",
    color: "#4b5563",
    margin: "5px 0",
  },
  totalTicketInfo: {
    fontSize: "15px",
    color: "#4b5563",
    margin: "5px 0",
  },
  totalTicketInfo: {
    fontSize: "15px",
    color: "#4b5563",
    margin: "5px 0",
  },
  ticketGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  ticketCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  ticketType: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0",
  },
  ticketPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#4f46e5",
    margin: "0",
  },
  ticketAvailability: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 15px 0",
    fontStyle: "italic",
  },
  ticketControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid #e5e7eb",
  },
  quantityButton: {
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  quantityDisplay: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    minWidth: "40px",
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "30px",
    borderTop: "1px solid #f0f0f0",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ED0800",
    border: "1px solid #e5e7eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "12px 24px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f9fafb",
    },
  },
  checkoutButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4338ca",
    },
    ":disabled": {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "#4b5563",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderLeftColor: "#4f46e5",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  errorCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  retryButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "20px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4338ca",
    },
  },
  soldOutBanner: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#dc2626",
    padding: "30px",
    backgroundColor: "#ffe4e6",
    borderRadius: "10px",
    marginTop: "20px",
  },
};

export default EventDetail;
