import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { User } from './users.entity';

@Entity({ name: 'product_reviews' })
export class ProductReview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  product_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  comment: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: false })
  rating: number;

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

  @ManyToOne(() => Product, (products) => products.product_reviews)
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @ManyToOne(() => User, (users) => users.product_reviews)
  @JoinColumn({ name: 'user_id' })
  users: User;
}
