import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from 'src/entities/shipment.entity';
import { Repository } from 'typeorm';
import { AddShipmentsDto, UpdateShipmentsDto } from './shipmentsDto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentsRepository: Repository<Shipment>,
  ) {}

  async addShipmentList(userId: number, AddShipmentsDto: AddShipmentsDto) {
    const newShipment = this.shipmentsRepository.create({
      userId,
      ...AddShipmentsDto,
    });

    if (newShipment.storage === false && newShipment.isMainAddress === true) {
      return { message: 'storage도 true로 해주세요' };
    }

    if (newShipment.isMainAddress === true) {
      const MainAddressShipment = await this.shipmentsRepository.findOne({
        where: { userId: userId, isMainAddress: true },
      });

      if (MainAddressShipment !== null) {
        MainAddressShipment.isMainAddress = false;

        await this.shipmentsRepository.save(MainAddressShipment);
      }
    }

    await this.shipmentsRepository.save(newShipment);
    return { message: '배송지 추가가 완료되었습니다.' };
  }

  async findShipments(userId: number) {
    return await this.shipmentsRepository.find({
      where: { userId: userId, storage: true },
    });
  }

  async findShipmentsById(userId: number, shipmentId: number) {
    const shipments = await this.findShipments(userId);
    return shipments.find((shipment) => shipment.id === shipmentId);
  }

  async getMainAdress(userId: number) {
    const shipment = await this.shipmentsRepository.findOne({
      where: { userId: userId, isMainAddress: true },
    });

    if (shipment === null) {
      return { message: '기본배송지가 저장되어있지 않습니다' };
    }
    return shipment;
  }

  async updateShipment(
    userId: number,
    shipmentId: number,
    UpdateShipmentsDto: UpdateShipmentsDto,
  ) {
    const shipment = await this.findShipmentsById(userId, shipmentId);

    Object.assign(shipment, UpdateShipmentsDto);
    // 수정된 Shipment 객체를 데이터베이스에 저장하여 업데이트합니다.
    await this.shipmentsRepository.save(shipment);

    return { message: '배송지 수정 완료되었습니다.' };
  }

  async deleteShipmentList(userId: number, shipmentId: number) {
    const shipment = await this.findShipmentsById(userId, shipmentId);
    shipment.storage = false;
    shipment.isMainAddress = false;

    await this.shipmentsRepository.save(shipment);
  }
}
