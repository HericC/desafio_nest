import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString({ message: 'O código deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o código.' })
  code: string;

  @ApiProperty()
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o nome' })
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'É necessário informar o preço' })
  price: number;
}
