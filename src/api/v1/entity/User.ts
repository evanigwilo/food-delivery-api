// Typeorm
import { Entity, Column, BeforeInsert, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
// Generators & Validators
import argon2 from 'argon2';
import { IsEmail, Length, Matches } from 'class-validator';
// Entities
import Location from './Location';
import Date from './Date';
import Payment from './Payment';
import Balance from './Balance';
import Restaurant from './Restaurant';
import Menu from './Menu';
import Food from './Food';
import Country from './Country';

// Database name
@Entity('users')
export default class User extends Date {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ length: 100, unique: true })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @Column('varchar', { length: 25, unique: true })
  @Length(3, 25, { message: 'Username must be between 3 to 25 characters long.' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username should contain only letters and numbers.' })
  username: string;

  @Column('varchar', { length: 256, select: false })
  @Length(6, 256, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @ManyToOne(() => Location, (location) => location.users, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'location',
    referencedColumnName: 'id',
  })
  location: Location;

  @OneToMany(() => Payment, (payment) => payment.createdBy)
  payments: Payment[];

  @OneToOne(() => Balance, (balance) => balance.createdBy, { nullable: false, onDelete: 'CASCADE' })
  balance: Partial<Balance>;

  @OneToMany(() => Menu, (menu) => menu.createdBy)
  menus: Menu[];

  @OneToMany(() => Location, (location) => location.createdBy)
  locations: Location[];

  @OneToMany(() => Food, (food) => food.createdBy)
  foods: Food[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.createdBy)
  restaurants: Restaurant[];

  @OneToMany(() => Country, (country) => country.createdBy)
  countries: Country[];

  @BeforeInsert()
  protected async beforeInsert() {
    // name and email to lowercase
    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
    // hash password before save;
    this.password = await argon2.hash(this.password);
  }
}
