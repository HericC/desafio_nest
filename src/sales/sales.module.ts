import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SalesRepository } from './repositories/sales.repository';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), UsersModule, ProductsModule],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
  exports: [SalesRepository],
})
export class SalesModule {}
