import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Order } from 'src/entities/orders.entity';
import { OrderProduct } from 'src/entities/order_products.entity';
import { ProductReview } from 'src/entities/product_reviews.entity';
import { ProductSize } from 'src/entities/product_sizes.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview, ProductSize, Order, OrderProduct]),
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
