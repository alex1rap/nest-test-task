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

  @Column('varchar', { length: 32 })
  name: string;

  @Column('int', { default: 0 })
  rate: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  deletedAt: Date;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  constructor(user: Partial<User>) {
    // noinspection TypeScriptValidateTypes
    Object.assign(this, user);
  }
}
