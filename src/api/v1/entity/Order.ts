// Typeorm
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// Entities
import Date from './Date';
import Payment from './Payment';
// Generators & Validators
import { IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('orders')
export default class Order extends Date {
  constructor(order: Partial<Order>) {
    super();
    Object.assign(this, order);
  }

  @Column('varchar', { length: 128, nullable: false })
  food_name: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  food_price: number;

  @Column('int', { nullable: false })
  count: number;

  @Column('varchar', { length: 128, nullable: false })
  menu: string;

  @Column('varchar', { length: 128, nullable: false })
  restaurant_name: string;

  @Column('varchar', { length: 128, nullable: false })
  restaurant_address: string;

  @Column('varchar', { length: 128, nullable: false })
  restaurant_country: string;

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => Payment, (payment) => payment.orders, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'payment',
    referencedColumnName: 'id',
  })
  payment: Payment;
}
