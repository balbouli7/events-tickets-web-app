import { useContext, useEffect, useState } from "react";
import { createOrder } from "../../api/userServices";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context.js/cartContext";
import { OrdersContext } from "../../context.js/orderContext";

const CheckoutForm = () => {
  const [event, setEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [orderId, setOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { refreshOrders } = useContext(OrdersContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEvent = sessionStorage.getItem("selectedEvent");
    const storedTickets = sessionStorage.getItem("selectedTickets");

    if (storedEvent && storedTickets) {
      setEvent(JSON.parse(storedEvent));
      setSelectedTickets(JSON.parse(storedTickets));
    } else {
      alert("Missing checkout data.");
      navigate("/");
    }
  }, []);

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedTickets.reduce(
      (total, ticket) => total + ticket.price * ticket.quantity,
      0
    );
  };

  const handleCreateOrder = async () => {
    if (!event || selectedTickets.length === 0) {
      alert("Invalid order data");
      return;
    }

    const orderData = {
      event: event._id,
      tickets: selectedTickets,
      paymentMethod,
    };

    try {
      const token = sessionStorage.getItem("token");
      const response = await createOrder(orderData, token);
      const newOrder = response.order;

      setOrderId(newOrder._id);
      addToCart(newOrder);
      await refreshOrders();
      setShowModal(true); // Show modal after successful order
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>

      {event && (
        <>
          <h3 style={styles.eventTitle}>{event.title}</h3>
          <ul style={styles.ticketList}>
            {selectedTickets.map((ticket, i) => (
              <li key={i} style={styles.ticketItem}>
                {ticket.ticketType} — Quantity: {ticket.quantity} — Price: {ticket.price}DT × {ticket.quantity} = {ticket.price * ticket.quantity}DT
              </li>
            ))}
          </ul>
          <div style={styles.totalPriceContainer}>
            <h3 style={styles.totalPriceLabel}>Total Price:</h3>
            <p style={styles.totalPrice}>{calculateTotalPrice()}DT</p>
          </div>
        </>
      )}

      <h3 style={styles.label}>Payment Method</h3>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={styles.select}
      >
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="crypto">Crypto</option>
      </select>

      <div style={styles.buttonGroup}>
        {!orderId ? (
          <>
            <button onClick={handleCreateOrder} style={styles.primaryBtn}>
              Confirm Order
            </button>
            <button
              onClick={() => navigate(`/admin/events/${event._id}`)}
              style={styles.secondaryBtn}
            >
              Back
            </button>
          </>
        ) : null}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Order Created Successfully!</h3>
            <div style={styles.modalActions}>
              <button
                style={styles.primaryBtn}
                onClick={() => navigate(`/admin/payment/${orderId}`)}
              >
                Proceed to Payment
              </button>
              <button
                style={{ ...styles.secondaryBtn, marginLeft: "10px" }}
                onClick={() => navigate("/admin/events")}
              >
                Keep Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
  },
  eventTitle: {
    color: "#333",
    fontSize: "20px",
    marginBottom: "10px",
  },
  ticketList: {
    paddingLeft: "20px",
    marginBottom: "20px",
  },
  ticketItem: {
    marginBottom: "15px",
    color: "#555",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  select: {
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  primaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#4338ca",
    },
  },
  secondaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#d1d5db",
    },
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
  modalTitle: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  totalPriceContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#f0f7ff",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  totalPriceLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  totalPrice: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#4f46e5",
    margin: 0,
  },
};