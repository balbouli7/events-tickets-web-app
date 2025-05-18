// TicketDisplay.js
import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteOrder } from "../../api/userServices";
import { OrdersContext } from "../../context.js/orderContext";

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "3rem auto",
    padding: "2rem",
    background: "#0f172a", // Dark navy
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    color: "#f1f5f9",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#38bdf8", // Neon blue
  },
  ticketInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  infoItem: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1.5rem",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginBottom: "0.25rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  qrContainer: {
    textAlign: "center",
    margin: "3rem 0",
    padding: "2rem",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  },
  qrImage: {
    width: "280px",
    height: "280px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
    border: "3px solid #38bdf8",
  },
  qrCaption: {
    marginTop: "1rem",
    color: "#cbd5e1",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  ticketList: {
    padding: 0,
    margin: "0.5rem 0",
    listStyle: "none",
  },
  ticketItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontSize: "1rem",
  },
  lastTicketItem: {
    padding: "0.5rem 0",
    fontSize: "1rem",
  },
  noData: {
    textAlign: "center",
    padding: "2rem",
    color: "#64748b",
    fontSize: "1.2rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "3rem",
  },
  backButton: {
    backgroundColor: "#9333ea", // Neon purple
    color: "#fff",
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0 0 10px #9333ea, 0 0 20px #9333ea inset",
  },
  emoji: {
    marginRight: "0.5rem",
  },
};




const TicketDisplay = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshOrders } = useContext(OrdersContext);
  

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, qrRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/tickets/qrcode/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setTicketData(ticketRes.data);
        setQrCodes(qrRes.data.qrCodes);
        
        // Now delete the order
        await deleteOrder(orderId);
        await refreshOrders();

      } catch (err) {
        console.error("Error fetching data or deleting order:", err);
        setError("Failed to load ticket or QR code data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
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
        <span style={styles.emoji}>🎟️</span> YOUR TICKET
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
