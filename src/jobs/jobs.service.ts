import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Between, EntityManager } from 'typeorm';
import { TasksService } from '../tasks/tasks.service';
import { Job } from './entities/job.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class JobsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {
  }

  async create(createJobDto: CreateJobDto) {
    const taskId = createJobDto.taskId;
    const task = await this.tasksService.findOne(taskId);
    const user = await this.usersService.findOne(createJobDto.userId);
    createJobDto.rate = user.rate;
    const job = new Job(createJobDto);
    const existingJobs = await this.loadExistingJobAtThisTime({
      userId: createJobDto.userId,
      startTime: job.startTime,
      endTime: job.endTime,
    });

    if (existingJobs.length > 0) {
      throw new ConflictException('User already have an another job at this time');
    }

    if (task.costUsed + job.getCost() > task.cost) {
      throw new UnauthorizedException('Cost exceeds the limit');
    }

    job.task = task;
    job.user = user;
    await this.entityManager.save(job);
    return job;
  }

  async loadExistingJobAtThisTime({ userId, startTime, endTime }) {
    return await this.entityManager.find(Job, {
      where: [
        {
          startTime: Between(startTime, endTime),
          user: {
            id: userId,
          },
        },
        {
          endTime: Between(startTime, endTime),
          user: {
            id: userId,
          },
        },
      ],
    });
  }

  async findAll() {
    // @ts-ignore
    return await this.entityManager.find(Job, {
      relations: ['task', 'user'],
      order: {
        startTime: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const job: Job | any = await this.entityManager.findOne(Job, {
      where: { id },
      relations: ['task', 'user'],
    });
    if (!job) {
      throw new HttpException('Job not found', 404);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);
    updateJobDto.updatedAt = new Date();
    /**
     * ToDo: add user roles and check if user is allowed to update this fields
     * if (user.role !== 'admin') {
     *  delete updateJobDto.rate;
     *  delete updateJobDto.userId;
     *  delete updateJobDto.taskId;
     *  delete updateJobDto.startTime;
     *  delete updateJobDto.endTime;
     *  }
     */

    delete updateJobDto.rate;

    Object.assign(job, updateJobDto);
    await this.entityManager.save(Job, job);
    return job;
  }

  async remove(id: number) {
    const job = await this.findOne(id);
    await job.destroy();
    return `Job #${id} was removed`;
  }
}
