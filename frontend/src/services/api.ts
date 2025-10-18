import apiClient from '../lib/axios';

export interface Generation {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: string;
}

export interface CreateGenerationRequest {
  prompt: string;
  style: string;
  imageUpload: string;
}

// Generation API calls
export const generationsApi = {
  create: async (data: CreateGenerationRequest, signal?: AbortSignal): Promise<Generation> => {
    const response = await apiClient.post('/generations', data, { signal });
    return response.data;
  },

  list: async (limit: number = 5): Promise<Generation[]> => {
    const response = await apiClient.get(`/generations?limit=${limit}`);
    return response.data;
  },
};
