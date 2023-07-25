import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Product } from './products.entity';
import { Image } from './images.entity';

@Entity({ name: 'colors' })
export class Color extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => Product, (products) => products.colors)
  products: Product[];

  @OneToMany(() => Image, (images) => images.colors)
  images: Image[];
}
