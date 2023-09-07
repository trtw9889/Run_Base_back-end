import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from 'src/entities/carts.entity';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/categories.entity';
import { Color } from 'src/entities/colors.entity';
import { Size } from 'src/entities/sizes.entity';
import { Image } from 'src/entities/images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      ProductSize,
      Product,
      Category,
      Color,
      Size,
      Image,
    ]),
    AuthModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
