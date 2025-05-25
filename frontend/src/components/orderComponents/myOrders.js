import { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserOrders, deleteOrder } from '../../api/userServices';
import { OrdersContext } from '../../context.js/orderContext';

const MyOrders = () => {
  const { orders, setOrders ,refreshOrders } = useContext(OrdersContext);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

 useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleDelete = async (id, skipConfirm = false) => {
    if (skipConfirm || window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        await refreshOrders(); // Refresh after deletion
      } catch (err) {
        console.error("Failed to delete order", err);
        alert("Failed to delete order.");
      }
    }
  };

  const styles = {
    container: {
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      margin: "40px auto",
      maxWidth: "1200px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#007BFF",
      color: "#fff",
      padding: "14px",
      textAlign: "left",
      fontWeight: "600",
    },
    td: {
      padding: "14px",
      borderBottom: "1px solid #ddd",
      fontSize: "15px",
      verticalAlign: "top",
    },
    trHover: {
      transition: "background 0.2s",
    },
    secondColumn: {
      color: "#0056b3",
      fontWeight: "500",
    },
    thirdColumn: {
      color: "#28a745",
      fontWeight: "600",
    },
    fourthColumn: {
      textTransform: "capitalize",
      fontWeight: "500",
    },
    ticketLine: {
      marginBottom: "4px",
      fontSize: "14px",
    },
    link: {
      color: "#fff",
      backgroundColor: "#007BFF",
      padding: "8px 14px",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "500",
      display: "inline-block",
      transition: "background-color 0.3s ease",
    },
    linkHover: {
      backgroundColor: "#0056b3",
    },
    deleteButton: {
      color: "#fff",
      backgroundColor: "#dc3545",
      padding: "8px 14px",
      borderRadius: "6px",
      fontWeight: "500",
      display: "inline-block",
      cursor: "pointer",
      marginLeft: "10px",
      transition: "background-color 0.3s ease",
    },
    deleteButtonHover: {
      backgroundColor: "black",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Event</th>
            <th style={styles.th}>Tickets</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Payment</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>Details</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={styles.trHover}>
              <td style={{ ...styles.td, ...styles.secondColumn }}>
                {order.event?.title || "Deleted Event"}
              </td>
              <td style={styles.td}>
                {order.tickets.map((t, i) => (
                  <div key={i} style={styles.ticketLine}>
                    {t.ticketType} × {t.quantity}
                  </div>
                ))}
              </td>
              <td style={{ ...styles.td, ...styles.thirdColumn }}>{order.totalAmount} DT</td>
              <td style={{ ...styles.td, ...styles.fourthColumn }}>
                {order.paymentMethod} ({order.paymentStatus})
              </td>
              <td style={{ ...styles.td, ...styles.fourthColumn }}>
                {order.orderStatus}
              </td>
              <td style={styles.td}>
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td style={styles.td}>
                <Link
                  to={`/orders/${order._id}`}
                  style={styles.link}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = styles.linkHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = styles.link.backgroundColor)
                  }
                >
                  View
                </Link>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDelete(order._id)}
                  style={styles.deleteButton}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = styles.deleteButton.backgroundColor)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;