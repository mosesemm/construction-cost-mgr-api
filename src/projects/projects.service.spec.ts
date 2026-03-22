import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectStatus } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const createDto: CreateProjectDto = {
    name: 'Office Renovation',
    description: 'Renovate the main office building',
    location: '123 Main St, New York',
    budget: 500000,
    status: ProjectStatus.PLANNING,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project and return it with generated id and timestamps', () => {
      const project = service.create(createDto);

      expect(project.id).toBeDefined();
      expect(project.name).toBe(createDto.name);
      expect(project.description).toBe(createDto.description);
      expect(project.location).toBe(createDto.location);
      expect(project.budget).toBe(createDto.budget);
      expect(project.status).toBe(ProjectStatus.PLANNING);
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });

    it('should default status to PLANNING when not provided', () => {
      const { ...withoutStatus } = createDto;
      delete (withoutStatus as Partial<CreateProjectDto>).status;
      const project = service.create(withoutStatus as CreateProjectDto);
      expect(project.status).toBe(ProjectStatus.PLANNING);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no projects exist', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created projects', () => {
      service.create(createDto);
      service.create({ ...createDto, name: 'Second Project' });
      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return the project for a valid id', () => {
      const created = service.create(createDto);
      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundException for an unknown id', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the specified fields of a project', () => {
      const created = service.create(createDto);
      const updateDto: UpdateProjectDto = {
        budget: 750000,
        status: ProjectStatus.IN_PROGRESS,
      };
      const updated = service.update(created.id, updateDto);

      expect(updated.id).toBe(created.id);
      expect(updated.budget).toBe(750000);
      expect(updated.status).toBe(ProjectStatus.IN_PROGRESS);
      expect(updated.name).toBe(createDto.name);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when updating a non-existent project', () => {
      expect(() => service.update('no-such-id', { budget: 1000 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing project', () => {
      const created = service.create(createDto);
      service.remove(created.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when removing a non-existent project', () => {
      expect(() => service.remove('no-such-id')).toThrow(NotFoundException);
    });
  });
});
