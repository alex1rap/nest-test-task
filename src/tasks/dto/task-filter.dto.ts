import { IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class CostUsedInPercentageDto {
  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  to: number | undefined;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  from: number | undefined;
}

export class TaskFilterDto {
  @IsOptional()
  @IsString()
  status: string | undefined;

  @IsOptional()
  @IsObject()
  costUsedInPercentage: CostUsedInPercentageDto | undefined;
}