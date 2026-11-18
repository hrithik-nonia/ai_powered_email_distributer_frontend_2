import apiClient from './axios';

export const draftsApi = {
  getDrafts: async (params = {}) => {
    const query = {};
    if (params.thread_id) query.thread_id = params.thread_id;
    if (params.skip !== undefined) query.skip = params.skip;
    if (params.limit !== undefined) query.limit = params.limit;

    const response = await apiClient.get('/drafts/', { params: query });
    return response.data;
  },

  getDraft: async (draftId) => {
    const response = await apiClient.get(`/drafts/${draftId}`);
    return response.data;
  },

  createDraft: async (draftData) => {
    const payload = {
      account_id: draftData.account_id,
      thread_id: draftData.thread_id || null,
      to: Array.isArray(draftData.to) ? draftData.to : [draftData.to],
      cc: Array.isArray(draftData.cc) ? draftData.cc : [],
      bcc: Array.isArray(draftData.bcc) ? draftData.bcc : [],
      subject: draftData.subject,
      body: draftData.body,
      is_html: !!draftData.is_html,
    };
    const response = await apiClient.post('/drafts/', payload);
    return response.data;
  },

  updateDraft: async (draftId, draftData) => {
    const response = await apiClient.patch(`/drafts/${draftId}`, draftData);
    return response.data;
  },

  deleteDraft: async (draftId) => {
    const response = await apiClient.delete(`/drafts/${draftId}`);
    return response.data;
  },
};
