import apiClient from './axios';

export const accountsApi = {
  getAccounts: async () => {
    const response = await apiClient.get('/accounts/');
    return response.data;
  },

  connectDemo: async () => {
    // Note: This endpoint triggers 25 AI classifications synchronously and may take 30-60+ seconds.
    // Configure generous timeout (120 seconds).
    const response = await apiClient.post('/accounts/connect-demo', {}, {
      timeout: 120000,
    });
    return response.data;
  },

  updateStatus: async (accountId, status) => {
    const response = await apiClient.patch(`/accounts/${accountId}/status`, { status });
    return response.data;
  },
};
