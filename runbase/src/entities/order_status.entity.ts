import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { OrderProduct } from './order_products.entity';

@Entity({ name: 'order_status' })
@Unique(['name'])
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.orderStatus)
  orderProducts: OrderProduct[];
}
