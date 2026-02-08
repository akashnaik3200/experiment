import { Request } from 'express';

import { Project } from '../project.entity';

export interface AuthenticatedProjectRequest extends Request {
  project: Project;
}
