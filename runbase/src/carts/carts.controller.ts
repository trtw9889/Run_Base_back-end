import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AddCartsDto } from './cartsDto';
import { CartsService } from './carts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Cart } from 'src/entities/carts.entity';

@Controller('carts')
@UseGuards(AuthGuard)
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Get('/cartList')
  async findCart(@Request() request, @Res() res: Response) {
    try {
      const userId = request.user.id;
      const carts = await this.cartsService.findCartsByUserId(userId);
      res.status(200).send(carts);
    } catch (error) {
      console.error(error);
      res.status(400).json({ code: 400, message: error.message });
    }
  }

  @Post('/addCart')
  async addCart(
    @Request() request,
    @Body() addCartsDto: AddCartsDto, // DTO로 Product id와 size id를 받음
  ) {
    const userId = request.user.id;

    return this.cartsService.addCartItem(userId, addCartsDto);
  }

  @Put('/updateCart/:id')
  async updateCart(
    @Request() request,
    @Param('id') cartId: number,
    @Body('quantity') quantity: number,
  ) {
    const userId = request.user.id;
    return this.cartsService.updateCartItemQuantity(userId, cartId, quantity);
  }

  @Delete(':id')
  async deleteCart(
    @Request() request,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      const userId = request.user.id;
      await this.cartsService.deleteCartItem(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ code: 400, message: error.message });
    }
  }
}
