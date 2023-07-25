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
@Unique(['order_number'])
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  shipment_id: number;

  @Column({ type: 'decimal', precision: 11, scale: 3, nullable: false })
  total_price: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  order_number: string;

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

  @ManyToOne(() => User, (users) => users.orders)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => Shipment, (shipments) => shipments.orders)
  @JoinColumn({ name: 'shipment_id' })
  shipments: Shipment;

  @OneToMany(() => OrderProduct, (order_products) => order_products.orders)
  order_products: OrderProduct[];
}
