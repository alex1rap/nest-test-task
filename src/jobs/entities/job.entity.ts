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

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  started_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ended_at: Date;

  getCost(): number {
    const hours = (this.ended_at.getTime() - this.started_at.getTime()) / 1000 / 60 / 60;
    return this.user.rate * hours;
  }
}
