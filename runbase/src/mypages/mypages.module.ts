import { Module } from '@nestjs/common';
import { MypagesController } from './mypages.controller';
import { MypagesService } from './mypages.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/orders.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { Product } from 'src/entities/products.entity';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { Image } from 'src/entities/images.entity';
import { Size } from 'src/entities/sizes.entity';
import { Color } from 'src/entities/colors.entity';
import { Shipment } from 'src/entities/shipment.entity';
import { User } from 'src/entities/users.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Order,
      ProductSize,
      Product,
      Image,
      Size,
      Color,
      Shipment,
      User,
    ]),
    ReviewsModule,
  ],
  controllers: [MypagesController],
  providers: [MypagesService],
  exports: [MypagesService],
})
export class MypagesModule {}
