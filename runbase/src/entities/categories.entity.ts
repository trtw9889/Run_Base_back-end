import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Product } from './products.entity';

@Entity({ name: 'categories' })
@Unique(['name'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => Product, (products) => products.categories)
  products: Product[];
}
