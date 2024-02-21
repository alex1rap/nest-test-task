import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { EntityManager } from 'typeorm';
import { isString } from '@nestjs/common/utils/shared.utils';

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

  async findAll() {
    return (await this.entityManager.find(Task)).map((task: Task) => {
      return task.recalculateCosts();
    });
  }

  async findOne(id: number) {
    const task: Task | any = await this.entityManager.findOne(Task, {
      where: { id },
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
    await this.entityManager.remove(Task, task);
    return `Task #${id} was removed`;
  }

  findByTitle(title: string) {
    return this.entityManager.findOne(Task, {
      where: { title },
    });
  }
}
