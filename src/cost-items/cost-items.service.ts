import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CostItem } from './cost-item.entity';
import { CreateCostItemDto } from './dto/create-cost-item.dto';
import { UpdateCostItemDto } from './dto/update-cost-item.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class CostItemsService {
  private readonly costItems: Map<string, CostItem> = new Map();

  constructor(private readonly projectsService: ProjectsService) {}

  create(createCostItemDto: CreateCostItemDto): CostItem {
    this.projectsService.findOne(createCostItemDto.projectId);

    const now = new Date();
    const totalCost =
      createCostItemDto.totalCost ??
      createCostItemDto.quantity * createCostItemDto.unitCost;

    const costItem: CostItem = {
      id: randomUUID(),
      ...createCostItemDto,
      totalCost,
      createdAt: now,
      updatedAt: now,
    };
    this.costItems.set(costItem.id, costItem);
    return costItem;
  }

  findAll(): CostItem[] {
    return Array.from(this.costItems.values());
  }

  findByProject(projectId: string): CostItem[] {
    this.projectsService.findOne(projectId);
    return Array.from(this.costItems.values()).filter(
      (item) => item.projectId === projectId,
    );
  }

  findOne(id: string): CostItem {
    const item = this.costItems.get(id);
    if (!item) {
      throw new NotFoundException(`Cost item with id "${id}" not found`);
    }
    return item;
  }

  update(id: string, updateCostItemDto: UpdateCostItemDto): CostItem {
    const existing = this.findOne(id);
    const quantity = updateCostItemDto.quantity ?? existing.quantity;
    const unitCost = updateCostItemDto.unitCost ?? existing.unitCost;
    const totalCost = updateCostItemDto.totalCost ?? quantity * unitCost;

    const updated: CostItem = {
      ...existing,
      ...updateCostItemDto,
      totalCost,
      updatedAt: new Date(),
    };
    this.costItems.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.costItems.delete(id);
  }
}
