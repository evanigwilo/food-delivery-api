// Typeorm
import { Column } from 'typeorm';
// Entities
import Date from './Date';
// Generators & Validators
import { Length } from 'class-validator';

export default abstract class Active extends Date {
  @Column('varchar', { length: 128 })
  @Length(3, 128, { message: 'Name must be between 3 to 128 characters long.' })
  name: string;

  @Column('boolean', { default: true })
  active: boolean;
}
