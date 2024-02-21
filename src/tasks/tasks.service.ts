import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { EntityManager } from 'typeorm';
import { isString } from '@nestjs/common/utils/shared.utils';
import { Job } from '../jobs/entities/job.entity';
import { TaskFilterDto } from './dto/task-filter.dto';

// ToDo: Add validation for title
// ToDo: Add filter by percentage of cost used
@Injectable()
export class TasksService {
  constructor(private readonly entityManager: EntityManager) {
  }

  async create(createTaskDto: CreateTaskDto) {
    const existingTask = await this.findByTitle(createTaskDto.title);
    if (existingTask) {
      throw new ConflictException('Task already exists');
    }
    const task = new Task(createTaskDto);
    await this.entityManager.save(task);
    return task;
  }

  async findAll(params: TaskFilterDto = undefined) {
    const query = this.entityManager.createQueryBuilder(Task, 't')
      .select('t.*, ROUND(SUM(EXTRACT(EPOCH FROM (j.endTime - j.startTime)) / 3600 * j.rate))', 'totalCost')
      .addSelect('ROUND(SUM(EXTRACT(EPOCH FROM (j.endTime - j.startTime)) / 3600 * j.rate) / t.cost * 100)', 'costUsedInPercentage')
      .leftJoin(Job, 'j', 't.id = j.taskId')
      .where('EXTRACT(EPOCH FROM (j.endTime - j.startTime)) >= :minDuration', { minDuration: 15 * 60 })
      .groupBy('t.id, t.title');

    if (params && params.costUsedInPercentage !== undefined) {
      if (params.costUsedInPercentage.from !== undefined && params.costUsedInPercentage.to !== undefined) {
        query.addGroupBy('t.cost');
        query.having(
          'ROUND(SUM(EXTRACT(EPOCH FROM (j.endTime - j.startTime)) / 3600 * j.rate) / t.cost * 100) BETWEEN :from AND :to',
          { from: params.costUsedInPercentage.from, to: params.costUsedInPercentage.to },
        );
      } else if (params.costUsedInPercentage.to !== undefined) {
        query.addGroupBy('t.cost');
        query.having(
          'ROUND(SUM(EXTRACT(EPOCH FROM (j.endTime - j.startTime)) / 3600 * j.rate) / t.cost * 100) <= :to',
          { to: params.costUsedInPercentage.to },
        );
      } else if (params.costUsedInPercentage.from !== undefined) {
        query.addGroupBy('t.cost');
        query.having(
          'ROUND(SUM(EXTRACT(EPOCH FROM (j.endTime - j.startTime)) / 3600 * j.rate) / t.cost * 100) >= :from',
          { from: params.costUsedInPercentage.from },
        );
      }
    }

    return query.getRawMany();
  }

  async findOne(id: number) {
    const task: Task | any = await this.entityManager.findOne(Task, {
      where: { id },
      relations: ['jobs'],
    });
    if (!task) {
      throw new HttpException('Task not found', 404);
    }
    return task.recalculateCosts();
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    updateTaskDto.updatedAt = new Date();
    Object.assign(task, updateTaskDto);
    await this.entityManager.save(Task, task);
    return task;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await task.destroy();
    return `Task #${id} was removed`;
  }

  findByTitle(title: string) {
    return this.entityManager.findOne(Task, {
      where: { title },
    });
  }
}
