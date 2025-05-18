import { useEffect, useState } from "react";
import { getUserTickets } from "../../api/userServices";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getUserTickets(token);
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Could not load your tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading tickets...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🎟️ Your Tickets</h2>
      {tickets.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no tickets.</p>
      ) : (
        tickets.map((ticket, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              backgroundColor: "red",
            }}
          >
            <p><strong>Event:</strong> {ticket.event.title}</p>
            <p><strong>Date:</strong> {new Date(ticket.event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {ticket.event.location}</p>
            <p><strong>Type:</strong> {ticket.ticketType}</p>
            <p><strong>Quantity:</strong> {ticket.quantity}</p>
            <p><strong>Purchased On:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserTickets;
