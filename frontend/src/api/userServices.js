import axios from "axios";
export const API_URL = "http://localhost:5000/api";

// Helper function to get auth token
const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error(
      "API error:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : { error: "An unexpected error occurred" };
  }
};

export const verifyUser = async (verifyCode, email) => {
  try {
    const response = await axios.post(`${API_URL}/verify`, {
      verifyCode,
      email,
    });
    return response.data;
  } catch (error) {
    console.error(
      "API error:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : { error: "An unexpected error occurred" };
  }
};

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      identifier,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgetpassword`, { email });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { error: "An unexpected error occurred" };
  }
};

export const resetPassword = async (token, email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/resetpassword/${token}`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { error: "An unexpected error occurred" };
  }
};

// Get all users (Admin route)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Delete a user (Admin route)
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/deleteUser/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get a user by ID (Admin route)
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get a user's profile (Admin route)
export const getUserProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/details/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update a user's profile (Admin route)
export const updateUserProfile = async (userId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/updateUser/${userId}`,
      updatedData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Create an event (Admin route)
export const createEvent = async (formData, token) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await axios.post(`${API_URL}/admin/addEvent`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
//update event
export const updateEvent = async (id, formData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/update-event/${id}`,
      formData,
      {
        headers: {
          ...getAuthHeader(token),
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

//event by category
export const eventsByCategory = async (categoryId) => {
  try {
    const res = await axios.get(`${API_URL}/eventsByCategory/${categoryId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};



//delete event
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/delete-event/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/createCategory`,
      categoryData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/allCategory`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// create order
export const createOrder = async (orderData, token) => {
  try {
    const res = await axios.post(`${API_URL}/createOrder`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },    });

    return res.data; // Return response data if successful
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(error.response?.data?.message || "Something went wrong while placing the order.");
  }
};

// getorder by id
export const getOrderById = async (orderId, token) => {
  const res = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// getUserOrders
export const getUserOrders = async (token) => {
  const res = await axios.get(`${API_URL}/userOrder`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// get all orders (Admin route)
export const getAllOrders = async (token) => {
  const res = await axios.get(`${API_URL}/admin/orders`, {
    headers: 
      getAuthHeader(),
    },
  );
  return res.data;
};
//delete order
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteOrders/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
//buytickets
export const buyTicket = async (orderId, paymentMethod, token) => {
  const res = await axios.post(
    `${API_URL}/buyTicket`,
    { orderId, paymentMethod },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getUserTickets = async (token) => {
  const res = await axios.get(`${API_URL}/userTicket`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
//get all tickets (Admin route)
export const getAllTickets = async (token) => {
  const res = await axios.get(`${API_URL}/admin/allTickets`, {
    headers: 
      getAuthHeader(),
    },
  );
  return res.data;
};

// Get QR code for an order
export const getQRCode = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      responseType: 'blob' // Important for receiving binary data
    }
  };

  try {
    const response = await axios.get(`${API_URL}/tickets/qrcode/${orderId}`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate QR code');
  }
};



export const initiateStripePayment = async (orderId, paymentMethod, token) => {
  const res = await axios.post(
    `${API_URL}/initiate-payment`,
    { orderId, paymentMethod },
    {
      headers: getAuthHeader(token),
    }
  );
  return res.data;
};

export const verifyStripePayment = async (orderId, status, token) => {
  const res = await axios.post(
    `${API_URL}/verify-payment`,
    { orderId, status },
    {
      headers: getAuthHeader(token),
    }
  );
  return res.data;
};

export const refundStripePayment = async (orderId, token) => {
  const res = await axios.post(
    `${API_URL}/refund-payment`,
    { orderId },
    {
      headers: 
      getAuthHeader(),
    }
  );
  return res.data;
};