import { useEffect, useState } from 'react';
import { getUserTickets, getQRCode } from '../../api/userServices';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getUserTickets(token);
      setTickets(data);
    };
    fetchTickets();
  }, [token]);

  return (
    <div>
      <h2>My Tickets</h2>
      {tickets.map((order) => (
        <div key={order._id} className="ticket-card">
          <h3>{order.event.title}</h3>
          <p>Date: {new Date(order.event.date).toLocaleDateString()}</p>
          <p>Location: {order.event.location}</p>
          {order.tickets.map((ticket, i) => (
            <div key={i}>
              <span>{ticket.ticketType} × {ticket.quantity}</span>
            </div>
          ))}
          <img
            src={getQRCode(order._id, token)}
            alt="QR Code"
            style={{ width: '150px', marginTop: '10px' }}
          />
        </div>
      ))}
    </div>
  );
};

export default UserTickets;
