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
@Unique(['userId', 'productSizeId'])
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  productSizeId: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.carts)
  orderProducts: OrderProduct[];

  @ManyToOne(() => User, (users) => users.carts)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(() => ProductSize, (productSizes) => productSizes.carts)
  @JoinColumn({ name: 'product_size_id' })
  productSizes: ProductSize;
}
