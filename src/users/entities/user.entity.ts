import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 32 })
  nickname: string;

  @Column('varchar', { length: 32 })
  email: string;

  @Column('varchar', { length: 32 })
  password: string;

  @Column('int', { default: 0 })
  rate: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  deleted_at: Date;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];
}
