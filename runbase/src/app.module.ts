import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MypagesModule } from './mypages/mypages.module';
import authConfig from './configs/authConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    CartsModule,
    UsersModule,
    CartsModule,
    ConfigModule.forRoot({ load: [authConfig], isGlobal: true }),
    ReviewsModule,
    ProductsModule,
    OrdersModule,
    MypagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
