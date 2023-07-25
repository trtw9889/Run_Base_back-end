import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { Order } from './orders.entity';

@Entity({ name: 'shipments' })
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  receiver: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_main_address: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  storage: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  street_address: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  detail_address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  zipcode: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  phone_number: number;

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

  @ManyToOne(() => User, (users) => users.shipments)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @OneToMany(() => Order, (orders) => orders.shipments)
  orders: Order[];
}
