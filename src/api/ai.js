import apiClient from './axios';

export const aiApi = {
  // Re-classify a thread with Grok/OpenRouter
  classifyThread: async (threadId) => {
    const response = await apiClient.post(`/ai/classify/${threadId}`);
    return response.data;
  },

  // Ask AI a question regarding the assistant's inbox (takes latest 15 threads as context)
  aiChat: async (message) => {
    const response = await apiClient.post('/ai/chat', { message: message.trim() });
    return response.data;
  },

  // Generate an AI reply draft for a specific thread
  generateDraft: async (threadId, instruction = '') => {
    const response = await apiClient.post(`/ai/draft/${threadId}`, {
      instruction: instruction ? instruction.trim() : '',
    });
    return response.data;
  },
};
