import api from './api';
import { Equipment, CreateEquipmentDto } from '../types';

export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get('/equipment');
    return response.data;
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  getMaintenanceHistory: async (id: string) => {
    const response = await api.get(`/equipment/${id}/maintenance`);
    return response.data;
  },

  create: async (data: CreateEquipmentDto): Promise<Equipment> => {
    const response = await api.post('/equipment', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },
};
