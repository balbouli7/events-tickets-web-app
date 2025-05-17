// TicketDisplay.js
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { verifyStripePayment } from "../../api/userServices";
import { OrdersContext } from "../../context.js/orderContext";
import { useContext } from "react";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  ticketInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  qrContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "2rem 0",
  },
  qrImage: {
    width: "250px",
    height: "250px",
    border: "1px solid #eee",
    padding: "1rem",
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: "1.5rem",
  },
  label: {
    fontWeight: "bold",
    marginRight: "0.5rem",
  },
};

const TicketDisplay= () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tickets/qrcode/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Important for image fetching
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setTicketData({ qrCodeUrl: imageUrl });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load QR code", err);
        setLoading(false);
      }
    };

    fetchTicket();
  }, [orderId, token]);
  

  if (loading) return <p style={{ textAlign: "center" }}>Loading ticket...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Your Ticket is Ready!</h2>
      <p>Present this QR code at the event entrance:</p>
      {ticketData?.qrCodeUrl && (
        <img
          src={ticketData.qrCodeUrl}
          alt="QR Code Ticket"
          style={{ width: "300px", marginTop: "20px" }}
        />
      )}
    </div>
  );
};


export default TicketDisplay;
