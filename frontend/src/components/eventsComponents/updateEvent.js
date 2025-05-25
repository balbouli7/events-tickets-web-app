import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/userServices";
import useCategories from "../useCategory";

const UpdateEvent = ({ initialData, token }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    ticketTypes: [],
    image: null,
  });

  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { categories } = useCategories();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetchLoading(true);
        const response = await getEventById(id);
        if (response) {
          setFormData({
            title: response.title || "",
            description: response.description || "",
            date: response.date || "",
            location: response.location || "",
            category: response.category?._id || "",
            ticketTypes:
              response.ticketTypes?.map((t) => ({
                type: t.type || "",
                price: t.price || 0,
                quantity: t.quantity || 0,
                // Ensure initialQuantity is set properly - use quantity if initialQuantity doesn't exist
                initialQuantity: t.initialQuantity || t.quantity || 0,
              })) || [],
            image: null,
          });
          setExistingImageUrl(response.image || "");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setMessage("Failed to load event data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    if (!initialData) {
      fetchEvent();
    } else {
      setFormData(initialData);
      setFetchLoading(false);
    }
  }, [id, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, date, location, category, ticketTypes, image } =
      formData;

    if (!title || !description || !date || !location || !category) {
      setMessage("Please fill in all required fields.");
      return;
    }

    for (const ticket of ticketTypes) {
      if (!ticket.type || ticket.price <= 0 || ticket.quantity <= 0) {
        setMessage(
          "Each ticket must have a type, price > 0, and quantity > 0."
        );
        return;
      }
    }

    try {
      setLoading(true);
      const updatedData = new FormData();
      updatedData.append("title", formData.title);
      updatedData.append("description", formData.description);
      updatedData.append("date", formData.date);
      updatedData.append("location", formData.location);
      updatedData.append("category", formData.category);

      // Prepare ticket types - send both quantity and initialQuantity
      const ticketData = formData.ticketTypes.map((ticket) => ({
        type: ticket.type,
        price: ticket.price,
        quantity: ticket.quantity,
        initialQuantity: ticket.initialQuantity,
      }));

      // Stringify the ticket data properly
      updatedData.append("ticketTypes", JSON.stringify(ticketData));

      if (formData.image) {
        updatedData.append("image", formData.image);
      }

      const res = await updateEvent(id, updatedData, token);
      setMessage(res.message || "Event updated");
      navigate("/events");
    } catch (err) {
      setMessage(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Update Event</h2>

      {message && <p style={styles.message}>{message}</p>}
      {fetchLoading && <p>Loading event data...</p>}

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={{ ...styles.input, height: "100px" }}
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date.split("T")[0]}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        style={styles.input}
        required
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <h4 style={styles.subheading}>Ticket Types</h4>
      {formData.ticketTypes.map((ticket, index) => (
        <div key={index} style={styles.ticketRow}>
          <input
            type="text"
            placeholder="Type"
            value={ticket.type}
            onChange={(e) => {
              const updated = [...formData.ticketTypes];
              updated[index].type = e.target.value;
              setFormData((prev) => ({ ...prev, ticketTypes: updated }));
            }}
            style={styles.ticketInput}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={ticket.price === 0 ? "" : ticket.price}
            onChange={(e) => {
              const updated = [...formData.ticketTypes];
              updated[index].price = Number(e.target.value);
              setFormData((prev) => ({ ...prev, ticketTypes: updated }));
            }}
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={ticket.quantity <= 0 ? "" : ticket.quantity}
            onChange={(e) => {
              const updated = [...formData.ticketTypes];
              const newQty = Number(e.target.value) || 0; // Ensure we don't get NaN
              updated[index].quantity = newQty;
              // Maintain initialQuantity if it's not set
              if (!updated[index].initialQuantity) {
                updated[index].initialQuantity = newQty;
              }
              setFormData((prev) => ({ ...prev, ticketTypes: updated }));
            }}
            min="1"
            required
          />

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
              }))
            }
            style={styles.removeBtn}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            ticketTypes: [
              ...prev.ticketTypes,
              {
                type: "",
                price: 0,
                quantity: 0,
                initialQuantity: 0, // Make sure both are set
              },
            ],
          }))
        }
        style={styles.addBtn}
      >
        + Add Ticket Type
      </button>

      <div style={{ marginTop: "20px" }}>
        <label style={styles.label}>Event Image:</label>
        {formData.image ? (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="New"
            className="preview-image"
            style={styles.image}
          />
        ) : existingImageUrl ? (
          <img
            src={existingImageUrl}
            alt="Current"
            className="preview-image"
            style={styles.image}
          />
        ) : (
          <p>No image available</p>
        )}

        <label htmlFor="image-upload" style={styles.uploadLabel}>
          Upload New Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.hiddenFileInput}
        />
      </div>

      <div style={styles.buttonRow}>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Updating..." : "Update Event"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/events")}
          style={styles.cancelBtnBottom}
        >
          ⬅ Cancel
        </button>
      </div>

      {/* Image hover zoom style */}
      <style>{`
        .preview-image {
          transition: transform 0.3s ease-in-out;
          cursor: pointer;
        }
        .preview-image:hover {
          transform: scale(2.1);
        }
      `}</style>
    </form>
  );
};

const styles = {
  form: {
    margin: "auto",
    padding: "40px",
    maxWidth: "1020px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "600",
    color: "#1e1e2f",
    marginBottom: "10px",
  },
  message: {
    color: "#e74c3c",
    backgroundColor: "#fceae9",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outlineColor: "#20c997",
    backgroundColor: "#fafafa",
  },
  subheading: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: "20px",
    marginBottom: "10px",
  },
  ticketRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  ticketInput: {
    flex: "1",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fdfdfd",
  },
  addBtn: {
    padding: "10px 18px",
    backgroundColor: "#20c997",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  removeBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#2c3e50",
  },
  uploadLabel: {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: "#6f42c1",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  hiddenFileInput: {
    display: "none",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "30px",
  },
  submitBtn: {
    padding: "12px 26px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtnBottom: {
    marginTop: "40px",
    alignSelf: "center",
    backgroundColor: "#ED0800",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default UpdateEvent;
