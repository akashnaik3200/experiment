import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private readonly dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  findByPublicKey(publicKey: string): Promise<Project | null> {
    return this.findOne({ where: { publicKey } });
  }
}
