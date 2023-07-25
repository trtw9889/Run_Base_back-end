import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './products.entity';
import { Size } from './sizes.entity';
import { OrderProduct } from './order_products.entity';
import { Cart } from './carts.entity';

@Entity({ name: 'product_sizes' })
@Unique(['product_id', 'size_id'])
export class ProductSize extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  product_id: number;

  @Column({ type: 'int', nullable: false })
  size_id: number;

  @Column({ type: 'text', nullable: false })
  url: string;

  @ManyToOne(() => Product, (products) => products.product_sizes)
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @ManyToOne(() => Size, (sizes) => sizes.product_sizes)
  @JoinColumn({ name: 'size_id' })
  sizes: Size;

  @OneToMany(
    () => OrderProduct,
    (order_products) => order_products.product_sizes,
  )
  order_products: OrderProduct[];

  @OneToMany(() => Cart, (carts) => carts.product_sizes)
  carts: Cart[];
}
