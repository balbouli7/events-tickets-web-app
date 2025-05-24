import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context.js/authContext";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../../api/userServices";
import LoadingSpinner from "../../spinner";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const { token } = useContext(AuthContext);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("event");
  const [dateValue, setDateValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets(token);
        // Sort by purchase date (newest first)
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTickets(sorted);
        setFilteredTickets(sorted);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Could not load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const handleSearchTypeChange = (e) => {
    const type = e.target.value;
    setSearchType(type);
    setSearchTerm("");
    setDateValue("");
    setFilteredTickets(tickets);
  };

  const handleTextSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // If search bar is cleared, show all tickets again
      setFilteredTickets(tickets);
      return;
    }

    const filtered = tickets.filter((ticket) => {
      if (searchType === "event") {
        return ticket.event.title.toLowerCase().includes(term);
      }
      if (searchType === "user") {
        return (
          ticket.user?.name?.toLowerCase().includes(term) ||
          (ticket.user?.firstName &&
            ticket.user?.firstName.toLowerCase().includes(term)) ||
          (ticket.user?.lastName &&
            ticket.user?.lastName.toLowerCase().includes(term))
        );
      }
      return true;
    });

    setFilteredTickets(filtered);
  };

  const handleDateSearch = (e) => {
    const date = e.target.value;
    setDateValue(date);

    if (!date) {
      setFilteredTickets(tickets);
      return;
    }

    const filtered = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.event.date)
        .toISOString()
        .split("T")[0];
      return ticketDate === date;
    });

    setFilteredTickets(filtered);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div>
      <button
        className="myTicketsBtn"
        onClick={() => navigate("/admin/myTickets")}
      >
        My Tickets
      </button>
      <div className="tickets-container">
        <h2>All Tickets</h2>

        <div className="search-controls">
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="search-type-select"
          >
            <option value="event">Search by Event</option>
            <option value="user">Search by Name</option>
            <option value="date">Search by Date</option>
          </select>
          {searchType === "event" ? (
            <input
              type="text"
              placeholder="Search by event name..."
              value={searchTerm}
              onChange={handleTextSearch}
              className="search-input"
            />
          ) : searchType === "user" ? (
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={handleTextSearch}
              className="search-input"
            />
          ) : (
            <input
              type="date"
              value={dateValue}
              onChange={handleDateSearch}
              className="date-input"
            />
          )}
        </div>

        {filteredTickets.length === 0 ? (
          <p className="no-tickets">No matching tickets found.</p>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.event.title}</h3>
              <p>
                <strong>Purchased By:</strong>{" "}
                {ticket.user.firstName + " " + ticket.user.lastName}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(ticket.event.date).toLocaleString()}
              </p>

              <p>
                <strong>Location:</strong> {ticket.event.location}
              </p>

              <div className="ticket-types">
                <strong>Tickets:</strong>
                <ul>
                  {ticket.tickets.map((t, index) => (
                    <li key={index}>
                      {t.ticketType} – Quantity: {t.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>Purchased On:</strong>{" "}
                {new Date(ticket.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                className="view-button"
              >
                View Details
              </button>
            </div>
          ))
        )}

        <style>{`
        .tickets-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: "Poppins", sans-serif;
          color: #fff;
          background: linear-gradient(135deg, #1e1e2f, #2c3e50);
          border-radius: 12px;
        }

        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 600;
          color: #00d8ff;
        }

        .search-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .search-type-select,
        .search-input,
        .date-input {
          padding: 0.7rem;
          border-radius: 6px;
          border: none;
          min-width: 200px;
          font-size: 1rem;
          background-color: #ffffff;
          color: #333;
          outline: none;
        }

        .ticket-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 216, 255, 0.1);
          transition: transform 0.2s ease;
        }

        .ticket-card:hover {
          transform: scale(1.02);
        }

        .ticket-card h3 {
          margin-top: 0;
          color: #f1c40f;
          font-size: 1.5rem;
        }

        .ticket-types ul {
          list-style: none;
          padding-left: 0;
          margin: 0.5rem 0;
        }

        .ticket-types li {
          padding: 0.25rem 0;
          color: #ecf0f1;
        }

        .view-button {
          background-color: #00d8ff;
          color: #1e1e2f;
          font-weight: 600;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .view-button:hover {
          background-color: #00aacc;
          transform: scale(1.05);
        }

        .loading-container,
        .error-container,
        .no-tickets {
          text-align: center;
          margin-top: 2rem;
          font-size: 1.2rem;
        }

        .error-container {
          color: #ff4c4c;
        }

        .no-tickets {
          color: #bdc3c7;
        }

.myTicketsBtn {
  display: inline-block;
  padding: 12px 20px;
  margin-bottom: 20px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.myTicketsBtn:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.myTicketsBtn:active {
  background-color: #1e7e34;
  transform: translateY(0);
}

        @media (max-width: 600px) {
          .search-controls {
            flex-direction: column;
            align-items: center;
          }
        }

      `}</style>
      </div>
    </div>
  );
};
export default AllTickets;
