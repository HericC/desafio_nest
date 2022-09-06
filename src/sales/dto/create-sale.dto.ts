import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty()
  @IsString({ each: true, message: 'O id do usuário deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário o usuário.' })
  readonly user: string;

  @ApiProperty()
  @IsString({ each: true, message: 'O id dos produtos devem ser um texto' })
  @ArrayNotEmpty({ message: 'É necessário informar um produto.' })
  readonly products: string[];
}
