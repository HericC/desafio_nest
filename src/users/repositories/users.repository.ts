import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 8);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return this.userRepository.save(user);
  }

  async findAll(filter: any, options?: any) {
    return this.userRepository.find({ filter, ...options });
  }

  async findOne(id: number, options?: any) {
    const user = this.userRepository.findOne({ where: { id }, ...options });
    if (!user) throw new NotFoundException(`User ID ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string, options?: any) {
    const user = this.userRepository.findOne({ where: { email }, ...options });
    if (!user) throw new NotFoundException(`User email ${email} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User ID ${id} not found`);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ID ${id} not found`);
    return this.userRepository.remove(user);
  }
}
