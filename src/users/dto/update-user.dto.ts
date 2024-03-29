import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsEmpty, IsInt, IsOptional, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Optional()
  @IsEmpty()
  nickname: undefined; // nickname is not updatable

  @Optional()
  @IsString()
  email: string;

  @Optional()
  @IsString()
  name: string;

  @Optional()
  @IsString()
  password: string;

  @Optional()
  @IsInt()
  rate: number;

  @IsOptional()
  @IsDate()
  updatedAt: Date | null = null;
}
