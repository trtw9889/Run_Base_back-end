import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Product } from './products.entity';

@Entity({ name: 'genders' })
@Unique(['name'])
export class Gender extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => Product, (products) => products.genders)
  products: Product[];
}
