import apiClient from './axios';

export const activityApi = {
  getActivity: async (params = {}) => {
    const query = {};
    if (params.entity_type) query.entity_type = params.entity_type;
    if (params.entity_id) query.entity_id = params.entity_id;
    if (params.skip !== undefined) query.skip = params.skip;
    if (params.limit !== undefined) query.limit = params.limit;

    const response = await apiClient.get('/activity/', { params: query });
    return response.data;
  },

  createActivity: async (activityData) => {
    const response = await apiClient.post('/activity/', activityData);
    return response.data;
  },
};
