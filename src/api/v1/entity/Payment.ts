// Typeorm
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Entities
import User from './User';
import Date from './Date';
import Order from './Order';
// Generators & Validators
import { IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';
import { PaymentStatus } from '../types/enum';

// Database name
@Entity('payments')
export default class Payment extends Date {
  constructor(payment: Partial<Payment>) {
    super();
    Object.assign(this, payment);
  }

  @Column({ type: 'enum', enum: PaymentStatus, nullable: false })
  status: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column('int', { nullable: false })
  total: number;

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => User, (user) => user.payments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;

  @OneToMany(() => Order, (order) => order.payment)
  orders: Order[];
}
