import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductSize } from './product_sizes.entity';
import { Cart } from './carts.entity';
import { Order } from './orders.entity';
import { OrderStatus } from './order_status.entity';

@Entity({ name: 'order_products' })
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  productSizeId: number;

  @Column({ type: 'int' })
  cartId: number;

  @Column({ type: 'int', nullable: false })
  productQuantity: number;

  @Column({ type: 'int' })
  orderId: number;

  @Column({ type: 'int' })
  orderStatusId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => ProductSize, (productSizes) => productSizes.orderProducts)
  @JoinColumn({ name: 'product_size_id' })
  productSizes: ProductSize;

  @ManyToOne(() => Cart, (carts) => carts.orderProducts)
  @JoinColumn({ name: 'cart_id' })
  carts: Cart;

  @ManyToOne(() => Order, (orders) => orders.orderProducts)
  @JoinColumn({ name: 'order_id' })
  orders: Order;

  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orderProducts)
  @JoinColumn({ name: 'order_status_id' })
  orderStatus: OrderStatus;
}
