// Typeorm
import { Entity, Column, OneToMany, JoinColumn, ManyToOne, Index } from 'typeorm';
// Entities
import Active from './Active';
import Location from './Location';
import Menu from './Menu';
import User from './User';
// Generators & Validators
import { Max, Min, IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier, invalidRate } from '../constants';

// Database name
@Entity('restaurants')
// unique constraints
@Index(['location'], { unique: true })
export default class Restaurant extends Active {
  constructor(restaurant: Partial<Restaurant>) {
    super();
    Object.assign(this, restaurant);
  }

  @Column('smallint', { default: 8 })
  @Min(0, { message: invalidRate })
  @Max(10, { message: invalidRate })
  rating: number;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => Location, (location) => location.restaurants, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'location',
    referencedColumnName: 'id',
  })
  location: Partial<Location>;

  @ManyToOne(() => User, (user) => user.restaurants, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'createdBy',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
