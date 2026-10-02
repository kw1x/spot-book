import api from './client';
import { ensureUtcIso } from '../lib/utils';
import {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
  WorkspaceWithAvailability,
} from '../types/workspace';

export const workspacesApi = {
  getWorkspaces: async (
    floor: number = 1,
    from?: string,
    to?: string
  ): Promise<WorkspaceWithAvailability[]> => {
    const params: Record<string, string | number> = { floor };
    if (from) params.from = ensureUtcIso(from) || from;
    if (to) params.to = ensureUtcIso(to) || to;
    const response = await api.get<WorkspaceWithAvailability[]>('/workspaces', { params });
    return response.data;
  },

  getAllWorkspaces: async (floor?: number): Promise<Workspace[]> => {
    const params: Record<string, number> = {};
    if (floor !== undefined) params.floor = floor;
    const response = await api.get<Workspace[]>('/workspaces/all', { params });
    return response.data;
  },

  getWorkspaceById: async (id: string): Promise<Workspace> => {
    const response = await api.get<Workspace>(`/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (payload: CreateWorkspacePayload): Promise<Workspace> => {
    const response = await api.post<Workspace>('/workspaces', payload);
    return response.data;
  },

  updateWorkspace: async (id: string, payload: UpdateWorkspacePayload): Promise<Workspace> => {
    const response = await api.put<Workspace>(`/workspaces/${id}`, payload);
    return response.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await api.delete(`/workspaces/${id}`);
  },
};
