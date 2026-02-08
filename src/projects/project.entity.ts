import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProjectStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  publicKey!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  secretKey!: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status!: ProjectStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;
}
