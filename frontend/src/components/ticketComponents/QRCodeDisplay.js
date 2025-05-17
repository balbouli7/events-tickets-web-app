// TicketDisplay.js
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "3rem auto",
    padding: "3rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#2d3748",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
    color: "#1a365d",
    fontSize: "2rem",
    fontWeight: "600",
    letterSpacing: "-0.5px",
  },
  ticketInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
    padding: "2rem",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    borderLeft: "4px solid #4f46e5",
  },
  infoItem: {
    marginBottom: "1rem",
    lineHeight: "1.6",
    fontSize: "1rem",
  },
  label: {
    fontWeight: "600",
    color: "#4f46e5",
    marginRight: "0.5rem",
    display: "inline-block",
    minWidth: "100px",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "3rem 0",
  },
  qrImage: {
    width: "300px",
    height: "300px",
    border: "1px solid #e2e8f0",
    padding: "1.5rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 15px rgba(0, 0, 0, 0.03)",
  },
  ticketList: {
    listStyleType: "none",
    padding: 0,
    margin: "0.5rem 0 0 0",
  },
  ticketItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #edf2f7",
  },
  lastTicketItem: {
    padding: "0.5rem 0",
    borderBottom: "none",
  },
  noData: {
    textAlign: "center",
    padding: "2rem",
    color: "#718096",
    fontSize: "1.1rem",
  },
  qrCaption: {
    marginTop: "1.5rem",
    color: "#718096",
    fontSize: "0.9rem",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },
  backButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4338ca",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 10px rgba(79, 70, 229, 0.3)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  emoji: {
    marginRight: "0.5rem",
  },
};

const TicketDisplay = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);

  const ticketData = state?.ticketData;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tickets/qrcode/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQrCodes(response.data.qrCodes); // array of base64 images
      } catch (err) {
        console.error("Failed to load QR codes", err);
      }
    };

    fetchQrCodes();
  }, [orderId, token]);

  const handleBackToEvents = () => {
    navigate("/admin/events");
  };

  if (!ticketData) {
    return <p style={styles.noData}>No ticket data found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <span style={styles.emoji}>🎟️</span> Ticket Confirmation
      </h2>

      <div style={styles.ticketInfo}>
        <div style={styles.infoItem}>
          <span style={styles.label}>Event:</span> {ticketData.event.title}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Date:</span>{" "}
          {new Date(ticketData.event.date).toLocaleString()}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Location:</span>{" "}
          {ticketData.event.location}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Name:</span> {ticketData.user.name}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Email:</span> {ticketData.user.email}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Total Paid:</span>
          {ticketData.totalAmount.toFixed(2)}DT
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Purchased At:</span>{" "}
          {new Date(ticketData.purchaseDate).toLocaleString()}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Tickets:</span>
          <ul style={styles.ticketList}>
            {ticketData.tickets.map((ticket, idx) => (
              <li
                key={idx}
                style={
                  idx === ticketData.tickets.length - 1
                    ? styles.lastTicketItem
                    : styles.ticketItem
                }
              >
                {ticket.ticketType} × {ticket.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={styles.qrContainer}>
        {qrCodes.length > 0 &&
          qrCodes.map((src, idx) => (
            <div
              key={idx}
              style={{ marginBottom: "2rem", textAlign: "center" }}
            >
              <img
                src={src}
                alt={`QR Code ${idx + 1}`}
                style={styles.qrImage}
              />
              <p style={styles.qrCaption}>
                Ticket #{idx + 1} – Present this QR code at the event entrance
              </p>
            </div>
          ))}
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleBackToEvents} style={styles.backButton}>
          Back to Events
        </button>
      </div>
    </div>
  );
};

export default TicketDisplay;
