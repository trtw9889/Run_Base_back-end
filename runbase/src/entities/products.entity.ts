import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender } from './genders.entity';
import { Category } from './categories.entity';
import { Color } from './colors.entity';
import { ProductSize } from './product_sizes.entity';
import { ProductReview } from './product_reviews.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: true })
  genderId: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'varchar', length: 400, nullable: false })
  serialNumber: string;

  @Column({ type: 'int', nullable: false })
  colorId: number;

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

  @ManyToOne(() => Gender, (genders) => genders.products)
  @JoinColumn({ name: 'gender_id' })
  genders: Gender;

  @ManyToOne(() => Category, (categories) => categories.products)
  @JoinColumn({ name: 'category_id' })
  categories: Category;

  @ManyToOne(() => Color, (colors) => colors.products)
  @JoinColumn({ name: 'color_id' })
  colors: Color;

  @OneToMany(() => ProductSize, (productSizes) => productSizes.products)
  productSizes: ProductSize[];

  @OneToMany(() => ProductReview, (productReviews) => productReviews.products)
  productReviews: ProductReview[];
}
