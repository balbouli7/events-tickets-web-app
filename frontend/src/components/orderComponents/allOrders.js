import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context.js/authContext";
import { getAllOrders } from "../../api/userServices";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders(token);
      setOrders(data);
    };
    fetchOrders();
  }, [token]);

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
    myOrdersBtn: {
      marginBottom: "20px",
      padding: "10px 16px",
      backgroundColor: "#28a745",
      color: "#fff",
      fontWeight: "500",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
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
    firstColumn: {
      color: "#333",
      fontWeight: "500",
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Orders</h2>

      <button style={styles.myOrdersBtn} onClick={() => navigate("/admin/MyOrders")}>
        My Orders
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Event</th>
            <th style={styles.th}>Tickets</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Payment</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={styles.trHover}>
              <td style={{ ...styles.td, ...styles.firstColumn }}>
                {order.user?.firstName} {order.user?.lastName}
              </td>
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
              <td style={{ ...styles.td, ...styles.thirdColumn }}>
                {order.totalAmount}
              </td>
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
                  to={`/admin/orders/${order._id}`}
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      styles.linkHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.link.backgroundColor;
                  }}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;
