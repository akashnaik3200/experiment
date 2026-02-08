import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { Project, ProjectStatus } from './project.entity';

export interface CreateProjectResponse {
  project_id: string;
  publicKey: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    const project = this.projectsRepository.create({
      name: createProjectDto.name,
      publicKey: this.generateKey(),
      secretKey: this.generateKey(),
      status: ProjectStatus.ACTIVE,
    });

    try {
      const savedProject = await this.projectsRepository.save(project);

      return {
        project_id: savedProject.id,
        publicKey: savedProject.publicKey,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Could not create project due to key collision');
      }

      throw new InternalServerErrorException('Could not create project');
    }
  }

  private generateKey(): string {
    return randomBytes(32).toString('hex');
  }
}
