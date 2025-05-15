import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../api/userServices';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(id, token);
      setOrder(data);
    };
    fetchOrder();
  }, [id, token]);

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '18px',
          color: '#555'
        }}>
          Loading Order Details...
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      maxWidth: '850px',
      margin: '60px auto',
      padding: '40px',
      borderRadius: '18px',
      backgroundColor: '#fff',
      boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
      fontFamily: 'Inter, sans-serif',
      color: '#222',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
    },
    backBtn: {
      backgroundColor: '#6366f1',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background-color 0.3s',
    },
    payBtn: {
      backgroundColor: '#28a745',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '20px',
      transition: 'background-color 0.3s',
    },
    section: {
      marginBottom: '24px',
      paddingBottom: '12px',
      borderBottom: '1px solid #eee',
    },
    label: {
      fontWeight: '600',
      color: '#666',
      display: 'block',
      marginBottom: '4px',
    },
    value: {
      fontSize: '16px',
      marginBottom: '10px',
    },
    ticketList: {
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      padding: '20px',
    },
    ticketItem: {
      padding: '10px 0',
      borderBottom: '1px solid #e1e1e1',
      fontSize: '15px',
      color: '#333',
    },
    ticketItemLast: {
      padding: '10px 0',
      fontSize: '15px',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Order #{order._id}</h2>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      </div>

      <div style={styles.section}>
        <div>
          <span style={styles.label}>Event</span>
          <div style={styles.value}>{order.event.title}</div>
        </div>
        <div>
          <span style={styles.label}>Event Date</span>
          <div style={styles.value}>{new Date(order.event.date).toLocaleDateString()}</div>
        </div>
      </div>

      <div style={styles.section}>
        <div>
          <span style={styles.label}>User</span>
          <div style={styles.value}>{order.user.firstName} {order.user.lastName}</div>
        </div>
        <div>
          <span style={styles.label}>Email</span>
          <div style={styles.value}>{order.user.email}</div>
        </div>
      </div>

      <div style={styles.section}>
        <div>
          <span style={styles.label}>Payment Method</span>
          <div style={styles.value}>{order.paymentMethod}</div>
        </div>
        <div>
          <span style={styles.label}>Order Status</span>
          <div style={styles.value}>{order.orderStatus}</div>
        </div>
        <div>
          <span style={styles.label}>Payment Status</span>
          <div style={styles.value}>{order.paymentStatus}</div>
        </div>
        <div>
          <span style={styles.label}>Total Amount</span>
          <div style={styles.value}>${order.totalAmount}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={{ marginBottom: '10px', color: '#333' }}>Tickets</h4>
        <div style={styles.ticketList}>
          {order.tickets.map((ticket, idx) => (
            <div key={idx} style={idx === order.tickets.length - 1 ? styles.ticketItemLast : styles.ticketItem}>
              <strong>{ticket.ticketType}</strong> × {ticket.quantity}
            </div>
          ))}
        </div>
      </div>

      {order.paymentStatus !== 'paid' && (
        <button
          onClick={() => navigate(`/admin/payment/${order._id}`)}
          style={styles.payBtn}
        >
          Pay It
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
