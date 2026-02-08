import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { Project, ProjectStatus } from '../project.entity';

export interface AuthenticatedProjectRequest extends Request {
  project: Project;
}

@Injectable()
export class ProjectAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Partial<AuthenticatedProjectRequest>>();

    const projectId = this.readHeader(request, 'x-project-id');
    const publicKey = this.readHeader(request, 'x-public-key');

    if (!projectId || !publicKey) {
      throw new UnauthorizedException('Missing project authentication headers');
    }

    const project = await this.projectsRepository.findOne({
      where: { id: projectId, publicKey },
    });

    if (!project) {
      throw new UnauthorizedException('Invalid project credentials');
    }

    if (project.status !== ProjectStatus.ACTIVE) {
      throw new ForbiddenException('Project is not active');
    }

    request.project = project;

    return true;
  }

  private readHeader(
    request: Partial<Request>,
    headerName: string,
  ): string | undefined {
    const value = request.headers?.[headerName];

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }
}
