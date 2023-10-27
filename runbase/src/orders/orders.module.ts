import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from 'src/entities/carts.entity';
import { Order } from 'src/entities/orders.entity';
import { OrderProduct } from 'src/entities/order_products.entity';
import { Shipment } from 'src/entities/shipment.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, Shipment, Cart]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
