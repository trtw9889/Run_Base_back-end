import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { Color } from 'src/entities/colors.entity';
import { Image } from 'src/entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Color, Image])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
