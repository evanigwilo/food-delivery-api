// Typeorm
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
// Entities
import Date from './Date';
import User from './User';
// Generators & Validators
import { IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('balances')
export default class Balance extends Date {
  constructor(balance: Partial<Balance>) {
    super();
    Object.assign(this, balance);
  }

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  amount: number;

  @IsUUID('all', { message: invalidIdentifier })
  @OneToOne(() => User, (user) => user.balance, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
