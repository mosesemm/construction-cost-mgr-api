import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CostItemsService } from './cost-items.service';
import { ProjectsService } from '../projects/projects.service';
import { CostCategory } from './cost-item.entity';
import { ProjectStatus } from '../projects/project.entity';
import { CreateCostItemDto } from './dto/create-cost-item.dto';

describe('CostItemsService', () => {
  let costItemsService: CostItemsService;
  let projectsService: ProjectsService;
  let projectId: string;

  const createItemDto = (): CreateCostItemDto => ({
    projectId,
    category: CostCategory.MATERIALS,
    description: 'Structural steel beams',
    quantity: 10,
    unitCost: 1500,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostItemsService, ProjectsService],
    }).compile();

    costItemsService = module.get<CostItemsService>(CostItemsService);
    projectsService = module.get<ProjectsService>(ProjectsService);

    const project = projectsService.create({
      name: 'Test Project',
      description: 'A test project',
      location: 'Test City',
      budget: 100000,
      status: ProjectStatus.PLANNING,
    });
    projectId = project.id;
  });

  it('should be defined', () => {
    expect(costItemsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a cost item and compute totalCost automatically', () => {
      const item = costItemsService.create(createItemDto());

      expect(item.id).toBeDefined();
      expect(item.projectId).toBe(projectId);
      expect(item.category).toBe(CostCategory.MATERIALS);
      expect(item.quantity).toBe(10);
      expect(item.unitCost).toBe(1500);
      expect(item.totalCost).toBe(15000);
      expect(item.createdAt).toBeInstanceOf(Date);
    });

    it('should use provided totalCost when supplied', () => {
      const dto = { ...createItemDto(), totalCost: 99999 };
      const item = costItemsService.create(dto);
      expect(item.totalCost).toBe(99999);
    });

    it('should throw NotFoundException for an unknown projectId', () => {
      const dto = { ...createItemDto(), projectId: 'non-existent' };
      expect(() => costItemsService.create(dto)).toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no items exist', () => {
      expect(costItemsService.findAll()).toEqual([]);
    });

    it('should return all cost items', () => {
      costItemsService.create(createItemDto());
      costItemsService.create({
        ...createItemDto(),
        description: 'Cement bags',
      });
      expect(costItemsService.findAll()).toHaveLength(2);
    });
  });

  describe('findByProject', () => {
    it('should return only items belonging to the given project', () => {
      const secondProject = projectsService.create({
        name: 'Second Project',
        description: 'Another project',
        location: 'Elsewhere',
        budget: 50000,
        status: ProjectStatus.PLANNING,
      });

      costItemsService.create(createItemDto());
      costItemsService.create({
        ...createItemDto(),
        projectId: secondProject.id,
      });

      const items = costItemsService.findByProject(projectId);
      expect(items).toHaveLength(1);
      expect(items[0].projectId).toBe(projectId);
    });

    it('should throw NotFoundException for an unknown projectId', () => {
      expect(() => costItemsService.findByProject('unknown')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return the cost item for a valid id', () => {
      const created = costItemsService.create(createItemDto());
      expect(costItemsService.findOne(created.id)).toEqual(created);
    });

    it('should throw NotFoundException for an unknown id', () => {
      expect(() => costItemsService.findOne('no-such-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the specified fields and recompute totalCost', () => {
      const created = costItemsService.create(createItemDto());
      const updated = costItemsService.update(created.id, { quantity: 20 });

      expect(updated.quantity).toBe(20);
      expect(updated.unitCost).toBe(1500);
      expect(updated.totalCost).toBe(30000);
    });

    it('should throw NotFoundException when updating a non-existent item', () => {
      expect(() =>
        costItemsService.update('no-such-id', { quantity: 5 }),
      ).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an existing cost item', () => {
      const created = costItemsService.create(createItemDto());
      costItemsService.remove(created.id);
      expect(costItemsService.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when removing a non-existent item', () => {
      expect(() => costItemsService.remove('no-such-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
