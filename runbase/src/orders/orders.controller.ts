import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderInputDto } from './dto/input-order.dto';
import { OrdersService } from './orders.service';
import { CartsService } from 'src/carts/carts.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Request() req, @Body() orderData: OrderInputDto) {
    const userId = req.user.id;
    const data = { ...orderData, userId: userId };

    return this.ordersService.createOrder(data);
  }

  @UseGuards(AuthGuard)
  @Get('/orderInfo')
  async getOrderInfo(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.getOrderInfo(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/paymentComplete')
  async getPaymentComplete(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.getPaymentComplete(userId);
  }
}
