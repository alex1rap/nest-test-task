import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [JobsController],
  providers: [UsersService, TasksService, JobsService],
})
export class JobsModule {
}
