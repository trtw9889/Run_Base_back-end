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
  product_size_id: number;

  @Column({ type: 'int' })
  cart_id: number;

  @Column({ type: 'int', nullable: false })
  product_quantity: number;

  @Column({ type: 'int' })
  order_id: number;

  @Column({ type: 'int' })
  order_status_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;

  @ManyToOne(() => ProductSize, (product_sizes) => product_sizes.order_products)
  @JoinColumn({ name: 'product_size_id' })
  product_sizes: ProductSize;

  @ManyToOne(() => Cart, (carts) => carts.order_products)
  @JoinColumn({ name: 'cart_id' })
  carts: Cart;

  @ManyToOne(() => Order, (orders) => orders.order_products)
  @JoinColumn({ name: 'order_id' })
  orders: Order;

  @ManyToOne(() => OrderStatus, (order_status) => order_status.order_products)
  @JoinColumn({ name: 'order_status_id' })
  order_status: OrderStatus;
}
