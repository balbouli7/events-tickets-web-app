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

    const { title, description, date, location, category, ticketTypes } = formData;

    if (!title || !description || !date || !location || !category) {
      setMessage("Please fill in all required fields.");
      return;
    }

    for (const ticket of ticketTypes) {
      if (!ticket.type || ticket.price <= 0 || ticket.quantity <= 0) {
        setMessage("Each ticket must have a type, price > 0, and quantity > 0.");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await updateEvent(id, formData, token);
      setMessage(res.message);
      navigate("/admin/events");
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
            value={ticket.quantity === 0 ? "" : ticket.quantity}
            onChange={(e) => {
              const updated = [...formData.ticketTypes];
              updated[index].quantity = Number(e.target.value);
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
            ticketTypes: [...prev.ticketTypes, { type: "", price: 0, quantity: 0 }],
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
          onClick={() => navigate("/admin/events")}
          style={styles.cancelBtn}
        >
          Cancel
        </button>
      </div>

      {/* Image hover zoom style */}
      <style>{`
        .preview-image {
          transition: transform 0.3s ease-in-out;
          cursor: pointer;
        }
        .preview-image:hover {
          transform: scale(3.1);
        }
      `}</style>
    </form>
  );
};

const styles = {
  form: {
    margin: "auto",
    padding: "30px",
    maxWidth: "700px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    backgroundColor: "#fefefe",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  subheading: {
    marginTop: "30px",
    marginBottom: "10px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  ticketRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  ticketInput: {
    flex: "1",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  removeBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "16px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  submitBtn: {
    padding: "12px 24px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "12px 24px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    color: "#dc3545",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
  uploadLabel: {
    display: "inline-block",
    padding: "10px 16px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    textAlign: "center",
  },
  hiddenFileInput: {
    display: "none",
  },
};

export default UpdateEvent;
