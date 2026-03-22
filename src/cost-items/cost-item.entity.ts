export enum CostCategory {
  MATERIALS = 'MATERIALS',
  LABOR = 'LABOR',
  EQUIPMENT = 'EQUIPMENT',
  SUBCONTRACTOR = 'SUBCONTRACTOR',
  PERMITS = 'PERMITS',
  OVERHEAD = 'OVERHEAD',
  OTHER = 'OTHER',
}

export interface CostItem {
  id: string;
  projectId: string;
  category: CostCategory;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}
