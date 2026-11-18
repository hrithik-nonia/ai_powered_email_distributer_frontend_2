import apiClient from './axios';

export const threadsApi = {
  getThreads: async (params = {}) => {
    // Clean params so undefined/empty values are not sent
    const query = {};
    if (params.label) query.label = params.label;
    if (params.segment) query.segment = params.segment;
    if (params.search && params.search.trim()) query.search = params.search.trim();
    if (params.is_important !== undefined && params.is_important !== null) {
      query.is_important = params.is_important;
    }
    if (params.is_archived !== undefined && params.is_archived !== null) {
      query.is_archived = params.is_archived;
    }
    if (params.skip !== undefined) query.skip = params.skip;
    if (params.limit !== undefined) query.limit = params.limit;

    const response = await apiClient.get('/threads/', { params: query });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/threads/stats');
    return response.data;
  },

  getThread: async (threadId) => {
    const response = await apiClient.get(`/threads/${threadId}`);
    return response.data;
  },

  updateLabel: async (threadId, label) => {
    const response = await apiClient.patch(`/threads/${threadId}/label`, { label });
    return response.data;
  },

  toggleImportant: async (threadId) => {
    const response = await apiClient.patch(`/threads/${threadId}/important`);
    return response.data;
  },

  updateRead: async (threadId, isRead) => {
    const response = await apiClient.patch(`/threads/${threadId}/read`, { is_read: isRead });
    return response.data;
  },

  toggleArchive: async (threadId) => {
    const response = await apiClient.patch(`/threads/${threadId}/archive`);
    return response.data;
  },

  updateStatus: async (threadId, status) => {
    const response = await apiClient.patch(`/threads/${threadId}/status`, { status });
    return response.data;
  },

  clientAction: async (threadId, action) => {
    const response = await apiClient.post(`/threads/${threadId}/client-action`, { action });
    return response.data;
  },
};
