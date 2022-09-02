import { Injectable, NotFoundException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../users/repositories/users.repository';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async login(authUserDto: AuthUserDto) {
    const user = await this.usersRepository.findOneByEmail(authUserDto.email, {
      select: { id: true, name: true, email: true, password: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(authUserDto.password, user.password);
    if (!match) throw new NotFoundException('User not found');

    const jwtPayload: JwtPayload = { userId: user.id.toString() };
    return sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async validateUser(jwtPayload: JwtPayload) {
    return this.usersRepository.findOne(+jwtPayload.userId);
  }
}
