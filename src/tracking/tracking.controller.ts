import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import {
  AuthenticatedProjectRequest,
  ProjectAuthGuard,
} from '../projects/guards/project-auth.guard';

@Controller('v1/tracking')
@UseGuards(ProjectAuthGuard)
export class TrackingController {
  @Get('health')
  health(@Req() request: AuthenticatedProjectRequest): { project_id: string } {
    return { project_id: request.project.id };
  }
}
