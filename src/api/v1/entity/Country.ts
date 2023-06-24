// Typeorm
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// Generators & Validators
import { IsNotEmpty, Length } from 'class-validator';
// Entities
import Date from './Date';
import Location from './Location';
import User from './User';

// Database name
@Entity('countries')
export default class Country extends Date {
  constructor(country: Partial<Country>) {
    super();
    Object.assign(this, country);
  }

  @IsNotEmpty({ message: 'Name is invalid.' })
  @Column('varchar', { length: 128, unique: true, nullable: false })
  name: string;

  @Length(2, 2, { message: 'Code is invalid.' })
  @Column('varchar', { length: 2, unique: true, nullable: false })
  code: string;

  @IsNotEmpty({ message: 'Emoji is invalid.' })
  @Column('text', { unique: true, nullable: false })
  emoji: string;

  @OneToMany(() => Location, (location) => location.country)
  locations: Location[];

  @ManyToOne(() => User, (user) => user.countries, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'createdBy',
    referencedColumnName: 'id',
  })
  createdBy: Partial<User>;
}
