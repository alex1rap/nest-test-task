import { IsInt, IsOptional } from 'class-validator';

export class JobFilterDto {

  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  taskId: number;
}