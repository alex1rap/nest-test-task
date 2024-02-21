import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

//ToDo: Add validation for email and nickname
//ToDo: Add validation for password
//ToDo: Add validation for name
//ToDo: Add authentication and authorization
@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmailOrNickname({
      email: createUserDto.email,
      nickname: createUserDto.nickname,
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new User(createUserDto);
    await this.entityManager.save(user);
    return user;
  }

  async findAll() {
    return await this.entityManager.find(User);
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new HttpException('Invalid id', 400);
    }
    const user: User | any = await this.entityManager.findOne(User, {
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    updateUserDto.updatedAt = new Date();
    Object.assign(user, updateUserDto);
    await this.entityManager.save(User, user);
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await user.destroy();
    return `User #${id} was removed`;
  }

  async findByEmailOrNickname({ email, nickname }) {
    return await this.entityManager.findOne(User, {
      where: [
        { email },
        { nickname },
      ],
    });
  }
}
