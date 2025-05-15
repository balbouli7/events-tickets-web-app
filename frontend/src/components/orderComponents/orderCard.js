import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const styles = {
    card: {
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#007BFF',
    },
    detail: {
      fontSize: '16px',
      margin: '6px 0',
      color: '#333',
    },
    status: {
      fontWeight: '500',
      color:
        order.orderStatus === 'confirmed'
          ? '#28a745'
          : order.orderStatus === 'cancelled'
          ? '#dc3545'
          : '#ffc107',
    },
    link: {
      display: 'inline-block',
      marginTop: '10px',
      textDecoration: 'none',
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: '8px 14px',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
    },
    linkHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{order.event.title}</h3>
      <p style={styles.detail}>
        Date: {new Date(order.event.date).toLocaleDateString()}
      </p>
      <p style={styles.detail}>Total: ${order.totalAmount}</p>
      <p style={{ ...styles.detail, ...styles.status }}>
        Status: {order.orderStatus}
      </p>
      <Link
        to={`/orders/${order._id}`}
        style={styles.link}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.linkHover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.link.backgroundColor;
        }}
      >
        View Details
      </Link>
    </div>
  );
};

export default OrderCard;
