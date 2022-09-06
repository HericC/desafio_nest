import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { In, Repository } from 'typeorm';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { Sale } from '../entities/sale.entity';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const user = await this.usersRepository.findOne(+createSaleDto.user);

    if (!user)
      throw new NotFoundException(`User ID ${createSaleDto.user} not found`);

    const products = await this.productsRepository.findAll({
      where: { id: In(createSaleDto.products) },
    });

    if (!products.length)
      throw new NotFoundException(`Products IDs not founds`);

    const sale = this.saleRepository.create({
      ...createSaleDto,
      user,
      products,
    });

    return this.saleRepository.save(sale);
  }

  async findAll(filter: any, options?: any) {
    return this.saleRepository.find({ ...filter, ...options });
  }

  async findOne(id: number, options?: any) {
    const sale = this.saleRepository.findOne({ where: { id }, ...options });
    if (!sale) throw new NotFoundException(`Sale ID ${id} not found`);
    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    const user = await this.usersRepository.findOne(+updateSaleDto.user);
    const products = await this.productsRepository.findAll({
      where: { id: In(updateSaleDto.products) },
    });

    const sale = await this.saleRepository.preload({
      id,
      ...updateSaleDto,
      user,
      products,
    });

    if (!sale) throw new NotFoundException(`Sale ID ${id} not found`);
    return this.saleRepository.save(sale);
  }

  async remove(id: number) {
    const sale = await this.saleRepository.findOne({ where: { id } });
    if (!sale) throw new NotFoundException(`Sale ID ${id} not found`);
    return this.saleRepository.remove(sale);
  }
}
