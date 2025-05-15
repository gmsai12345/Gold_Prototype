import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all loans (admin only)
export const getAllLoans = async () => {
  try {
    const response = await axios.get(`${API_URL}/loans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get loans for a specific user
export const getUserLoans = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/loans/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get pending loan applications (admin only)
export const getPendingLoans = async () => {
  try {
    const response = await axios.get(`${API_URL}/loans/pending`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new loan application
export const createLoanApplication = async (loanData: any) => {
  try {
    const response = await axios.post(`${API_URL}/loans`, loanData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process loan application (admin only)
export const processLoanApplication = async (
  loanId: string, 
  status: 'approved' | 'rejected', 
  approvedBy?: string,
  rejectionReason?: string
) => {
  try {
    const response = await axios.put(`${API_URL}/loans/${loanId}/process`, {
      status,
      approvedBy,
      rejectionReason
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};