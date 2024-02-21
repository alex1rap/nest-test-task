import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

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
    const hours = (this.endTime.getTime() - this.startTime.getTime()) / 1000 / 60 / 60;
    return this.user.rate * hours;
  }
}
