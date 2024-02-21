import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsDate, IsEmpty, IsInt, IsOptional } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {

  @IsOptional()
  @IsInt()
  rate: number;

  @IsOptional()
  @IsDate()
  startTime: Date;

  @IsOptional()
  @IsDate()
  endTime: Date;

  @IsOptional()
  @IsEmpty()
  updatedAt: Date; // updatedAt is not updatable by user
}
