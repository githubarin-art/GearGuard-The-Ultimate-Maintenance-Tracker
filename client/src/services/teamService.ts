import api from './api';
import { MaintenanceTeam, TeamMember } from '../types';

export const teamService = {
  getAllTeams: async (): Promise<MaintenanceTeam[]> => {
    const response = await api.get('/teams');
    return response.data;
  },

  getTeamById: async (id: string): Promise<MaintenanceTeam> => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (data: Partial<MaintenanceTeam>): Promise<MaintenanceTeam> => {
    const response = await api.post('/teams', data);
    return response.data;
  },

  updateTeam: async (id: string, data: Partial<MaintenanceTeam>): Promise<MaintenanceTeam> => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  getAllMembers: async (): Promise<TeamMember[]> => {
    const response = await api.get('/members');
    return response.data;
  },

  createMember: async (data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await api.post('/members', data);
    return response.data;
  },

  updateMember: async (id: string, data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  deleteMember: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },
};
