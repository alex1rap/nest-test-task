import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { isString } from '@nestjs/common/utils/shared.utils';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.jobs)
  user: User;

  @ManyToOne(() => Task, (task) => task.jobs)
  task: Task;

  @Column('int', { default: 0 })
  rate: number;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  endTime: Date;

  getCost(): number {
    console.log({
      startTime: this.startTime,
      endTime: this.endTime,
      rate: this.rate,
    });
    if (!this.startTime || !this.endTime) {
      return 0;
    }
    if (isString(this.startTime)) {
      this.startTime = new Date(this.startTime);
    }
    if (isString(this.endTime)) {
      this.endTime = new Date(this.endTime);
    }
    const hours = (this.endTime.getTime() - this.startTime.getTime()) / 1000 / 60 / 60;
    return this.rate * hours;
  }

  constructor(job: Partial<Job>) {
    // noinspection TypeScriptValidateTypes
    Object.assign(this, job);
  }
}
