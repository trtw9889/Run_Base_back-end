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
@Unique(['productId', 'sizeId'])
export class ProductSize extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  sizeId: number;

  @ManyToOne(() => Product, (products) => products.productSizes)
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @ManyToOne(() => Size, (sizes) => sizes.productSizes)
  @JoinColumn({ name: 'size_id' })
  sizes: Size;

  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.productSizes)
  orderProducts: OrderProduct[];

  @OneToMany(() => Cart, (carts) => carts.productSizes)
  carts: Cart[];
}
