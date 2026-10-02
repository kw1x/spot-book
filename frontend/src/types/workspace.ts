export type WorkspaceType = 'DESK' | 'MEETING_ROOM';

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  capacity: number;
  floor: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
  isActive: boolean;
}

export interface WorkspaceWithAvailability extends Workspace {
  isAvailable: boolean;
}

export interface CreateWorkspacePayload {
  name: string;
  type: WorkspaceType;
  capacity: number;
  floor: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
  isActive?: boolean;
}

export interface UpdateWorkspacePayload {
  name: string;
  type: WorkspaceType;
  capacity: number;
  floor: number;
  posX: number;
  posY: number;
  width: number;
  height: number;
  isActive: boolean;
}
