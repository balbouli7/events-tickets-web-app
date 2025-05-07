
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { createEvent } from "../../api/userServices";
import useCategories from "../useCategory";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    ticketTypes: [{ type: "", price: 0, quantity: 0 }],
    image: null,
  });

  const { categories, error: categoryError } = useCategories();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, e) => {
    const newTickets = [...eventData.ticketTypes];
    newTickets[index][e.target.name] = e.target.value;
    setEventData({
      ...eventData,
      ticketTypes: newTickets,
    });
  };

  const addTicketType = () => {
    setEventData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { type: "", price: 0, quantity: 0 }],
    }));
  };

  const handleImageChange = (e) => {
    setEventData({ ...eventData, image: e.target.files[0] });
  };

  const calculateAvailableTickets = () => {
    return eventData.ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.quantity || 0),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("category", eventData.category);
      formData.append("availableTickets", calculateAvailableTickets());
      
      // Stringify ticketTypes (as your backend expects)
      formData.append("ticketTypes", JSON.stringify(eventData.ticketTypes));

      // Append image if it exists
      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      await createEvent(formData);
      navigate("/admin/events");
    } catch (error) {
      let errorMessage = "Failed to create event";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      console.error("Detailed error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: "800px", paddingTop: "30px" }}>
      <Card bg="dark" text="light" className="p-4 shadow-lg">
        <Card.Body>
          <Card.Title as="h3" className="mb-4 text-center">
            Create New Event
          </Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}
          {categoryError && <Alert variant="warning">{categoryError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={eventData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={eventData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                 <option key={cat._id} value={cat._id}>
                 {cat.name}
               </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Event Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            <h5 className="mb-3">Ticket Types</h5>
            {eventData.ticketTypes.map((ticket, index) => (
              <Card key={index} className="mb-3 bg-secondary text-light p-3">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        name="type"
                        value={ticket.type}
                        onChange={(e) => handleTicketChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            ))}

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button variant="outline-info" onClick={addTicketType}>
                + Add Ticket Type
              </Button>
              <span>
                <strong>Total Tickets:</strong> {calculateAvailableTickets()}
              </span>
            </div>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </Form>

          <div className="mt-3">
            <Button
              variant="outline-light"
              onClick={() => navigate("/admin/events")}
            >
              ← Back to Events
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateEvent;