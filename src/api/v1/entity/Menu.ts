// Typeorm
import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Entities
import Restaurant from './Restaurant';
import Active from './Active';
import Food from './Food';
import User from './User';
// Generators & Validators
import { IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('menus')
// unique constraints
@Index(['name', 'restaurant'], { unique: true })
export default class Menu extends Active {
  constructor(menu: Partial<Menu>) {
    super();
    Object.assign(this, menu);
  }

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'restaurant',
    referencedColumnName: 'id',
  })
  restaurant: Partial<Restaurant>;

  @OneToMany(() => Food, (food) => food.menu)
  foods: Food[];

  @ManyToOne(() => User, (user) => user.menus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'createdBy',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
