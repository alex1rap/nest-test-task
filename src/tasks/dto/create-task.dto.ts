import { TaskStatus } from '../entities/task.entity';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class CreateTaskDto {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  cost: number;

  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.IN_BACKLOG;
}
