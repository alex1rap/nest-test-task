import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  rate: number;

  @IsOptional()
  @IsDate()
  startTime: Date | null = null;

  @IsOptional()
  @IsDate()
  endTime: Date | null = null;
}
