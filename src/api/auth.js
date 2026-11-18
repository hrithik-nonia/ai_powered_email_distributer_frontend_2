import apiClient from './axios';

export const authApi = {
  // Step 1: Submit user details, triggers OTP email
  register: async ({ name, email, password, role, linked_assistant_id }) => {
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      linked_assistant_id: role === 'client' ? linked_assistant_id?.trim() : (linked_assistant_id || null),
    };
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  // Step 2: Verify 6-digit OTP to finalize account creation
  verifyOtp: async ({ email, otp }) => {
    const response = await apiClient.post('/auth/verify-otp', {
      email: email.trim(),
      otp: otp.trim(),
    });
    return response.data;
  },

  // Resend OTP
  resendOtp: async ({ email }) => {
    const response = await apiClient.post('/auth/resend-otp', {
      email: email.trim(),
    });
    return response.data;
  },

  // Login
  login: async ({ email, password, role }) => {
    const payload = {
      email: email.trim(),
      password,
    };
    if (role) {
      payload.role = role;
    }
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  // Silent refresh
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
