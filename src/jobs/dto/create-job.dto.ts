import { IsDate, IsEmpty, IsInt, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  taskId: number;

  @IsInt()
  userId: number;

  @IsEmpty()
  rate: number; // rate is not defined by the user

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
