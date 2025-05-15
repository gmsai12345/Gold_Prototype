import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUid = async (firebaseUid: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/firebase/${firebaseUid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new user
export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit user registration form
export const submitUserForm = async (userId: string, formData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users/submit-form/${userId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get pending form applications (admin only)
export const getPendingForms = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/pending-forms`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Review user form (admin only)
export const reviewUserForm = async (userId: string, status: string, rejectionReason?: string) => {
  try {
    const response = await axios.put(`${API_URL}/users/review-form/${userId}`, {
      status,
      rejectionReason
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update gold holdings (admin only)
export const updateGoldHoldings = async (userId: string, goldData: any) => {
  try {
    const response = await axios.put(`${API_URL}/gold/${userId}`, goldData);
    return response.data;
  } catch (error) {
    throw error;
  }
};