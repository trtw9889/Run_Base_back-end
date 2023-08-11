import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProductSize } from './product_sizes.entity';

@Entity({ name: 'sizes' })
export class Size extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => ProductSize, (productSizes) => productSizes.sizes)
  productSizes: ProductSize[];
}
