import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsInt()
  cost: number;
}
