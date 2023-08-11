import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Color } from './colors.entity';

@Entity({ name: 'images' })
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 400, nullable: false })
  serialNumber: string;

  @Column({ type: 'int', nullable: false })
  colorId: number;

  @Column({ type: 'text', nullable: false })
  url: string;

  @ManyToOne(() => Color, (colors) => colors.images)
  @JoinColumn({ name: 'color_id' })
  colors: Color;
}
