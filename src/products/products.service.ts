import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createUserDto: CreateProductDto) {
    return this.productsRepository.create(createUserDto);
  }

  async findAll(filter = {}) {
    return this.productsRepository.findAll(filter);
  }

  async findOne(id: number) {
    return this.productsRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.productsRepository.remove(id);
  }
}
