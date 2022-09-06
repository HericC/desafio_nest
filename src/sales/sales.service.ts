import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesRepository } from './repositories/sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createUserDto: CreateSaleDto) {
    return this.salesRepository.create(createUserDto);
  }

  async findAll(filter = {}) {
    return this.salesRepository.findAll(filter, {
      relations: { user: true, products: true },
    });
  }

  async findOne(id: number) {
    return this.salesRepository.findOne(id, {
      relations: { user: true, products: true },
    });
  }

  async update(id: number, updateUserDto: UpdateSaleDto) {
    return this.salesRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.salesRepository.remove(id);
  }
}
