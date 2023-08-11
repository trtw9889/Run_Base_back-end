import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { Shipment } from './shipment.entity';
import { OrderProduct } from './order_products.entity';

@Entity({ name: 'orders' })
@Unique(['orderNumber'])
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  shipmentId: number;

  @Column({ type: 'decimal', precision: 11, scale: 3, nullable: false })
  totalPrice: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  orderNumber: string;

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

  @ManyToOne(() => User, (users) => users.orders)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => Shipment, (shipments) => shipments.orders)
  @JoinColumn({ name: 'shipment_id' })
  shipments: Shipment;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.orders)
  orderProducts: OrderProduct[];
}
