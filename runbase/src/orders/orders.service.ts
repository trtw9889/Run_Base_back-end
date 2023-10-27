import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/carts.entity';
import { Order } from 'src/entities/orders.entity';
import { OrderProduct } from 'src/entities/order_products.entity';
import { Shipment } from 'src/entities/shipment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  // DB 자동 변경을 위한 Logger
  // private readonly logger = new Logger(OrdersService.name);

  async createOrder(data) {
    const { userId, totalPrice } = data;
    let shipmentId = data.shipmentId;

    const orderTime = new Date();
    const year = orderTime.getFullYear();
    const month = String(orderTime.getMonth() + 1).padStart(2, '0');
    const day = String(orderTime.getDate()).padStart(2, '0');
    const hours = String(orderTime.getHours()).padStart(2, '0');
    const minutes = String(orderTime.getMinutes()).padStart(2, '0');
    const seconds = String(orderTime.getSeconds()).padStart(2, '0');
    const milliseconds = String(orderTime.getMilliseconds()).padStart(3, '0');
    const orderNumber = `${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;

    if (!shipmentId) {
      const shipment = await this.shipmentRepository.findOne({
        where: { userId },
        order: { id: 'DESC' },
      });
      shipmentId = shipment.id;
    }

    const carts = await this.cartRepository.find({
      where: { userId },
    });

    if (carts.length < 1) {
      return { message: '해당 유저에게 카트가 존재하지 않습니다.' };
    }

    const orderData = { userId, shipmentId, totalPrice, orderNumber };

    await this.orderRepository.insert(orderData);

    const order = await this.orderRepository.findOne({
      where: { userId },
      order: { id: 'DESC' },
    });

    for (const cart of carts) {
      const orderProduct = new OrderProduct();

      orderProduct.productSizeId = cart.productSizeId;
      orderProduct.productQuantity = cart.quantity;
      orderProduct.orderId = order.id;
      orderProduct.orderStatusId = 1;

      await this.orderProductRepository.save(orderProduct);

      // statusId가 1:결제완료 에서 4:배송완료로 시간이 지나면 데이터베이스에서 자동으로 바뀌게 작성한 코드
      // -----------------------------
      // const forOrderId = await this.orderProductRepository.findOne({
      //   where: { orderId: order.id },
      //   order: { id: 'DESC' },
      // });

      // setTimeout(async () => {
      //   const updatedOrderProduct = await this.orderProductRepository.findOne({
      //     where: { id: forOrderId.id },
      //   });
      //   if (updatedOrderProduct && updatedOrderProduct.orderStatusId === 1) {
      //     updatedOrderProduct.orderStatusId = 4;
      //     await this.orderProductRepository.save(updatedOrderProduct);
      //     this.logger.debug(
      //       `Updated order status for orderProduct ID: ${updatedOrderProduct.id}`,
      //     );
      //   }
      // }, 20000);
      // ------------------------------

      await this.cartRepository.delete(cart.id);
    }

    return { message: '결제를 완료하였습니다.' };
  }
}
