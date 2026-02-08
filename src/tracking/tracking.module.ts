import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../projects/project.entity';
import { ProjectAuthGuard } from '../projects/guards/project-auth.guard';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [TrackingController],
  providers: [ProjectAuthGuard],
})
export class TrackingModule {}
