import axios from "axios";
const API_URL = "http://localhost:5000/api";

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
export const updateEvent = async (id, eventData, token) => {
  try {
    const storedToken = token || sessionStorage.getItem("token");
    if (!storedToken) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("location", eventData.location);
    formData.append("category", eventData.category);

    if (eventData.image) {
      formData.append("image", eventData.image);
    }

    // Stringify ticketTypes array to avoid FormData issues
    formData.append("ticketTypes", JSON.stringify(eventData.ticketTypes));

    const response = await axios.put(
      `${API_URL}/admin/update-event/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Update error:', error);
    throw error.response?.data || { 
      message: error.message || "Update failed",
      error: error.toString()
    };
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
    console.error("Error deleting user:", error);
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
