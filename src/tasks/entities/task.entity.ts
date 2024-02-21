import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

export enum TaskStatus {
  IN_BACKLOG = 'IN_BACKLOG',
  SELECTED_FOR_DEVELOPMENT = 'SELECTED_FOR_DEVELOPMENT',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_TEST = 'IN_TEST',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 64 })
  title: string;

  @Column('text')
  description: string;

  @Column('int', { default: 0 })
  cost: number;

  @Column('enum', { enum: TaskStatus, default: TaskStatus.IN_BACKLOG })
  status: TaskStatus;

  @OneToMany(() => Job, (job) => job.task)
  jobs: Job[];

  @Column('timestamp', { nullable: true })
  startTime: Date | null;

  @Column('timestamp', { nullable: true })
  endTime: Date | null;

  @Column('timestamp', { nullable: true })
  createdAt: Date | null;

  @Column('timestamp', { nullable: true })
  updatedAt: Date | null;

  getCostUsed(): number {
    return this.jobs.reduce((acc, job) => acc + job.getCost(), 0);
  }

  getCostUsedInPercentages(): number {
    return (this.getCostUsed() / this.cost) * 100;
  }

  getCostLeft(): number {
    return this.cost - this.getCostUsed();
  }

  constructor(task: Partial<Task>) {
    // noinspection TypeScriptValidateTypes
    Object.assign(this, task);
  }
}
