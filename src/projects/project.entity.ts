export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  budget: number;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}
