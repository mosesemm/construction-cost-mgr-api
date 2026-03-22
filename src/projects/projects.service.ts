import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Project, ProjectStatus } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly projects: Map<string, Project> = new Map();

  create(createProjectDto: CreateProjectDto): Project {
    const now = new Date();
    const project: Project = {
      id: randomUUID(),
      ...createProjectDto,
      status: createProjectDto.status ?? ProjectStatus.PLANNING,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(project.id, project);
    return project;
  }

  findAll(): Project[] {
    return Array.from(this.projects.values());
  }

  findOne(id: string): Project {
    const project = this.projects.get(id);
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto): Project {
    const existing = this.findOne(id);
    const updated: Project = {
      ...existing,
      ...updateProjectDto,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.projects.delete(id);
  }
}
