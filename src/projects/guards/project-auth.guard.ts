import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUuid } from 'uuid';
import { Repository } from 'typeorm';

import { AuthenticatedProjectRequest } from '../interfaces/authenticated-project-request.interface';
import { Project, ProjectStatus } from '../project.entity';

@Injectable()
export class ProjectAuthGuard implements CanActivate {
  private static readonly PROJECT_ID_HEADER = 'x-project-id';

  private static readonly PUBLIC_KEY_HEADER = 'x-public-key';

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedProjectRequest>();

    const projectId = this.readHeader(request, ProjectAuthGuard.PROJECT_ID_HEADER);
    const publicKey = this.readHeader(request, ProjectAuthGuard.PUBLIC_KEY_HEADER);

    if (!projectId || !publicKey) {
      throw new UnauthorizedException('Missing project authentication headers');
    }

    if (!isUuid(projectId)) {
      throw new UnauthorizedException('Invalid project credentials');
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
    request: Pick<AuthenticatedProjectRequest, 'headers'>,
    headerName: string,
  ): string | undefined {
    const value = request.headers?.[headerName];
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (typeof normalizedValue !== 'string') {
      return undefined;
    }

    const trimmed = normalizedValue.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  }
}
