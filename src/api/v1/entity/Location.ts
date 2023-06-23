// Typeorm
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Entities
import Date from './Date';
import Country from './Country';
import User from './User';
import Restaurant from './Restaurant';
// Generators & Validators
import { Length, IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('locations')
// unique constraints
@Index(['address', 'country'], { unique: true })
export default class Location extends Date {
  constructor(location: Partial<Location>) {
    super();
    Object.assign(this, location);
  }

  @Column('varchar', { length: 128, nullable: false })
  @Length(3, 128, { message: 'Address must be at least 3 characters long.' })
  address: string;

  @IsUUID('all', { message: invalidIdentifier })
  @ManyToOne(() => Country, (country) => country.locations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'country',
    referencedColumnName: 'id',
  })
  country: Partial<Country>;

  @OneToMany(() => User, (user) => user.location)
  users: User[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.location)
  restaurants: Restaurant[];

  @Column('varchar', { length: 25, nullable: true, unique: true })
  phone: string;

  @ManyToOne(() => User, (user) => user.locations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'createdBy',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
