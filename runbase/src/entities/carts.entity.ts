import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderProduct } from './order_products.entity';
import { User } from './users.entity';
import { ProductSize } from './product_sizes.entity';

@Entity({ name: 'carts' })
@Unique(['user_id', 'product_size_id'])
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  product_size_id: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @OneToMany(() => OrderProduct, (order_products) => order_products.carts)
  order_products: OrderProduct[];

  @ManyToOne(() => User, (users) => users.carts)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => ProductSize, (product_sizes) => product_sizes.carts)
  @JoinColumn({ name: 'product_size_id' })
  product_sizes: ProductSize;
}
