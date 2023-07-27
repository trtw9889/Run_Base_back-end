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
  gender_id: number;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'varchar', length: 400, nullable: false })
  serial_number: string;

  @Column({ type: 'int', nullable: false })
  color_id: number;

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

  @ManyToOne(() => Gender, (genders) => genders.products)
  @JoinColumn({ name: 'gender_id' })
  genders: Gender;

  @ManyToOne(() => Category, (categories) => categories.products)
  @JoinColumn({ name: 'category_id' })
  categories: Category;

  @ManyToOne(() => Color, (colors) => colors.products)
  @JoinColumn({ name: 'color_id' })
  colors: Color;

  @OneToMany(() => ProductSize, (product_sizes) => product_sizes.products)
  product_sizes: ProductSize[];

  @OneToMany(() => ProductReview, (product_reviews) => product_reviews.products)
  product_reviews: ProductReview[];
}
