import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProductReview } from './product_reviews.entity';
import { Shipment } from './shipment.entity';
import { Order } from './orders.entity';
import { Cart } from './carts.entity';

@Entity({ name: 'users' })
@Unique(['email'])
@Unique(['phone_number'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  phone_number: number;

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

  @OneToMany(() => ProductReview, (product_reviews) => product_reviews.users)
  product_reviews: ProductReview[];

  @OneToMany(() => Shipment, (shipments) => shipments.users)
  shipments: Shipment[];

  @OneToMany(() => Order, (orders) => orders.users)
  orders: Order[];

  @OneToMany(() => Cart, (carts) => carts.users)
  carts: Cart[];
}
