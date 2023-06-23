// Typeorm
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
// Entities
import Menu from './Menu';
import Active from './Active';
import User from './User';
// Generators & Validators
import { IsNumber, IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('foods')
// unique constraints
@Index(['name', 'menu'], { unique: true })
export default class Food extends Active {
  constructor(food: Partial<Food>) {
    super();
    Object.assign(this, food);
  }

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => Menu, (menu) => menu.foods, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'menu',
    referencedColumnName: 'id',
  })
  menu: Partial<Menu>;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price should be a valid decimal with 2 decimal place maximum' })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.foods, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'createdBy',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
