import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShipmentsService } from './shipments.service';
import { AddShipmentsDto, UpdateShipmentsDto } from './shipmentsDto';

@Controller('shipments')
@UseGuards(AuthGuard)
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentsService) {}

  @Post('/addShipment')
  async addShipment(
    @Request() request,
    @Body() AddShipmentsDto: AddShipmentsDto,
  ) {
    const userId = request.user.id;

    return this.shipmentsService.addShipmentList(userId, AddShipmentsDto);
  }

  @Get('/getShipmentList')
  async Shipmentlist(@Request() request) {
    const userId = request.user.id;
    return await this.shipmentsService.findShipments(userId);
  }

  // @Get('/getShipmentListById/:shipmentId')
  // async Shipment(@Request() request, @Param('shipmentId') shipmentId: number) {
  //   const userId = request.user.id;
  //   return await this.shipmentsService.findShipmentsById(userId, shipmentId);
  // }

  @Get('/getMainAdress')
  async MainAdress(@Request() request) {
    const userId = request.user.id;
    return await this.shipmentsService.getMainAdress(userId);
  }

  @Put('/updateShipment/:shipmentId')
  async updateCart(
    @Request() request,
    @Param('shipmentId') shipmentId: number,
    @Body() UpdateShipmentsDto: UpdateShipmentsDto,
  ) {
    const userId = request.user.id;
    return await this.shipmentsService.updateShipment(
      userId,
      shipmentId,
      UpdateShipmentsDto,
    );
  }

  @Patch('/deleteShipment/:id')
  async deleteShipment(@Request() request, @Param('id') shipmentId: number) {
    const userId = request.user.id;
    return await this.shipmentsService.deleteShipmentList(userId, shipmentId);
  }
}
