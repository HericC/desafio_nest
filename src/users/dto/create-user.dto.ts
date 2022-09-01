import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'É necessário informar o nome.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'É Necessário informar um e-mail válido' })
  @IsNotEmpty({ message: 'É necessário informar o e-mail.' })
  email: string;

  @ApiProperty()
  @MinLength(8, { message: 'A senha deve possuir ao menos 8 characteres' })
  @IsNotEmpty({ message: 'É necessário informar a senha.' })
  password: string;
}
